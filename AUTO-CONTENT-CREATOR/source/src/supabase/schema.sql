-- =========================================================================
-- AUTO CONTENT CREATOR BOT - SUPABASE SCHEMA & RLS SETUP
-- Target Database: PostgreSQL 15+ / Supabase
-- Timezone Standard: Philippine Standard Time (Asia/Manila, UTC+8)
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table if recreating (uncomment only when performing clean migration)
-- DROP TABLE IF EXISTS public.social_posts CASCADE;

CREATE TABLE IF NOT EXISTS public.social_posts (
    content_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_title TEXT NOT NULL,
    caption TEXT NOT NULL,
    hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
    image_url TEXT DEFAULT '',
    image_prompt TEXT DEFAULT '',
    platform VARCHAR(50) NOT NULL,
    content_category VARCHAR(100) NOT NULL,
    target_audience TEXT DEFAULT 'Filipino general audience',
    language_style VARCHAR(30) DEFAULT 'taglish',
    date_created TIMESTAMPTZ DEFAULT NOW(),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    approval_status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL',
    publishing_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    published_date TIMESTAMPTZ NULL,
    publishing_error TEXT NULL,
    platform_post_id TEXT NULL,
    retry_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast scheduler queries & status filtering
CREATE INDEX IF NOT EXISTS idx_posts_schedule 
    ON public.social_posts (scheduled_date, scheduled_time, approval_status);

CREATE INDEX IF NOT EXISTS idx_posts_approval_status 
    ON public.social_posts (approval_status);

CREATE INDEX IF NOT EXISTS idx_posts_publishing_status 
    ON public.social_posts (publishing_status);

CREATE INDEX IF NOT EXISTS idx_posts_platform 
    ON public.social_posts (platform);

-- Trigger to auto-update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.update_social_posts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_social_posts ON public.social_posts;
CREATE TRIGGER trg_update_social_posts
    BEFORE UPDATE ON public.social_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_social_posts_timestamp();

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous or authenticated reading of scheduled/published content
CREATE POLICY "Allow public select for active sessions"
    ON public.social_posts
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow authenticated and anon inserts from the app client
CREATE POLICY "Allow insert from client app"
    ON public.social_posts
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow updates for approval and publishing status changes
CREATE POLICY "Allow updates for approval and publishing"
    ON public.social_posts
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Allow deletion of drafts or cancelled posts
CREATE POLICY "Allow delete for cancelled or drafts"
    ON public.social_posts
    FOR DELETE
    TO anon, authenticated
    USING (approval_status IN ('DRAFT', 'REJECTED', 'CANCELLED'));

-- =========================================================================
-- SCHEDULED EDGE FUNCTION & CRON (pg_cron) EXAMPLE
-- Runs every 5 minutes to trigger publishing queue in Manila timezone
-- =========================================================================
-- SELECT cron.schedule(
--   'autopost-queue-worker',
--   '*/5 * * * *',
--   $$
--   SELECT net.http_post(
--     url := 'https://<your-project-ref>.supabase.co/functions/v1/autopost-dispatch',
--     headers := '{"Content-Type": "application/json", "Authorization": "Bearer <anon_or_service_key>"}'::jsonb,
--     body := '{"trigger": "cron_scheduler"}'::jsonb
--   );
--   $$
-- );
