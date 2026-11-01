/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  Database,
  Package,
  Calendar,
  ShieldCheck,
  Share2,
  UserCheck,
  User,
} from 'lucide-react';
import { AuthUser } from '../types/content';

interface TopNavigationProps {
  activeTab: 'queue' | 'scheduler' | 'analytics';
  setActiveTab: (tab: 'queue' | 'scheduler' | 'analytics') => void;
  onOpenCreate: () => void;
  onOpenSupabase: () => void;
  onOpenPackager: () => void;
  onOpenDiagnostics: () => void;
  onOpenFacebook: () => void;
  onOpenLogin: () => void;
  currentUser: AuthUser | null;
  isSupabaseConnected: boolean;
  manilaTimeStr: string;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreate,
  onOpenSupabase,
  onOpenPackager,
  onOpenDiagnostics,
  onOpenFacebook,
  onOpenLogin,
  currentUser,
  isSupabaseConnected,
  manilaTimeStr,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 py-3 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-sm">
            ⚡
          </div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            Auto Content Creator Bot
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
          <button
            onClick={() => setActiveTab('queue')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'queue'
                ? 'text-white border-b-2 border-blue-500 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Content Queue
          </button>
          <button
            onClick={() => setActiveTab('scheduler')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'scheduler'
                ? 'text-white border-b-2 border-blue-500 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Manila Scheduler
          </button>
          <button
            onClick={onOpenFacebook}
            className="whitespace-nowrap text-slate-400 hover:text-white transition-colors py-1 flex items-center gap-1.5"
          >
            <div className="w-3.5 h-3.5 rounded bg-blue-600 text-[9px] font-bold text-white flex items-center justify-center">
              f
            </div>
            Facebook Studio
          </button>
          <button
            onClick={onOpenSupabase}
            className="whitespace-nowrap text-slate-400 hover:text-white transition-colors py-1 flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5" />
            Supabase DB
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                isSupabaseConnected
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {isSupabaseConnected ? 'SYNCED' : 'LOCAL'}
            </span>
          </button>
          <button
            onClick={onOpenPackager}
            className="whitespace-nowrap text-slate-400 hover:text-white transition-colors py-1 flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5" />
            APK Package
          </button>
          <button
            onClick={onOpenDiagnostics}
            className="whitespace-nowrap text-emerald-400 hover:text-emerald-300 transition-colors py-1 flex items-center gap-1 bg-emerald-950/50 px-2.5 rounded-lg border border-emerald-800/80"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Live Diagnostics Lab
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Manila Live Clock + User Auth */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Asia/Manila (PHT)</div>
            <div className="text-xs font-mono font-medium text-emerald-400 tabular-nums">
              {manilaTimeStr || '06:05:00 PM'}
            </div>
          </div>

          {/* User Account Button */}
          <button
            onClick={onOpenLogin}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition flex items-center gap-1.5"
            title={currentUser ? `Naka-login bilang ${currentUser.name}` : 'Mag-login sa account'}
          >
            {currentUser ? (
              <>
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden md:inline max-w-[90px] truncate">{currentUser.name}</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Login</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenCreate}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Generate Post</span>
          </button>
        </div>
      </div>
    </header>
  );
};
