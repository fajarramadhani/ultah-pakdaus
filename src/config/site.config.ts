// ============================================================
// SITE CONFIGURATION — Edit this file to customize the website
// ============================================================

export interface SiteConfig {
  person: PersonConfig;
  presentation: PresentationConfig;
  audio: AudioConfig;
  chapters: ChapterTimings;
  features: FeatureFlags;
}

interface PersonConfig {
  name: string;
  nameShort: string;
  title: string;
  company: string;
  age: number;
  birthdayDate: string;
  monogram: string;
  heroPhoto: string;          // path relative to /public
  heroPhotoPosition: string;  // CSS object-position for hero
  heroPhotoPositionMobile: string;
  tributeVideoUrl?: string;   // Google Drive video URL
}

interface PresentationConfig {
  totalDurationMs: number;    // total target duration in ms
  autoHideControlsMs: number; // ms before controls hide
  idleReturnMs: number;       // ms idle before returning to preshow (0 = disabled)
}

interface AudioConfig {
  enabled: boolean;
  src: string;
  volume: number;       // 0-1
  fadeInMs: number;
  fadeOutMs: number;
  duckingVolume: number; // volume during video
}

interface ChapterTimings {
  ch0_preshow: number;     // ms (preshow is ambient, no autoplay timer)
  ch1_opening: number;
  ch2_respected: number;
  ch3_roles: number;
  ch4_father: number;
  ch5_wishes: number;
  ch6_climax: number;
  ch7_video: number;
  ch8_closing: number;
}

interface FeatureFlags {
  autoplay: boolean;
  showFilmGrain: boolean;
  particles: boolean;
  parallax: boolean;
  ambientLoop: boolean;   // return to preshow after idle
  persistChapter: boolean; // remember chapter on refresh
}

// ============================================================
// MAIN CONFIGURATION — Edit values below
// ============================================================

export const siteConfig: SiteConfig = {
  person: {
    name: 'Muhammad Firdaus',
    nameShort: 'Firdaus',
    title: 'Direktur Utama',
    company: 'APG',
    age: 26,
    birthdayDate: '10 Agustus 2026',
    monogram: 'MF',
    heroPhoto: '/assets/firdaus/hero.jpeg',
    heroPhotoPosition: '50% 20%',
    heroPhotoPositionMobile: '50% 15%',
    tributeVideoUrl: 'https://drive.google.com/file/d/1ABC_EXAMPLE_ID/view?usp=sharing',
  },

  presentation: {
    totalDurationMs: 5 * 60 * 1000, // 5 minutes
    autoHideControlsMs: 3000,
    idleReturnMs: 0, // set to e.g. 120000 (2min) to enable ambient return
  },

  audio: {
    enabled: true,
    src: '/assets/audio/background.mp3',
    volume: 0.35,
    fadeInMs: 2000,
    fadeOutMs: 1500,
    duckingVolume: 0.08,
  },

  chapters: {
    ch0_preshow: 0,           // ambient, no timer
    ch1_opening: 45 * 1000,   // 45 seconds
    ch2_respected: 40 * 1000, // 40 seconds
    ch3_roles: 45 * 1000,     // 45 seconds
    ch4_father: 50 * 1000,    // 50 seconds
    ch5_wishes: 90 * 1000,    // 90 seconds (wish showcase)
    ch6_climax: 40 * 1000,    // 40 seconds
    ch7_video: 90 * 1000,     // 90 seconds (video persembahan)
    ch8_closing: 50 * 1000,   // 50 seconds
  },

  features: {
    autoplay: true,
    showFilmGrain: true,
    particles: true,
    parallax: true,
    ambientLoop: false,
    persistChapter: true,
  },
};

export const CHAPTER_COUNT = 9; // 0–8
export const CHAPTER_LABELS = [
  'Preshow',
  'Opening',
  'Sosok yang Disegani',
  'Banyak Peran',
  'Dunia Kecil',
  'Ucapan',
  'Klimaks',
  'Video Persembahan',
  'Penutup',
];
