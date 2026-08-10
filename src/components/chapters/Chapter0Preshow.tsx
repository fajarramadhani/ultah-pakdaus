import { useEffect, useState, useCallback } from 'react';
import styles from './Chapter0Preshow.module.css';
import ParticleLayer from '../ui/ParticleLayer';
import { siteConfig } from '../../config/site.config';

interface Chapter0PreshowProps {
  onStart: (withMusic: boolean) => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

const ambientWords = ['PEMIMPIN', 'PANUTAN', 'SAHABAT', 'AYAH'];

export default function Chapter0Preshow({
  onStart,
  onToggleFullscreen,
  isFullscreen,
}: Chapter0PreshowProps) {
  const [audioMode, setAudioMode] = useState<'with' | 'without'>('with');
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Ambient word cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ambientWords.length);
        setWordVisible(true);
      }, 700);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = useCallback(() => {
    onStart(audioMode === 'with');
  }, [onStart, audioMode]);

  // Global Enter & Space key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStart]);

  const { person } = siteConfig;

  return (
    <div className={`${styles.preshow} ${mounted ? styles.mounted : ''}`}>
      {/* Background layers */}
      <div className={styles.bgGradient} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.portraitGlow} aria-hidden="true" />

      {/* Subtle Monogram Background */}
      <div className={styles.bgMonogram} aria-hidden="true">
        <span>MF</span>
      </div>

      {/* Ambient Words Floating in Background */}
      <div className={styles.ambientWordArea} aria-hidden="true">
        <span
          className={`${styles.ambientWord} ${
            wordVisible ? styles.ambientWordIn : styles.ambientWordOut
          }`}
        >
          {ambientWords[wordIndex]}
        </span>
      </div>

      {/* Champagne Particles */}
      {siteConfig.features.particles && (
        <ParticleLayer count={12} color="champagne" intensity="subtle" />
      )}

      {/* Top-Left APG Logo Header */}
      <div className={styles.topLeftLogo}>
        <div className={styles.logoBadge}>
          <img
            src="/assets/apg-logo.jpg"
            alt="Logo APG"
            className={styles.apgLogoImg}
          />
        </div>
      </div>

      {/* Top-Right Icon Toolbar (Audio Soundtrack Toggle + Fullscreen) */}
      <div className={styles.topRightControls}>
        <button
          type="button"
          className={`${styles.iconBtn} ${
            audioMode === 'with' ? styles.iconBtnActive : ''
          }`}
          onClick={() =>
            setAudioMode((prev) => (prev === 'with' ? 'without' : 'with'))
          }
          aria-label={
            audioMode === 'with' ? 'Soundtrack aktif' : 'Soundtrack nonaktif'
          }
          title={
            audioMode === 'with' ? 'Soundtrack aktif' : 'Soundtrack nonaktif'
          }
        >
          {audioMode === 'with' ? (
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 19L19 20.27 20.27 19 5.27 4 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          )}
          {audioMode === 'with' && (
            <span className={styles.soundDot} aria-hidden="true" />
          )}
        </button>

        {onToggleFullscreen && (
          <button
            type="button"
            className={styles.iconBtn}
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
            title={isFullscreen ? 'Keluar Layar Penuh (F)' : 'Layar Penuh (F)'}
          >
            {isFullscreen ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Main Split Grid Container */}
      <div className={styles.container}>
        {/* Left Column — Editorial Identity Content */}
        <div className={styles.leftCol}>

          {/* Tribute Eyebrow & Date */}
          <div className={styles.eyebrow}>
            <span>A BIRTHDAY PORTRAIT</span>
            <span className={styles.eyebrowDot} aria-hidden="true">
              ·
            </span>
            <span>10-08-2026</span>
          </div>

          {/* MAIN HEADLINE NAME — TEKS TERBESAR & PALING DOMINAN */}
          <h1 className={styles.nameHeadline}>
            <span className={styles.firstName}>MUHAMMAD</span>
            <span className={styles.lastName}>FIRDAUS</span>
          </h1>

          {/* Supporting Theme Statement */}
          <div className={styles.themeStatement}>Satu Nama. Seribu Sosok.</div>

          {/* Editorial Description */}
          <p className={styles.description}>
            Seorang pemimpin, panutan, sahabat, dan ayah—hadir dengan arti yang
            berbeda bagi setiap orang.
          </p>

          {/* Primary CTA Button & Keyboard Hint */}
          <div className={styles.ctaGroup}>
            <button
              type="button"
              id="btn-start-experience"
              className={styles.btnPrimary}
              onClick={handleStart}
              aria-label="Saksikan Persembahan"
            >
              <span>SAKSIKAN PERSEMBAHAN</span>
              <span className={styles.arrowCircle} aria-hidden="true">
                →
              </span>
            </button>

            <div className={styles.enterHint}>ENTER · BUKA PERSEMBAHAN</div>
          </div>
        </div>

        {/* Right Column — Hero Portrait seamlessly integrated with background */}
        <div className={styles.rightCol}>
          <div className={styles.portraitWrapper}>
            <img
              src={person.heroPhoto}
              alt={`Portrait ${person.name}`}
              className={styles.portraitImg}
              style={{ objectPosition: person.heroPhotoPosition }}
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = 'none';
              }}
            />
            <div className={styles.portraitMask} aria-hidden="true" />
            <div className={styles.portraitRimLight} aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
