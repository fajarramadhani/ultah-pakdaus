import { useState, useEffect, useRef } from 'react';
import styles from './ControlBar.module.css';
import { CHAPTER_LABELS } from '../../config/site.config';
import { siteConfig } from '../../config/site.config';

interface ControlBarProps {
  currentChapter: number;
  totalChapters: number;
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onGoToChapter: (n: number) => void;
  chapterProgress: number; // 0-1
}

export default function ControlBar({
  currentChapter,
  totalChapters,
  isPlaying,
  isMuted,
  isFullscreen,
  onPrev,
  onNext,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
  onGoToChapter,
  chapterProgress,
}: ControlBarProps) {
  const [visible, setVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showNav, setShowNav] = useState(false);

  const resetHideTimer = () => {
    setVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (currentChapter > 0) setVisible(false);
    }, siteConfig.presentation.autoHideControlsMs);
  };

  useEffect(() => {
    resetHideTimer();
    const handleActivity = () => resetHideTimer();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapter]);

  return (
    <div
      className={`${styles.bar} ${visible || currentChapter === 0 ? styles.visible : styles.hidden}`}
      role="toolbar"
      aria-label="Kontrol presentasi"
    >
      {/* Progress line */}
      {currentChapter > 0 && (
        <div className={styles.progressLine}>
          <div className={styles.progressFill} style={{ width: `${chapterProgress * 100}%` }} />
        </div>
      )}

      <div className={styles.inner}>
        {/* Left: chapter indicator */}
        <div className={styles.chapterInfo}>
          <button
            className={styles.chapterButton}
            onClick={() => setShowNav(!showNav)}
            aria-label="Pilih chapter"
            aria-expanded={showNav}
          >
            <span className={styles.chapterNum}>{currentChapter}</span>
            <span className={styles.chapterName}>{CHAPTER_LABELS[currentChapter]}</span>
            <ChevronIcon />
          </button>

          {showNav && (
            <div className={styles.chapterNav}>
              {CHAPTER_LABELS.map((label, i) => (
                <button
                  key={i}
                  className={`${styles.chapterNavItem} ${i === currentChapter ? styles.active : ''}`}
                  onClick={() => { onGoToChapter(i); setShowNav(false); }}
                >
                  <span className={styles.navNum}>{i}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: main controls */}
        <div className={styles.controls}>
          <button
            className={styles.btn}
            onClick={onPrev}
            disabled={currentChapter === 0}
            aria-label="Chapter sebelumnya"
          >
            <PrevIcon />
          </button>
          <button
            className={`${styles.btn} ${styles.playBtn}`}
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Jeda' : 'Putar'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            className={styles.btn}
            onClick={onNext}
            disabled={currentChapter >= totalChapters - 1}
            aria-label="Chapter berikutnya"
          >
            <NextIcon />
          </button>
        </div>

        {/* Right: utility */}
        <div className={styles.utilities}>
          <button
            className={styles.btn}
            onClick={onToggleMute}
            aria-label={isMuted ? 'Aktifkan suara' : 'Matikan suara'}
          >
            {isMuted ? <MuteIcon /> : <SoundIcon />}
          </button>
          <button
            className={styles.btn}
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? 'Keluar layar penuh' : 'Layar penuh'}
          >
            {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Icons ────────────────────────────────────────────────────
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);
const PrevIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <polygon points="15,3 5,12 15,21" />
    <rect x="16" y="3" width="2" height="18" />
  </svg>
);
const NextIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <polygon points="9,3 19,12 9,21" />
    <rect x="6" y="3" width="2" height="18" />
  </svg>
);
const SoundIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
  </svg>
);
const MuteIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 19L19 20.27 20.27 19 5.27 4 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </svg>
);
const FullscreenIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
  </svg>
);
const ExitFullscreenIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
  </svg>
);
const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
    <path d="M7 10l5 5 5-5H7z" />
  </svg>
);
