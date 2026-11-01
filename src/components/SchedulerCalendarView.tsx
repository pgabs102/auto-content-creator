/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle,
  AlertCircle,
  MoreVertical,
} from 'lucide-react';
import { ContentItem, UserBotSettings } from '../types/content';
import {
  getManilaDateString,
  getNowInManila,
  PHILIPPINES_PEAK_SLOTS,
} from '../utils/philippineTime';

interface SchedulerCalendarViewProps {
  posts: ContentItem[];
  settings: UserBotSettings;
  onUpdateSettings: (newSettings: Partial<UserBotSettings>) => void;
  onPreviewPost: (post: ContentItem) => void;
  onEditPost: (post: ContentItem) => void;
  onOpenCreateForSlot?: (date: string, time: string) => void;
}

export const SchedulerCalendarView: React.FC<SchedulerCalendarViewProps> = ({
  posts,
  settings,
  onUpdateSettings,
  onPreviewPost,
  onEditPost,
  onOpenCreateForSlot,
}) => {
  // Generate 7 consecutive days starting from today in Manila
  const todayManila = getNowInManila();
  const [dayOffset, setDayOffset] = useState(0);

  const days: { dateStr: string; dayName: string; monthDay: string; isToday: boolean }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(todayManila);
    d.setDate(d.getDate() + dayOffset + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const isToday = dateStr === getManilaDateString();

    days.push({ dateStr, dayName, monthDay, isToday });
  }

  const handlePostsPerDayChange = (val: number) => {
    onUpdateSettings({ posts_per_day: val });
  };

  return (
    <div className="space-y-6">
      {/* Scheduler Header & Settings Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Philippine Time Weekly Queue
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Naka-sync sa Asia/Manila (UTC+8) peak engagement hours.
          </p>
        </div>

        {/* Daily Posts Target & Navigation */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Posts per Day:</span>
            <select
              value={settings.posts_per_day}
              onChange={(e) => handlePostsPerDayChange(parseInt(e.target.value, 10))}
              className="bg-transparent text-xs font-bold text-blue-400 focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                <option key={n} value={n} className="bg-slate-900 text-white">
                  {n} posts / araw
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDayOffset((prev) => prev - 7)}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-slate-300">
              {days[0]?.monthDay} - {days[6]?.monthDay}
            </span>
            <button
              onClick={() => setDayOffset((prev) => prev + 7)}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Matrix Columns */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {days.map((day) => {
          const dayPosts = posts.filter((p) => p.scheduled_date === day.dateStr);

          return (
            <div
              key={day.dateStr}
              className={`bg-slate-900 border rounded-2xl p-3 flex flex-col min-h-[380px] ${
                day.isToday ? 'border-blue-500/50 bg-slate-900/90' : 'border-slate-800'
              }`}
            >
              {/* Day Header */}
              <div className="border-b border-slate-800/80 pb-2 mb-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      day.isToday ? 'text-blue-400' : 'text-slate-400'
                    }`}
                  >
                    {day.dayName}
                  </span>
                  {day.isToday && (
                    <span className="text-[10px] bg-blue-600/20 text-blue-400 px-1.5 py-0.2 rounded font-semibold">
                      TODAY
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {day.monthDay}
                </div>
              </div>

              {/* Scheduled Posts in Day */}
              <div className="space-y-2 flex-1">
                {dayPosts.length === 0 ? (
                  <div className="text-center py-8 text-slate-600 text-[11px]">
                    Walang naka-iskedyul
                  </div>
                ) : (
                  dayPosts.map((post) => (
                    <div
                      key={post.content_id}
                      onClick={() => onPreviewPost(post)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all hover:border-slate-600 space-y-1.5 ${
                        post.approval_status === 'PUBLISHED'
                          ? 'bg-emerald-950/30 border-emerald-900/50 text-slate-300'
                          : post.approval_status === 'SCHEDULED'
                          ? 'bg-blue-950/30 border-blue-900/50 text-slate-200'
                          : 'bg-amber-950/30 border-amber-900/50 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-emerald-400 font-bold tabular-nums">
                          {post.scheduled_time}
                        </span>
                        <span className="uppercase text-[9px] font-bold text-slate-400">
                          {post.platform}
                        </span>
                      </div>
                      <div className="font-semibold text-white line-clamp-1 leading-tight">
                        {post.post_title}
                      </div>
                      <div className="flex items-center justify-between text-[9px] pt-1 text-slate-500 font-mono">
                        <span>{post.approval_status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Post to Day CTA */}
              <button
                onClick={() =>
                  onOpenCreateForSlot
                    ? onOpenCreateForSlot(day.dateStr, '18:45')
                    : undefined
                }
                className="mt-3 w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-[11px] font-semibold border border-dashed border-slate-800 flex items-center justify-center gap-1 transition"
              >
                <Plus className="w-3 h-3" /> Mag-iskedyul
              </button>
            </div>
          );
        })}
      </div>

      {/* Preset Peak Engagement Info Strip */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          Optimal Philippine Social Engagement Windows
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PHILIPPINES_PEAK_SLOTS.map((slot) => (
            <div key={slot.time} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80">
              <div className="text-xs font-mono font-bold text-emerald-400">{slot.time} PHT</div>
              <div className="text-[11px] font-semibold text-slate-300 mt-0.5">{slot.label.split('(')[0]}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{slot.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
