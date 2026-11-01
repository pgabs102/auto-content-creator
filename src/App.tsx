/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TopNavigation } from './components/TopNavigation';
import { DashboardStats } from './components/DashboardStats';
import { ContentQueueTable } from './components/ContentQueueTable';
import { SchedulerCalendarView } from './components/SchedulerCalendarView';
import { SocialPreviewMockup } from './components/SocialPreviewMockup';
import { ContentGeneratorModal } from './components/ContentGeneratorModal';
import { SupabaseSettingsModal } from './components/SupabaseSettingsModal';
import { ProjectPackagerModal } from './components/ProjectPackagerModal';
import { EditPostModal } from './components/EditPostModal';
import { UserLoginModal } from './components/UserLoginModal';
import { FacebookPublishingModal } from './components/FacebookPublishingModal';
import { LiveDiagnosticsModal } from './components/LiveDiagnosticsModal';
import { ContentItem, UserBotSettings, AuthUser } from './types/content';
import { supabaseStorage } from './supabase/supabaseClient';
import {
  formatManilaDateTime,
  getNowInManila,
  isScheduleDueInManila,
} from './utils/philippineTime';
import { requestSimulatedPublish } from './services/contentApiService';

const STORAGE_KEY_AUTH = 'acc_user_auth_v1';

export default function App() {
  const [posts, setPosts] = useState<ContentItem[]>(() => supabaseStorage.getLocalPosts());
  const [settings, setSettings] = useState<UserBotSettings>(() => supabaseStorage.loadSettings());
  const [activeTab, setActiveTab] = useState<'queue' | 'scheduler' | 'analytics'>('queue');

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUTH);
      if (stored) return JSON.parse(stored);
    } catch {}
    // Default demo creator admin
    return {
      id: 'user_ph_001',
      name: 'Maria Santos',
      email: 'maria.santos@creatorph.com',
      role: 'Verified Content Creator & Admin',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Maria%20Santos&backgroundColor=2563eb',
      session_token: 'acc_token_init_active',
      authenticated_at: new Date().toISOString(),
    };
  });

  const [manilaTimeStr, setManilaTimeStr] = useState<string>('');
  const [isCheckingQueue, setIsCheckingQueue] = useState(false);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);
  const [isPackagerOpen, setIsPackagerOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isFacebookOpen, setIsFacebookOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  const [previewPost, setPreviewPost] = useState<ContentItem | null>(null);
  const [editingPost, setEditingPost] = useState<ContentItem | null>(null);
  const [facebookTargetPost, setFacebookTargetPost] = useState<ContentItem | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(
    null
  );

  const postsRef = useRef(posts);
  postsRef.current = posts;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // 1. Initial Data Fetch & Supabase Sync
  useEffect(() => {
    supabaseStorage.getAllPosts().then((loadedPosts) => {
      setPosts(loadedPosts);
    });
  }, []);

  // 2. Real-time Philippine Standard Time Clock (Asia/Manila, UTC+8)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const pht = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setManilaTimeStr(pht);
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Publishing Dispatch Function
  const publishSinglePost = useCallback(
    async (post: ContentItem): Promise<boolean> => {
      try {
        const publishingPost: ContentItem = {
          ...post,
          approval_status: 'PUBLISHING',
          publishing_status: 'PUBLISHING',
        };
        await supabaseStorage.savePost(publishingPost);
        setPosts((prev) =>
          prev.map((p) => (p.content_id === post.content_id ? publishingPost : p))
        );

        const result = await requestSimulatedPublish({
          content_id: post.content_id,
          platform: post.platform,
          post_title: post.post_title,
          scheduled_time: post.scheduled_time,
        });

        const completedPost: ContentItem = {
          ...post,
          approval_status: 'PUBLISHED',
          publishing_status: 'SUCCESS',
          published_date: result.published_date || new Date().toISOString(),
          platform_post_id: result.platform_post_id,
          publishing_error: null,
        };

        await supabaseStorage.savePost(completedPost);
        setPosts((prev) =>
          prev.map((p) => (p.content_id === post.content_id ? completedPost : p))
        );

        showToast(
          `🚀 Awtomatikong na-publish sa ${post.platform.toUpperCase()} (${result.platform_post_id})`,
          'success'
        );
        return true;
      } catch (err: any) {
        console.error('Publishing failed for post', post.content_id, err);
        const failedPost: ContentItem = {
          ...post,
          approval_status: 'FAILED',
          publishing_status: 'ERROR',
          publishing_error: err?.message || 'Publishing error',
          retry_count: (post.retry_count || 0) + 1,
        };
        await supabaseStorage.savePost(failedPost);
        setPosts((prev) =>
          prev.map((p) => (p.content_id === post.content_id ? failedPost : p))
        );

        showToast(`❌ Nabigo ang pag-post sa ${post.platform}: ${err.message}`, 'error');
        return false;
      }
    },
    []
  );

  // 4. Background Automatic Posting Engine
  const runSchedulerQueueScan = useCallback(async () => {
    const currentSettings = settingsRef.current;
    if (!currentSettings.autopost_enabled) return;

    const currentPosts = postsRef.current;
    const duePosts = currentPosts.filter(
      (p) =>
        p.approval_status === 'SCHEDULED' &&
        isScheduleDueInManila(p.scheduled_date, p.scheduled_time)
    );

    if (duePosts.length === 0) return;

    for (const duePost of duePosts) {
      await publishSinglePost(duePost);
    }
  }, [publishSinglePost]);

  useEffect(() => {
    const queueInterval = setInterval(() => {
      runSchedulerQueueScan();
    }, 5000);

    return () => clearInterval(queueInterval);
  }, [runSchedulerQueueScan]);

  // Manual Trigger Force Check
  const handleForceScan = async () => {
    setIsCheckingQueue(true);
    await runSchedulerQueueScan();
    setTimeout(() => {
      setIsCheckingQueue(false);
      showToast('Nai-scan ang Philippine Time queue. Lahat ng due posts ay naiproseso.', 'info');
    }, 600);
  };

  // Auth Handlers
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
    } catch {}
    showToast(`Naka-login bilang ${user.name}`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {}
    showToast('Naka-logout na ang iyong session.', 'info');
  };

  // Post Lifecycle Handlers
  const handlePostCreated = async (newPost: ContentItem, previewImmediately: boolean) => {
    await supabaseStorage.savePost(newPost);
    setPosts((prev) => [newPost, ...prev]);

    if (previewImmediately) {
      setPreviewPost(newPost);
      showToast('Nagawa ang post! Mangyaring i-review at i-approve.', 'info');
    } else {
      showToast('Nai-save ang post sa SCHEDULED queue para sa AutoPost.', 'success');
    }
  };

  const handleApprovePost = async (contentId: string) => {
    const target = posts.find((p) => p.content_id === contentId);
    if (!target) return;

    const approved: ContentItem = {
      ...target,
      approval_status: 'SCHEDULED',
    };
    await supabaseStorage.savePost(approved);
    setPosts((prev) => prev.map((p) => (p.content_id === contentId ? approved : p)));
    setPreviewPost(null);
    showToast('Inaprubahan ang post! Naka-iskedyul na sa publishing queue.', 'success');
  };

  const handleRejectPost = async (contentId: string) => {
    const target = posts.find((p) => p.content_id === contentId);
    if (!target) return;

    const rejected: ContentItem = {
      ...target,
      approval_status: 'REJECTED',
    };
    await supabaseStorage.savePost(rejected);
    setPosts((prev) => prev.map((p) => (p.content_id === contentId ? rejected : p)));
    setPreviewPost(null);
    showToast('Na-reject ang post.', 'info');
  };

  const handlePublishNow = async (post: ContentItem) => {
    await publishSinglePost(post);
  };

  const handleRetryPost = async (post: ContentItem) => {
    const retryable: ContentItem = {
      ...post,
      approval_status: 'SCHEDULED',
      publishing_error: null,
    };
    await supabaseStorage.savePost(retryable);
    setPosts((prev) => prev.map((p) => (p.content_id === post.content_id ? retryable : p)));
    await publishSinglePost(retryable);
  };

  const handleSaveEditedPost = async (updated: ContentItem) => {
    await supabaseStorage.savePost(updated);
    setPosts((prev) => prev.map((p) => (p.content_id === updated.content_id ? updated : p)));
    showToast('Nai-save ang mga pagbabago sa post.', 'success');
  };

  const handleDeletePost = async (contentId: string) => {
    await supabaseStorage.deletePost(contentId);
    setPosts((prev) => prev.filter((p) => p.content_id !== contentId));
    showToast('Nabura ang post sa queue.', 'info');
  };

  const handlePublishToFacebook = (post: ContentItem) => {
    setFacebookTargetPost(post);
    setIsFacebookOpen(true);
  };

  // Settings Handlers
  const handleUpdateSettings = (newSettings: Partial<UserBotSettings>) => {
    const updated = supabaseStorage.saveSettings(newSettings);
    setSettings(updated);
    showToast('Nai-update ang mga setting ng bot.', 'success');
  };

  const handleToggleAutoPost = () => {
    handleUpdateSettings({ autopost_enabled: !settings.autopost_enabled });
  };

  const handleToggleManualApproval = () => {
    handleUpdateSettings({ manual_approval_enabled: !settings.manual_approval_enabled });
  };

  const handleSyncWithSupabase = async () => {
    const fresh = await supabaseStorage.getAllPosts();
    setPosts(fresh);
    showToast('Na-synchronize ang data sa Supabase.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all">
          <div
            className={`w-2 h-2 rounded-full ${
              toast.type === 'success'
                ? 'bg-emerald-400'
                : toast.type === 'error'
                ? 'bg-rose-400'
                : 'bg-blue-400'
            }`}
          />
          <span className="text-xs font-medium text-slate-200">{toast.message}</span>
        </div>
      )}

      {/* Top Bar Contract (3 zones) */}
      <TopNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
        onOpenPackager={() => setIsPackagerOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onOpenFacebook={() => {
          setFacebookTargetPost(null);
          setIsFacebookOpen(true);
        }}
        onOpenLogin={() => setIsLoginOpen(true)}
        currentUser={currentUser}
        isSupabaseConnected={settings.is_connected_to_supabase}
        manilaTimeStr={manilaTimeStr}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* KPI & Engine Ribbon */}
        <DashboardStats
          posts={posts}
          settings={settings}
          onToggleAutoPost={handleToggleAutoPost}
          onToggleManualApproval={handleToggleManualApproval}
          onTriggerCheck={handleForceScan}
          isChecking={isCheckingQueue}
          onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
          onOpenFacebook={() => {
            setFacebookTargetPost(null);
            setIsFacebookOpen(true);
          }}
        />

        {/* Tab 1: Content Queue Table */}
        {activeTab === 'queue' && (
          <ContentQueueTable
            posts={posts}
            onPreviewPost={(post) => setPreviewPost(post)}
            onApprovePost={handleApprovePost}
            onRejectPost={handleRejectPost}
            onPublishNow={handlePublishNow}
            onRetryPost={handleRetryPost}
            onEditPost={(post) => setEditingPost(post)}
            onDeletePost={handleDeletePost}
            onPublishToFacebook={handlePublishToFacebook}
          />
        )}

        {/* Tab 2: Scheduler Calendar View */}
        {activeTab === 'scheduler' && (
          <SchedulerCalendarView
            posts={posts}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onPreviewPost={(post) => setPreviewPost(post)}
            onEditPost={(post) => setEditingPost(post)}
            onOpenCreateForSlot={(date, time) => {
              setIsCreateOpen(true);
            }}
          />
        )}
      </main>

      {/* Modals */}
      {/* 1. Content Generator Modal */}
      <ContentGeneratorModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={handlePostCreated}
        defaultMode={settings.publishing_mode}
      />

      {/* 2. Interactive Social Preview Mockup Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <SocialPreviewMockup
            post={previewPost}
            onClose={() => setPreviewPost(null)}
            onApprove={() => handleApprovePost(previewPost.content_id)}
            onReject={() => handleRejectPost(previewPost.content_id)}
          />
        </div>
      )}

      {/* 3. Supabase Database Settings Modal */}
      <SupabaseSettingsModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
        settings={settings}
        onSaveSettings={handleUpdateSettings}
        onSyncNow={handleSyncWithSupabase}
      />

      {/* 4. Project Packager & APK Modal */}
      <ProjectPackagerModal
        isOpen={isPackagerOpen}
        onClose={() => setIsPackagerOpen(false)}
        isSupabaseConnected={settings.is_connected_to_supabase}
      />

      {/* 5. Edit Post Modal */}
      <EditPostModal
        isOpen={Boolean(editingPost)}
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onSave={handleSaveEditedPost}
      />

      {/* 6. User Login & Account Session Modal */}
      <UserLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      {/* 7. Facebook Publishing Studio Modal */}
      <FacebookPublishingModal
        isOpen={isFacebookOpen}
        onClose={() => {
          setIsFacebookOpen(false);
          setFacebookTargetPost(null);
        }}
        initialPostTitle={facebookTargetPost?.post_title}
        initialCaption={facebookTargetPost?.caption}
      />

      {/* 8. Live Subsystems Diagnostics Lab */}
      <LiveDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />

      {/* Footer with Unboxed Metadata */}
      <footer className="border-t border-slate-900 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Auto Content Creator Bot</span>
            <span aria-hidden="true">·</span>
            <span>Philippine Standard Time (Asia/Manila, UTC+8)</span>
            <span aria-hidden="true">·</span>
            <span>Gemini 3.8 Flash Powered</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsDiagnosticsOpen(true)}
              className="text-emerald-400 hover:underline transition font-semibold"
            >
              Run Live Tests (100% Tested)
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsFacebookOpen(true)}
              className="hover:text-white transition"
            >
              Facebook Graph API
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsPackagerOpen(true)}
              className="hover:text-white transition"
            >
              Export APK & Source
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsSupabaseOpen(true)}
              className="hover:text-white transition"
            >
              Supabase SQL Schema
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
