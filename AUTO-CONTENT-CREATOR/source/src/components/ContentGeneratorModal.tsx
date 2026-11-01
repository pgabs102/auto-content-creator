/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Calendar,
  Clock,
  Layers,
  Globe2,
  Users,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  SocialPlatform,
  ContentCategory,
  PublishingMode,
  ContentItem,
} from '../types/content';
import {
  getManilaDateString,
  PHILIPPINES_PEAK_SLOTS,
} from '../utils/philippineTime';
import { requestContentGeneration } from '../services/contentApiService';

interface ContentGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: ContentItem, previewImmediately: boolean) => void;
  defaultMode: PublishingMode;
}

const PLATFORMS: { id: SocialPlatform; label: string; icon: string }[] = [
  { id: 'facebook', label: 'Facebook', icon: 'FB' },
  { id: 'instagram', label: 'Instagram', icon: 'IG' },
  { id: 'tiktok', label: 'TikTok', icon: 'TT' },
  { id: 'twitter', label: 'X (Twitter)', icon: 'X' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'IN' },
  { id: 'youtube', label: 'YouTube Shorts', icon: 'YT' },
  { id: 'threads', label: 'Threads', icon: 'TH' },
  { id: 'pinterest', label: 'Pinterest', icon: 'PIN' },
];

const CATEGORIES: { id: ContentCategory; label: string; desc: string }[] = [
  { id: 'educational', label: 'Educational', desc: 'Detailed knowledge, how-tos, actionable steps' },
  { id: 'inspirational', label: 'Inspirational', desc: 'Mindset, motivation, perseverance stories' },
  { id: 'entertainment', label: 'Entertainment', desc: 'Relatable humor, trends, conversational memes' },
  { id: 'promotional', label: 'Promotional', desc: 'Discounts, product launches, client testimonials' },
  { id: 'informative', label: 'Informative', desc: 'Industry news, algorithm updates, key summaries' },
  { id: 'tips_tutorials', label: 'Tips & Tutorials', desc: 'Bite-sized hacks and workflow breakdowns' },
  { id: 'image_based', label: 'Image-Based', desc: 'Visual-first cards, infographics, carousels' },
];

export const ContentGeneratorModal: React.FC<ContentGeneratorModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
  defaultMode,
}) => {
  const [platform, setPlatform] = useState<SocialPlatform>('facebook');
  const [category, setCategory] = useState<ContentCategory>('educational');
  const [targetAudience, setTargetAudience] = useState('Filipino Creators & Small Business Owners');
  const [instructions, setInstructions] = useState('');
  const [languageStyle, setLanguageStyle] = useState<'taglish' | 'filipino' | 'english'>('taglish');
  const [scheduledDate, setScheduledDate] = useState(getManilaDateString());
  const [scheduledTime, setScheduledTime] = useState('18:45');
  const [publishingMode, setPublishingMode] = useState<PublishingMode>(defaultMode);

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickPrompt = (promptText: string) => {
    setInstructions(promptText);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await requestContentGeneration({
        platform,
        category,
        targetAudience,
        instructions: instructions || `Magandang ${category} post para sa ${platform}`,
        languageStyle,
        scheduledDate,
        scheduledTime,
        publishingMode,
      });

      if (!response.success && !response.data) {
        throw new Error(response.error || 'Nabigong mag-generate ng content');
      }

      const generated = response.data;
      const initialStatus = publishingMode === 'autopost' ? 'SCHEDULED' : 'PENDING_APPROVAL';

      // Pick an image fallback from generated image paths
      const imageAssets = [
        '/src/assets/images/tech_tips_preview_1793541814255.jpg',
        '/src/assets/images/business_growth_graphic_1793541814167.jpg',
        '/src/assets/images/studio_hero_banner_1793541814591.jpg',
      ];
      const assignedImage =
        category === 'educational' || category === 'tips_tutorials'
          ? imageAssets[0]
          : category === 'inspirational' || category === 'promotional'
          ? imageAssets[1]
          : imageAssets[2];

      const newPost: ContentItem = {
        content_id: 'post_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
        post_title: generated.title || instructions.slice(0, 50),
        caption: generated.caption,
        hashtags: generated.hashtags || ['#PinoyCreator', '#AutomatedPost'],
        image_url: assignedImage,
        image_prompt: generated.imagePrompt,
        platform,
        content_category: category,
        target_audience: targetAudience,
        language_style: languageStyle,
        date_created: new Date().toISOString(),
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        approval_status: initialStatus,
        publishing_status: 'PENDING',
        published_date: null,
        publishing_error: null,
        platform_post_id: null,
        retry_count: 0,
      };

      onPostCreated(newPost, publishingMode === 'manual_approval');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while contacting generation server.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                AI Content Generator & Scheduler
              </h3>
              <p className="text-xs text-slate-400">
                Pinaandar ng Gemini 3.8 Flash · Philippine Standard Time (UTC+8)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleGenerate} className="p-6 space-y-5 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Platform Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              1. Piliin ang Social Media Platform
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                    platform === p.id
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center font-mono text-[10px] text-blue-400">
                    {p.icon}
                  </span>
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              2. Content Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    category === c.id
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-200">{c.label}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Topic & Quick Inspiration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                3. Paksa o Prompt Instruksyon
              </label>
              <span className="text-[11px] text-slate-500">Puwede mong i-customize o pumili sa ibaba</span>
            </div>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Halimbawa: 5 paraan para makatipid sa kuryente ang small business, o kung paano mag-scale ng TikTok shop..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
            {/* Quick Inspiration Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                '5 Productivity AI Hacks sa 2026',
                'Disiplina sa Negosyo Kahit Mahirap',
                'Paano Mag-Simula ng Side Hustle sa Pinas',
                'Bakit Video Content ang Hari ng Reach',
              ].map((text, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleQuickPrompt(text)}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-[11px] rounded-lg border border-slate-700 transition"
                >
                  + {text}
                </button>
              ))}
            </div>
          </div>

          {/* Audience & Language Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Language / Tone
              </label>
              <select
                value={languageStyle}
                onChange={(e) => setLanguageStyle(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="taglish">Taglish (Conversational Filipino + English)</option>
                <option value="filipino">Filipino (Pure Tagalog)</option>
                <option value="english">Professional English</option>
              </select>
            </div>
          </div>

          {/* Schedule & Publishing Mode */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Publishing Schedule (Asia/Manila)
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">PST UTC+8</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Petsa</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Peak Engagement Oras
                </label>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                >
                  {PHILIPPINES_PEAK_SLOTS.map((slot) => (
                    <option key={slot.time} value={slot.time}>
                      {slot.label} - {slot.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Publishing Mode Selection: Manual Approval vs AutoPost */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1.5">Publishing Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPublishingMode('manual_approval')}
                  className={`p-3 rounded-xl border text-left transition ${
                    publishingMode === 'manual_approval'
                      ? 'bg-amber-950/40 border-amber-500/80 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">Manual Approval</span>
                    {publishingMode === 'manual_approval' && (
                      <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    I-preview muna at hintayin ang iyong kumpirmasyon bago ilagay sa queue.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPublishingMode('autopost')}
                  className={`p-3 rounded-xl border text-left transition ${
                    publishingMode === 'autopost'
                      ? 'bg-blue-950/40 border-blue-500/80 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300">AutoPost Mode</span>
                    {publishingMode === 'autopost' && (
                      <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Diretsong ilalagay sa SCHEDULED status at kusang ipa-publish sa takdang oras.
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
            >
              Kanselahin
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Bumubuo ng Content...' : 'Simulan ang Pag-generate & I-save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
