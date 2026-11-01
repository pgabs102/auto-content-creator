/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ContentItem, UserBotSettings } from '../types/content';
import { getManilaDateString } from '../utils/philippineTime';

const STORAGE_KEY_POSTS = 'acc_social_posts_store_v1';
const STORAGE_KEY_SETTINGS = 'acc_user_settings_v1';

export const DEFAULT_BOT_SETTINGS: UserBotSettings = {
  ai_provider: 'gemini-3.8-flash',
  default_platform: 'facebook',
  default_category: 'educational',
  default_audience: 'Filipino Entrepreneurs & Online Sellers',
  language_style: 'taglish',
  publishing_mode: 'manual_approval',
  manual_approval_enabled: true,
  autopost_enabled: true,
  posts_per_day: 3,
  daily_schedule_slots: ['08:30', '12:15', '18:45'],
  supabase_url: '',
  supabase_anon_key: '',
  is_connected_to_supabase: false,
};

// Initial realistic seed items for Philippine social media
export const INITIAL_SEED_POSTS: ContentItem[] = [
  {
    content_id: 'c101a001-e22b-4789-8d8a-987654321001',
    post_title: '5 Tips Paano Pabilisin ang Trabaho Gamit ang AI sa 2026',
    caption: 'Gusto mo bang maging mas productive kahit siksik ang schedule mo? 🚀\n\nNarito ang 5 proven workflow hacks gamit ang modern AI tools para sa mga Filipino digital creators at freelancers:\n\n1️⃣ Content Ideation: Huwag magsimula sa blank page; gamitin ang AI brainstorming.\n2️⃣ Automated Captions: Mag-generate ng natural Taglish copy sa loob ng 10 segundo.\n3️⃣ Batch Hashtag Research: Gamitin ang high-intent niche hashtags kaysa generic tags.\n4️⃣ Philippine Prime Time Scheduling: I-post tuwing 12:15 PM o 6:45 PM Manila time para sa pinakamataas na reach.\n5️⃣ Visual Asset Generation: Gumawa ng branded banners gamit ang prompt formula.\n\nSave this post for your daily reference! Alin dito ang nasubukan mo na? Comment below! 👇✨',
    hashtags: ['#PhilippineTech', '#AIWorkflow', '#FreelancePH', '#ProductivityHacks', '#PinoyCreator'],
    image_url: '/src/assets/images/tech_tips_preview_1793541814255.jpg',
    image_prompt: 'Clean modern minimalist 3D isometric graphic representing artificial intelligence and automation algorithms',
    platform: 'facebook',
    content_category: 'educational',
    target_audience: 'Filipino Freelancers & Creators',
    language_style: 'taglish',
    date_created: new Date(Date.now() - 3600000 * 24).toISOString(),
    scheduled_date: getManilaDateString(),
    scheduled_time: '18:45',
    approval_status: 'SCHEDULED',
    publishing_status: 'PENDING',
    published_date: null,
    publishing_error: null,
    platform_post_id: null,
    retry_count: 0,
  },
  {
    content_id: 'c101a002-e22b-4789-8d8a-987654321002',
    post_title: 'Disiplina sa Negosyo: Tuloy-tuloy ang Hakbang Kahit Mahirap',
    caption: 'Hindi kailangang perpekto ang simula, ang mahalaga ay hindi ka humihinto. 🌅\n\nLahat ng matatagumpay na negosyante sa Pilipinas ay nagsimula sa maliit na hakbang at paulit-ulit na pagsubok. Kapag mabagal ang usad, magpahinga pero huwag susuko.\n\n"Success is not about giant leaps, but daily consistent execution."\n\nI-tag ang kaibigan mong negosyante na kailangan ng motivation ngayong araw! 💪🇵🇭',
    hashtags: ['#NegosyoTips', '#PinoyEntrepreneur', '#MotivationPH', '#Disiplina', '#BusinessMindset'],
    image_url: '/src/assets/images/business_growth_graphic_1793541814167.jpg',
    image_prompt: 'Minimalist architectural composition with ascending geometric stepped marble pillars bathed in warm sunrise light',
    platform: 'instagram',
    content_category: 'inspirational',
    target_audience: 'MSME Owners & Business Starters',
    language_style: 'taglish',
    date_created: new Date(Date.now() - 3600000 * 12).toISOString(),
    scheduled_date: getManilaDateString(),
    scheduled_time: '21:30',
    approval_status: 'PENDING_APPROVAL',
    publishing_status: 'PENDING',
    published_date: null,
    publishing_error: null,
    platform_post_id: null,
    retry_count: 0,
  },
  {
    content_id: 'c101a003-e22b-4789-8d8a-987654321003',
    post_title: 'Automated Creator Studio: Set Up Your Daily Publishing Pipeline',
    caption: 'How top agencies manage 50+ social channels without burnout:\n\nSystemize your batch production:\n- Monday: Strategy & prompt ideation\n- Tuesday: AI generation + approval review\n- Wed-Sun: Automated publishing via scheduled queue\n\nFull case study and workflow breakdown inside. Check link in bio! 📊',
    hashtags: ['#SocialMediaStrategy', '#MarketingAutomation', '#ContentOperations', '#B2BGrowth'],
    image_url: '/src/assets/images/studio_hero_banner_1793541814591.jpg',
    image_prompt: 'Modern high-end digital creator studio workspace with multiple tablet screens',
    platform: 'linkedin',
    content_category: 'informative',
    target_audience: 'Agency Leads & Marketing Directors',
    language_style: 'english',
    date_created: new Date(Date.now() - 3600000 * 48).toISOString(),
    scheduled_date: getManilaDateString(new Date(Date.now() - 3600000 * 24)),
    scheduled_time: '08:30',
    approval_status: 'PUBLISHED',
    publishing_status: 'SUCCESS',
    published_date: new Date(Date.now() - 3600000 * 20).toISOString(),
    publishing_error: null,
    platform_post_id: 'LI-POST-992014-PH',
    retry_count: 0,
  },
];

class SupabaseStorageService {
  private client: SupabaseClient | null = null;
  private settings: UserBotSettings = DEFAULT_BOT_SETTINGS;

  constructor() {
    this.loadSettings();
  }

  public loadSettings(): UserBotSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        this.settings = { ...DEFAULT_BOT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage', e);
    }

    if (this.settings.supabase_url && this.settings.supabase_anon_key) {
      try {
        this.client = createClient(this.settings.supabase_url, this.settings.supabase_anon_key);
        this.settings.is_connected_to_supabase = true;
      } catch (err) {
        console.warn('Supabase client init error:', err);
        this.client = null;
        this.settings.is_connected_to_supabase = false;
      }
    }

    return this.settings;
  }

  public saveSettings(newSettings: Partial<UserBotSettings>): UserBotSettings {
    this.settings = { ...this.settings, ...newSettings };
    if (this.settings.supabase_url && this.settings.supabase_anon_key) {
      try {
        this.client = createClient(this.settings.supabase_url, this.settings.supabase_anon_key);
        this.settings.is_connected_to_supabase = true;
      } catch {
        this.client = null;
        this.settings.is_connected_to_supabase = false;
      }
    } else {
      this.client = null;
      this.settings.is_connected_to_supabase = false;
    }

    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage', e);
    }
    return this.settings;
  }

  public async testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
    if (!url || !key) {
      return { success: false, message: 'Supabase URL at Anon Key ay kailangan punan.' };
    }
    try {
      const testClient = createClient(url, key);
      const { data, error } = await testClient
        .from('social_posts')
        .select('content_id')
        .limit(1);

      if (error) {
        // Even if table doesn't exist yet, we check error code
        if (error.code === '42P01') {
          return {
            success: true,
            message: 'Nakakonekta sa Supabase! Ngunit kailangan pang patakbuhin ang database schema para sa "social_posts" table.',
          };
        }
        return { success: false, message: `Supabase Error: ${error.message}` };
      }

      return {
        success: true,
        message: `Tagumpay na nakakonekta sa Supabase! (${data?.length ?? 0} existing records detected)`,
      };
    } catch (err: any) {
      return { success: false, message: `Connection failed: ${err.message || 'Network error'}` };
    }
  }

  public async getAllPosts(): Promise<ContentItem[]> {
    // 1. Try Supabase if connected
    if (this.client && this.settings.is_connected_to_supabase) {
      try {
        const { data, error } = await this.client
          .from('social_posts')
          .select('*')
          .order('scheduled_date', { ascending: false })
          .order('scheduled_time', { ascending: false });

        if (!error && data && data.length > 0) {
          // Sync to local backup
          this.saveLocalPosts(data as ContentItem[]);
          return data as ContentItem[];
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local storage', err);
      }
    }

    // 2. Fallback to Local Storage
    return this.getLocalPosts();
  }

  public async savePost(post: ContentItem): Promise<ContentItem> {
    // Save to local storage first (reliable offline-first)
    const currentPosts = this.getLocalPosts();
    const existingIndex = currentPosts.findIndex((p) => p.content_id === post.content_id);
    let updatedList: ContentItem[];

    if (existingIndex >= 0) {
      updatedList = [...currentPosts];
      updatedList[existingIndex] = post;
    } else {
      updatedList = [post, ...currentPosts];
    }
    this.saveLocalPosts(updatedList);

    // Save to Supabase if connected
    if (this.client && this.settings.is_connected_to_supabase) {
      try {
        const { error } = await this.client.from('social_posts').upsert({
          content_id: post.content_id,
          post_title: post.post_title,
          caption: post.caption,
          hashtags: post.hashtags,
          image_url: post.image_url,
          image_prompt: post.image_prompt,
          platform: post.platform,
          content_category: post.content_category,
          target_audience: post.target_audience,
          language_style: post.language_style,
          date_created: post.date_created,
          scheduled_date: post.scheduled_date,
          scheduled_time: post.scheduled_time,
          approval_status: post.approval_status,
          publishing_status: post.publishing_status,
          published_date: post.published_date,
          publishing_error: post.publishing_error,
          platform_post_id: post.platform_post_id,
          retry_count: post.retry_count,
        });

        if (error) {
          console.warn('Supabase upsert warning:', error.message);
        }
      } catch (e) {
        console.warn('Failed to upsert to Supabase:', e);
      }
    }

    return post;
  }

  public async deletePost(contentId: string): Promise<boolean> {
    const currentPosts = this.getLocalPosts();
    const filtered = currentPosts.filter((p) => p.content_id !== contentId);
    this.saveLocalPosts(filtered);

    if (this.client && this.settings.is_connected_to_supabase) {
      try {
        await this.client.from('social_posts').delete().eq('content_id', contentId);
      } catch (e) {
        console.warn('Failed to delete from Supabase', e);
      }
    }
    return true;
  }

  public getLocalPosts(): ContentItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_POSTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading local posts', e);
    }
    // Return initial seed and save it
    this.saveLocalPosts(INITIAL_SEED_POSTS);
    return INITIAL_SEED_POSTS;
  }

  private saveLocalPosts(posts: ContentItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
    } catch (e) {
      console.warn('Error saving local posts', e);
    }
  }
}

export const supabaseStorage = new SupabaseStorageService();
