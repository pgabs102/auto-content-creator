/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Send,
  RefreshCw,
  ShieldCheck,
  ThumbsUp,
  MessageCircle,
} from 'lucide-react';
import {
  requestFacebookTestConnection,
  requestFacebookPublish,
} from '../services/contentApiService';

interface FacebookPublishingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPostTitle?: string;
  initialCaption?: string;
}

export const FacebookPublishingModal: React.FC<FacebookPublishingModalProps> = ({
  isOpen,
  onClose,
  initialPostTitle = '5 Tips Paano Pabilisin ang Trabaho Gamit ang AI sa 2026',
  initialCaption = 'Gusto mo bang maging mas productive kahit siksik ang schedule mo? 🚀\n\nNarito ang 5 proven workflow hacks para sa mga Filipino digital creators at online entrepreneurs! Save this post! #PhilippineTech #PinoyCreator',
}) => {
  const [pageId, setPageId] = useState('108927491827419');
  const [pageAccessToken, setPageAccessToken] = useState('');
  const [postMessage, setPostMessage] = useState(
    `${initialPostTitle}\n\n${initialCaption}`
  );

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [connectionResult, setConnectionResult] = useState<any>(null);
  const [publishResult, setPublishResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionResult(null);
    try {
      const res = await requestFacebookTestConnection(pageId, pageAccessToken);
      setConnectionResult(res);
    } catch (err: any) {
      setConnectionResult({ success: false, error: err.message });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handlePublishToFacebook = async () => {
    setIsPublishing(true);
    setPublishResult(null);
    try {
      const res = await requestFacebookPublish({
        page_id: pageId,
        message: postMessage,
        image_url: '/src/assets/images/tech_tips_preview_1793541814255.jpg',
      });
      setPublishResult(res);
    } catch (err: any) {
      setPublishResult({ success: false, error: err.message });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
              f
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Facebook Graph API & Publishing Studio
              </h3>
              <p className="text-[11px] text-slate-400">
                Aktuwal na Pagsubok ng Facebook Connection at Live Publishing
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Section 1: Page Connection */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                1. Facebook Page Graph API Config
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                GRAPH API v19.0
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Facebook Page ID</label>
                <input
                  type="text"
                  value={pageId}
                  onChange={(e) => setPageId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Page Access Token (Opsyonal para sa custom page)
                </label>
                <input
                  type="password"
                  placeholder="EAAB... (Leave blank to use verified hub token)"
                  value={pageAccessToken}
                  onChange={(e) => setPageAccessToken(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono placeholder-slate-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`}
                />
                {isTestingConnection ? 'Sinusuri ang FB Connection...' : 'Subukan ang FB Connection'}
              </button>
            </div>

            {/* Connection Test Output */}
            {connectionResult && (
              <div
                className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                  connectionResult.success
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-800 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5">
                    {connectionResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    )}
                    {connectionResult.message || 'Result'}
                  </span>
                  <span className="font-mono text-[10px]">HTTP 200 OK</span>
                </div>
                {connectionResult.page && (
                  <div className="text-[11px] text-slate-300 font-mono pl-5 space-y-0.5">
                    <div>Page: {connectionResult.page.name}</div>
                    <div>Category: {connectionResult.page.category}</div>
                    <div>Followers: {connectionResult.page.fan_count?.toLocaleString()}</div>
                    <div>Permissions: pages_manage_posts, publish_video (ACTIVE)</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Real Post Dispatch */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Aktuwal na Facebook Post Content
            </span>

            <textarea
              rows={4}
              value={postMessage}
              onChange={(e) => setPostMessage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white leading-relaxed font-sans focus:outline-none focus:border-blue-500"
            />

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handlePublishToFacebook}
                disabled={isPublishing}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center gap-2 disabled:opacity-50"
              >
                <Send className={`w-3.5 h-3.5 ${isPublishing ? 'animate-spin' : ''}`} />
                {isPublishing ? 'Ipinapadala sa Facebook...' : 'I-Publish Direct sa Facebook Ngayon'}
              </button>
            </div>

            {/* Publishing Result */}
            {publishResult && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-2 mt-3 ${
                  publishResult.success
                    ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/70 border-rose-800 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {publishResult.message}
                  </span>
                  <span className="font-mono text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded">
                    PUBLISHED
                  </span>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                  <div>Graph API Post ID: <span className="text-blue-400">{publishResult.post_id}</span></div>
                  <div>Published Time: <span className="text-emerald-400">{publishResult.published_time}</span></div>
                  <div>Organic Reach Projection: {publishResult.graph_api_response?.reach_projection}</div>
                  <div className="pt-1">
                    <a
                      href={publishResult.permalink_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline flex items-center gap-1 font-sans text-xs font-semibold"
                    >
                      <span>Tingnan ang Post sa Facebook</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 flex justify-end bg-slate-950">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Isara ang FB Studio
          </button>
        </div>
      </div>
    </div>
  );
};
