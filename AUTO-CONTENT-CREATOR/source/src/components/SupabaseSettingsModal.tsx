/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Database,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Code,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { UserBotSettings } from '../types/content';
import { supabaseStorage } from '../supabase/supabaseClient';

interface SupabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserBotSettings;
  onSaveSettings: (newSettings: Partial<UserBotSettings>) => void;
  onSyncNow: () => Promise<void>;
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onSyncNow,
}) => {
  const [url, setUrl] = useState(settings.supabase_url);
  const [anonKey, setAnonKey] = useState(settings.supabase_anon_key);
  const [testingStatus, setTestingStatus] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
  }>({ loading: false });

  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'schema'>('config');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestingStatus({ loading: true });
    const res = await supabaseStorage.testSupabaseConnection(url, anonKey);
    setTestingStatus({
      loading: false,
      success: res.success,
      message: res.message,
    });
  };

  const handleSave = () => {
    onSaveSettings({
      supabase_url: url.trim(),
      supabase_anon_key: anonKey.trim(),
    });
    onClose();
  };

  const sqlSchemaSnippet = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.social_posts (
    content_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_title TEXT NOT NULL,
    caption TEXT NOT NULL,
    hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
    image_url TEXT DEFAULT '',
    image_prompt TEXT DEFAULT '',
    platform VARCHAR(50) NOT NULL,
    content_category VARCHAR(100) NOT NULL,
    target_audience TEXT DEFAULT 'Filipino audience',
    language_style VARCHAR(30) DEFAULT 'taglish',
    date_created TIMESTAMPTZ DEFAULT NOW(),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    approval_status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL',
    publishing_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    published_date TIMESTAMPTZ NULL,
    publishing_error TEXT NULL,
    platform_post_id TEXT NULL,
    retry_count INT DEFAULT 0
);

ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access" ON public.social_posts FOR ALL USING (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Supabase Database Configuration
              </h3>
              <p className="text-xs text-slate-400">
                Persistent storage para sa lahat ng generated at scheduled posts
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="px-6 pt-3 flex items-center gap-3 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 font-semibold transition ${
              activeTab === 'config'
                ? 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Connection Settings
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-2.5 font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Database Schema & SQL
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {activeTab === 'config' ? (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Dual-Layer Sync Architecture
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Ang system ay may integrated offline local storage. Kapag inilagay mo ang Supabase Project credentials, awtomatikong mag-si-sync ang lahat ng data sa live database.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  placeholder="https://xyzabcdefghijk.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Supabase Publishable Anon Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {testingStatus.message && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                    testingStatus.success
                      ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/60 border-rose-800 text-rose-300'
                  }`}
                >
                  {testingStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{testingStatus.message}</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingStatus.loading}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${testingStatus.loading ? 'animate-spin' : ''}`}
                  />
                  {testingStatus.loading ? 'Sinusuri...' : 'Test Connection'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  SQL definition para sa <code className="text-emerald-400 font-mono">social_posts</code> table:
                </span>
                <button
                  onClick={handleCopySql}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSql ? 'Copied!' : 'Copy SQL'}
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-64 leading-relaxed">
                {sqlSchemaSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-950">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
          >
            Isara
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            I-save ang Settings
          </button>
        </div>
      </div>
    </div>
  );
};
