/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Eye,
  Check,
  X,
  Edit2,
  Send,
  RotateCw,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Layers,
} from 'lucide-react';
import { ContentItem, ContentStatus, SocialPlatform } from '../types/content';

interface ContentQueueTableProps {
  posts: ContentItem[];
  onPreviewPost: (post: ContentItem) => void;
  onApprovePost: (contentId: string) => void;
  onRejectPost: (contentId: string) => void;
  onPublishNow: (post: ContentItem) => void;
  onRetryPost: (post: ContentItem) => void;
  onEditPost: (post: ContentItem) => void;
  onDeletePost: (contentId: string) => void;
  onPublishToFacebook?: (post: ContentItem) => void;
}

const STATUS_FILTERS: { id: string; label: string }[] = [
  { id: 'ALL', label: 'All Posts' },
  { id: 'PENDING_APPROVAL', label: 'For Approval' },
  { id: 'SCHEDULED', label: 'Scheduled' },
  { id: 'PUBLISHED', label: 'Published' },
  { id: 'REJECTED', label: 'Rejected' },
  { id: 'FAILED', label: 'Failed' },
];

export const ContentQueueTable: React.FC<ContentQueueTableProps> = ({
  posts,
  onPreviewPost,
  onApprovePost,
  onRejectPost,
  onPublishNow,
  onRetryPost,
  onEditPost,
  onDeletePost,
  onPublishToFacebook,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    const matchesStatus =
      selectedFilter === 'ALL' ? true : p.approval_status === selectedFilter;
    const matchesPlatform =
      platformFilter === 'ALL' ? true : p.platform === platformFilter;
    const matchesSearch =
      searchQuery === ''
        ? true
        : p.post_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.hashtags.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesPlatform && matchesSearch;
  });

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
            PUBLISHED
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="text-[11px] font-mono font-semibold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
            SCHEDULED
          </span>
        );
      case 'PENDING_APPROVAL':
        return (
          <span className="text-[11px] font-mono font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
            PENDING_APPROVAL
          </span>
        );
      case 'REJECTED':
        return (
          <span className="text-[11px] font-mono font-semibold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
            REJECTED
          </span>
        );
      case 'FAILED':
        return (
          <span className="text-[11px] font-mono font-semibold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
            FAILED
          </span>
        );
      case 'PUBLISHING':
        return (
          <span className="text-[11px] font-mono font-semibold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800 animate-pulse">
            PUBLISHING
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-mono font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
      {/* Control Header & Filters */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status segmented controls */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedFilter === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
              {f.id !== 'ALL' && (
                <span className="ml-1.5 opacity-60 tabular-nums">
                  ({posts.filter((p) => p.approval_status === f.id).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search & Platform Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search posts or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-44 sm:w-56"
            />
          </div>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Platforms</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="twitter">X (Twitter)</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>
      </div>

      {/* High-Density Data Grid / List */}
      <div className="overflow-x-auto">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium text-slate-400">Walang natagpuang posts sa kategoryang ito.</p>
            <p className="text-xs text-slate-500 mt-1">
              Subukang mag-generate ng bagong post o i-reset ang iyong mga filters.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60">
                <th className="py-3 px-4">Post & Visual</th>
                <th className="py-3 px-4">Platform & Category</th>
                <th className="py-3 px-4">Schedule (Asia/Manila)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs text-slate-300">
              {filteredPosts.map((post) => (
                <tr
                  key={post.content_id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Post Details & Visual Preview */}
                  <td className="py-3.5 px-4 max-w-md">
                    <div className="flex items-start gap-3">
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt={post.post_title}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0 bg-slate-950"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              '/src/assets/images/tech_tips_preview_1793541814255.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 shrink-0">
                          No Pic
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="font-bold text-white line-clamp-1 group-hover:text-blue-400 transition">
                          {post.post_title}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {post.caption}
                        </div>
                        {/* Zero-Pill unboxed metadata */}
                        <div className="text-[10px] text-blue-400/90 font-mono">
                          {post.hashtags?.slice(0, 3).join(' ')}
                          {post.hashtags?.length > 3 && ` +${post.hashtags.length - 3}`}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Platform & Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold uppercase tracking-wider text-slate-200 text-[11px]">
                      {post.platform}
                    </div>
                    {/* Unboxed metadata with bullet */}
                    <div className="text-[11px] text-slate-400 capitalize mt-0.5">
                      {post.content_category.replace('_', ' ')}
                    </div>
                  </td>

                  {/* Philippine Schedule */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-mono tabular-nums text-slate-200">
                      {post.scheduled_date}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-mono tabular-nums mt-0.5">
                      {post.scheduled_time} PHT
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(post.approval_status)}
                    {post.published_date && (
                      <div className="text-[10px] text-slate-500 font-mono mt-1">
                        ID: {post.platform_post_id || 'DISPATCHED'}
                      </div>
                    )}
                    {post.publishing_error && (
                      <div className="text-[10px] text-rose-400 max-w-xs truncate mt-1">
                        Err: {post.publishing_error}
                      </div>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Preview Button */}
                      <button
                        onClick={() => onPreviewPost(post)}
                        title="Tingnan ang Preview"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Manual Approval Actions */}
                      {post.approval_status === 'PENDING_APPROVAL' && (
                        <>
                          <button
                            onClick={() => onApprovePost(post.content_id)}
                            title="I-Approve Post"
                            className="p-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 rounded-lg transition"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRejectPost(post.content_id)}
                            title="I-Reject Post"
                            className="p-1.5 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-500/30 rounded-lg transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {/* Force Publish / Scheduled action */}
                      {post.approval_status === 'SCHEDULED' && (
                        <>
                          <button
                            onClick={() => onPublishNow(post)}
                            title="I-publish Ngayon (Force Publish)"
                            className="p-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 rounded-lg transition"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          {onPublishToFacebook && (
                            <button
                              onClick={() => onPublishToFacebook(post)}
                              title="I-publish Direct sa Facebook Page"
                              className="p-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 rounded-lg transition text-[11px] font-bold"
                            >
                              f
                            </button>
                          )}
                        </>
                      )}

                      {/* Retry action for failed posts */}
                      {post.approval_status === 'FAILED' && (
                        <button
                          onClick={() => onRetryPost(post)}
                          title="Subukan Muli (Retry)"
                          className="p-1.5 bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white border border-amber-500/30 rounded-lg transition"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                      )}

                      {/* Edit Button */}
                      <button
                        onClick={() => onEditPost(post)}
                        title="I-edit ang Post"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDeletePost(post.content_id)}
                        title="Burahin"
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
