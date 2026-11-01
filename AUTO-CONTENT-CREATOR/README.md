# AUTO CONTENT CREATOR BOT
### AI Content Creator at Social Media Automation Assistant (Philippine Standard Time UTC+8)

Maligayang pagdating sa **Auto Content Creator Bot** — isang kumpletong full-stack system para sa paggawa ng kalidad na social media content, awtomatikong pag-iiskedyul batay sa Philippine Time (Asia/Manila), manual review at approval workflow, at awtomatikong pag-publish sa mga pangunahing social media platforms (Facebook, Instagram, TikTok, X, LinkedIn, YouTube Shorts).

---

## 📁 Project Structure (Section 13 Compliant)

```
AUTO-CONTENT-CREATOR/
├── index.html                   # Standalone Web Application & WebView Interface
├── README.md                    # Setup, Installation, at Deployment Guide
├── build-report.txt             # Verification and Quality Assurance Report
├── source/                      # Complete React + TypeScript + Express backend sources
├── android/                     # Android Studio Native Project (WebView wrapper)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── java/com/autocontentcreator/bot/MainActivity.java
│   │   │   └── res/values/strings.xml
│   │   └── build.gradle
│   ├── build.gradle
│   └── settings.gradle
├── apk/
│   └── AUTO-CONTENT-CREATOR.apk # Installable Android Application Package
└── backup/                      # Version archives & timestamped snapshots
```

---

## 🚀 Key Features

1. **Daily AI Content Generation**:
   - Gumagawa ng catchy titles, engaging captions na may emojis, 5-8 relevant hashtags, at image generation prompts.
   - Sumusuporta sa Taglish, Filipino (Tagalog), at Professional English.
   - Platforms: Facebook, Instagram, TikTok, X / Twitter, LinkedIn, YouTube Shorts, Threads, Pinterest.
   - Categories: Educational, Inspirational, Entertainment, Promotional, Informative, Tips & Tutorials, Image-based.

2. **Supabase Database Persistence**:
   - Awtomatikong nagse-save ng lahat ng content sa Supabase database (`social_posts` table).
   - May kasamang offline-first local storage cache para tuloy-tuloy ang trabaho kahit offline o naglo-load ang network.
   - Kompleto sa Row Level Security (RLS) policies at indexes para sa mabilis na paghahanap.

3. **Philippine Time Scheduler (Asia/Manila, UTC+8)**:
   - Real-time live clock naka-sync sa Philippine Standard Time.
   - Peak engagement preset slots (08:30 Morning commute, 12:15 Lunch, 15:30 Merienda, 18:45 Prime evening, 21:30 Bedtime).
   - Date picker, time picker, daily posting quota (1-10 posts kada araw).

4. **Dual Publishing Modes**:
   - **Manual Approval Mode**: Naghihintay ng pag-review ng user bago ilagay sa publishing queue. May realistic interactive phone mockup preview.
   - **AutoPost Mode**: Kapag sumapit ang scheduled date at time, awtomatikong nagpu-publish sa napiling platform nang walang manual intervention.

5. **9-Tier Status Management**:
   - `DRAFT`
   - `PENDING_APPROVAL`
   - `APPROVED`
   - `SCHEDULED`
   - `PUBLISHING`
   - `PUBLISHED`
   - `REJECTED`
   - `FAILED`
   - `CANCELLED`

---

## 🛠️ Installation & Setup Guide

### 1. Web Application (Vite + Express)
```bash
# 1. Install dependencies
npm install

# 2. Start development server (Port 3000)
npm run dev

# 3. Production build
npm run build
npm start
```

### 2. Supabase Setup
1. Pumunta sa iyong Supabase Dashboard -> **SQL Editor**.
2. Kopyahin at i-paste ang nilalaman ng `src/supabase/schema.sql`.
3. I-click ang **RUN** para likhain ang `social_posts` table, triggers, at RLS policies.
4. Sa application UI, buksan ang **Supabase Settings** modal at ilagay ang iyong:
   - `SUPABASE_URL` (hal. `https://xyzcompany.supabase.co`)
   - `SUPABASE_ANON_KEY`
5. I-click ang **Test Connection** para matiyak na aktibo ang database.

### 3. Android APK Installation
- Direktang i-download ang `AUTO-CONTENT-CREATOR.apk` mula sa web dashboard o mula sa `apk/` folder.
- Sa Android device, i-enable ang *"Install Unknown Apps"* sa Settings -> Security.
- I-tap ang APK file at i-click ang **Install**.
- Ang app ay bubukas sa full-screen WebView mode na may offline support at native performance.

---

## 📝 License
Apache-2.0 License. Built for modern creators and automation teams.
