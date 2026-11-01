/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Repeat,
  ThumbsUp,
  MoreHorizontal,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { ContentItem, SocialPlatform } from '../types/content';

interface SocialPreviewMockupProps {
  post: ContentItem;
  onApprove?: () => void;
  onReject?: () => void;
  onClose?: () => void;
  showActions?: boolean;
}

export const SocialPreviewMockup: React.FC<SocialPreviewMockupProps> = ({
  post,
  onApprove,
  onReject,
  onClose,
  showActions = true,
}) => {
  const [activePlatform, setActivePlatform] = useState<SocialPlatform>(post.platform);

  const platformNames: Record<SocialPlatform, string> = {
    facebook: 'Facebook Feed',
    instagram: 'Instagram Post',
    tiktok: 'TikTok Feed',
    twitter: 'X (Twitter)',
    linkedin: 'LinkedIn Post',
    youtube: 'YouTube Shorts',
    threads: 'Threads',
    pinterest: 'Pinterest Pin',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col max-w-xl mx-auto shadow-2xl">
      {/* Mockup Header & Platform Switcher */}
      <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Interactive Social Preview
          </span>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {(['facebook', 'instagram', 'tiktok', 'twitter', 'linkedin'] as SocialPlatform[]).map((p) => (
            <button
              key={p}
              onClick={() => setActivePlatform(p)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                activePlatform === p
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Realistic Mobile Viewport Container */}
      <div className="p-4 sm:p-6 bg-slate-950/80 flex items-center justify-center">
        <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          {/* Account Profile Bar */}
          <div className="p-3.5 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-800">
                PH
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Creator Studio PH</span>
                  <span className="text-[10px] text-blue-400">✓</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {post.scheduled_time} PHT · {platformNames[activePlatform]}
                </div>
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </div>

          {/* Post Text & Hook */}
          <div className="p-4 space-y-2">
            <h4 className="text-sm font-bold text-white tracking-tight">
              {post.post_title}
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {post.caption}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(post.hashtags || []).map((tag, i) => (
                <span key={i} className="text-xs font-medium text-blue-400 hover:underline">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Post Visual Asset */}
          {post.image_url ? (
            <div className="relative bg-slate-950 aspect-video overflow-hidden">
              <img
                src={post.image_url}
                alt={post.post_title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    '/src/assets/images/studio_hero_banner_1793541814591.jpg';
                }}
              />
              <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
                1080 × 1080 HD
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/40 aspect-video flex flex-col items-center justify-center p-6 text-center border-t border-b border-slate-800">
              <span className="text-xs font-medium text-slate-400">
                Prompt: "{post.image_prompt || 'Modern Philippine social graphic'}"
              </span>
            </div>
          )}

          {/* Platform Specific Action Bar */}
          {activePlatform === 'facebook' && (
            <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1.5 hover:text-blue-400 transition cursor-pointer">
                <ThumbsUp className="w-3.5 h-3.5" /> Like
              </span>
              <span className="flex items-center gap-1.5 hover:text-blue-400 transition cursor-pointer">
                <MessageCircle className="w-3.5 h-3.5" /> Comment
              </span>
              <span className="flex items-center gap-1.5 hover:text-blue-400 transition cursor-pointer">
                <Share2 className="w-3.5 h-3.5" /> Share
              </span>
            </div>
          )}

          {activePlatform === 'instagram' && (
            <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-4">
                <Heart className="w-4 h-4 cursor-pointer hover:text-rose-500 transition" />
                <MessageCircle className="w-4 h-4 cursor-pointer hover:text-blue-400 transition" />
                <Share2 className="w-4 h-4 cursor-pointer hover:text-emerald-400 transition" />
              </div>
              <Bookmark className="w-4 h-4 cursor-pointer hover:text-amber-400 transition" />
            </div>
          )}

          {activePlatform === 'twitter' && (
            <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1 cursor-pointer hover:text-blue-400">
                <MessageCircle className="w-3.5 h-3.5" /> 24
              </span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-emerald-400">
                <Repeat className="w-3.5 h-3.5" /> 89
              </span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-rose-400">
                <Heart className="w-3.5 h-3.5" /> 312
              </span>
              <Bookmark className="w-3.5 h-3.5 cursor-pointer hover:text-amber-400" />
            </div>
          )}

          {activePlatform === 'linkedin' && (
            <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer">
                <ThumbsUp className="w-3.5 h-3.5" /> Like
              </span>
              <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer">
                <MessageCircle className="w-3.5 h-3.5" /> Comment
              </span>
              <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer">
                <Repeat className="w-3.5 h-3.5" /> Repost
              </span>
              <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer">
                <Share2 className="w-3.5 h-3.5" /> Send
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Manual Approval Action Bar */}
      {showActions && (
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Status: <span className="font-semibold text-amber-400 font-mono">{post.approval_status}</span>
          </div>

          <div className="flex items-center gap-2">
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition"
              >
                Close Preview
              </button>
            )}
            {onReject && post.approval_status === 'PENDING_APPROVAL' && (
              <button
                onClick={onReject}
                className="px-3.5 py-1.5 text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-800/80 hover:bg-rose-900 rounded-lg transition"
              >
                Reject Post
              </button>
            )}
            {onApprove && post.approval_status === 'PENDING_APPROVAL' && (
              <button
                onClick={onApprove}
                className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition"
              >
                Approve & Add to Queue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
