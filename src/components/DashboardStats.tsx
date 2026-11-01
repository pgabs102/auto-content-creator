/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Radio, SendHorizontal } from 'lucide-react';
import { ContentItem, UserBotSettings } from '../types/content';

interface DashboardStatsProps {
  posts: ContentItem[];
  settings: UserBotSettings;
  onToggleAutoPost: () => void;
  onToggleManualApproval: () => void;
  onTriggerCheck: () => void;
  isChecking: boolean;
  onOpenDiagnostics: () => void;
  onOpenFacebook: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  posts,
  settings,
  onToggleAutoPost,
  onToggleManualApproval,
  onTriggerCheck,
  isChecking,
  onOpenDiagnostics,
  onOpenFacebook,
}) => {
  const scheduledCount = posts.filter((p) => p.approval_status === 'SCHEDULED').length;
  const pendingCount = posts.filter((p) => p.approval_status === 'PENDING_APPROVAL').length;
  const publishedCount = posts.filter((p) => p.approval_status === 'PUBLISHED').length;
  const failedCount = posts.filter((p) => p.approval_status === 'FAILED').length;

  return (
    <div className="space-y-4">
      {/* 4-KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Scheduled Queue</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1.5 tabular-nums">
            {scheduledCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Naka-iskedyul sa Asia/Manila oras
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">For Manual Approval</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1.5 tabular-nums">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Nangangailangan ng user review
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Published Posts</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1.5 tabular-nums">
            {publishedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Naipamahagi sa social channels
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">AutoPost Engine</span>
            <Radio className={`w-4 h-4 ${settings.autopost_enabled ? 'text-emerald-400' : 'text-slate-500'}`} />
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                settings.autopost_enabled ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            />
            <span
              className={`text-sm font-semibold uppercase tracking-wide ${
                settings.autopost_enabled ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              {settings.autopost_enabled ? 'RUNNING' : 'PAUSED'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Sinusuri ang queue kada 5 segundo
          </div>
        </div>
      </div>

      {/* Engine Controls Ribbon */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">AutoPost Mode:</span>
            <button
              onClick={onToggleAutoPost}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                settings.autopost_enabled
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.autopost_enabled ? 'ON (Auto-Publish)' : 'OFF (Paused)'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Manual Approval:</span>
            <button
              onClick={onToggleManualApproval}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                settings.manual_approval_enabled
                  ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.manual_approval_enabled ? 'REQUIRED (Safe)' : 'BYPASS (Instant Queue)'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {failedCount > 0 && (
            <span className="text-xs text-rose-400 font-mono">
              {failedCount} failed post(s) needing retry
            </span>
          )}
          <button
            onClick={onOpenFacebook}
            className="px-3 py-1.5 text-xs font-semibold bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 rounded-lg transition flex items-center gap-1.5"
          >
            <span className="font-bold">f</span>
            <span>Subukan ang Facebook Publish</span>
          </button>
          <button
            onClick={onOpenDiagnostics}
            className="px-3 py-1.5 text-xs font-semibold bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 rounded-lg transition flex items-center gap-1.5"
          >
            <span>⚡ Run 100% Live Test Lab</span>
          </button>
          <button
            onClick={onTriggerCheck}
            disabled={isChecking}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <SendHorizontal className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Scanning...' : 'Scan Queue Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
