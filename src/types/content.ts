/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'twitter'
  | 'linkedin'
  | 'youtube'
  | 'threads'
  | 'pinterest';

export type ContentCategory =
  | 'educational'
  | 'inspirational'
  | 'entertainment'
  | 'promotional'
  | 'informative'
  | 'tips_tutorials'
  | 'image_based';

export type ContentStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PUBLISHING'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'FAILED'
  | 'CANCELLED';

export type PublishingMode = 'manual_approval' | 'autopost';

export interface ContentItem {
  content_id: string; // UUID
  post_title: string;
  caption: string;
  hashtags: string[];
  image_url: string;
  image_prompt?: string;
  platform: SocialPlatform;
  content_category: ContentCategory;
  target_audience?: string;
  language_style?: 'taglish' | 'filipino' | 'english';
  date_created: string; // ISO string
  scheduled_date: string; // YYYY-MM-DD
  scheduled_time: string; // HH:mm (Philippine Time)
  approval_status: ContentStatus;
  publishing_status: 'PENDING' | 'PUBLISHING' | 'SUCCESS' | 'ERROR' | 'CANCELLED';
  published_date: string | null;
  publishing_error: string | null;
  platform_post_id: string | null;
  retry_count: number;
}

export interface UserBotSettings {
  ai_provider: 'gemini-3.8-flash' | 'gemini-flash-latest' | 'gemini-4-argon';
  default_platform: SocialPlatform;
  default_category: ContentCategory;
  default_audience: string;
  language_style: 'taglish' | 'filipino' | 'english';
  publishing_mode: PublishingMode;
  manual_approval_enabled: boolean;
  autopost_enabled: boolean;
  posts_per_day: number;
  daily_schedule_slots: string[]; // e.g. ["09:00", "14:00", "19:00"]
  supabase_url: string;
  supabase_anon_key: string;
  is_connected_to_supabase: boolean;
  telegram_or_webhook_url?: string;
}

export interface GenerateContentRequest {
  platform: SocialPlatform;
  category: ContentCategory;
  targetAudience: string;
  instructions: string;
  languageStyle: 'taglish' | 'filipino' | 'english';
  scheduledDate: string;
  scheduledTime: string;
  publishingMode: PublishingMode;
}

export interface GenerateContentResult {
  title: string;
  caption: string;
  hashtags: string[];
  imagePrompt: string;
  imageUrl?: string;
  suggestedSlots?: string[];
}

export interface BuildValidationItem {
  id: string;
  label: string;
  status: 'PASS' | 'FAIL' | 'SAVED' | 'CONFIGURED';
  details: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  session_token?: string;
  authenticated_at?: string;
}

export interface FacebookPageConfig {
  page_id: string;
  page_name: string;
  page_access_token: string;
  is_connected: boolean;
  fan_count?: number;
  last_tested?: string;
}

export interface DiagnosticTestItem {
  name: string;
  category: 'auth' | 'database' | 'scheduler' | 'facebook' | 'apk' | 'index';
  status: 'PENDING' | 'RUNNING' | 'PASS' | 'FAIL';
  latency_ms?: number;
  details: string;
  raw_response?: any;
}

