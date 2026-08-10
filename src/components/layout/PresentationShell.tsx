import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './PresentationShell.module.css';
import { CHAPTER_COUNT, siteConfig } from '../../config/site.config';
import { useAutoplay } from '../../hooks/useAutoplay';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useSwipe } from '../../hooks/useSwipe';
import { useAudio } from '../../hooks/useAudio';

import Chapter0Preshow from '../chapters/Chapter0Preshow';
import Chapter1Opening from '../chapters/Chapter1Opening';
import Chapter2Respected from '../chapters/Chapter2Respected';
import Chapter3Roles from '../chapters/Chapter3Roles';
import Chapter4Father from '../chapters/Chapter4Father';
import Chapter5Wishes from '../chapters/Chapter5Wishes';
import Chapter6Climax from '../chapters/Chapter6Climax';
import Chapter7Video from '../chapters/Chapter7Video';
import Chapter7Closing from '../chapters/Chapter7Closing';
import ControlBar from '../ui/ControlBar';

export default function PresentationShell() {
  const [chapter, setChapter] = useState<number>(0);

  useEffect(() => {
    // Always start at Chapter 0 Preshow when visiting the site
    localStorage.removeItem('mf_chapter');
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [chapterProgress, setChapterProgress] = useState(0);

  const audio = useAudio();
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync chapter to localStorage
  useEffect(() => {
    if (siteConfig.features.persistChapter) {
      localStorage.setItem('mf_chapter', chapter.toString());
    }
  }, [chapter]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFS = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFS);
    return () => document.removeEventListener('fullscreenchange', handleFS);
  }, []);

  const goToChapter = useCallback((target: number) => {
    const valid = Math.min(Math.max(target, 0), CHAPTER_COUNT - 1);
    setChapter(valid);
    setChapterProgress(0);
  }, []);

  const advanceChapter = useCallback(() => {
    setChapter((c) => {
      if (c < CHAPTER_COUNT - 1) return c + 1;
      return c;
    });
    setChapterProgress(0);
  }, []);

  const prevChapter = useCallback(() => {
    setChapter((c) => Math.max(c - 1, 0));
    setChapterProgress(0);
  }, []);

  // Autoplay hook
  useAutoplay({
    currentChapter: chapter,
    totalChapters: CHAPTER_COUNT,
    isPlaying: isPlaying && siteConfig.features.autoplay,
    isOverlayOpen,
    onAdvance: advanceChapter,
  });

  // Track progress within chapter
  useEffect(() => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    if (chapter === 0 || !isPlaying || isOverlayOpen) {
      setChapterProgress(0);
      return;
    }

    const durations = [
      0,
      siteConfig.chapters.ch1_opening,
      siteConfig.chapters.ch2_respected,
      siteConfig.chapters.ch3_roles,
      siteConfig.chapters.ch4_father,
      siteConfig.chapters.ch5_wishes,
      siteConfig.chapters.ch6_climax,
      siteConfig.chapters.ch7_video,
      siteConfig.chapters.ch8_closing,
    ];
    const duration = durations[chapter] || 30000;
    const interval = 200;
    let elapsed = 0;

    progressTimerRef.current = setInterval(() => {
      elapsed += interval;
      setChapterProgress(Math.min(elapsed / duration, 1));
      if (elapsed >= duration) {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      }
    }, interval);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [chapter, isPlaying, isOverlayOpen]);

  // Start presentation from Preshow
  const handleStart = (withMusic: boolean) => {
    if (withMusic) {
      audio.play();
      setIsMuted(false);
    } else {
      audio.setMuted(true);
      setIsMuted(true);
    }
    setIsPlaying(true);
    goToChapter(1);
  };

  const togglePlay = () => {
    setIsPlaying((p) => !p);
  };

  const toggleMute = () => {
    const muted = audio.toggleMute();
    if (muted !== undefined) setIsMuted(muted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Keyboard navigation
  useKeyboard({
    onNext: advanceChapter,
    onPrev: prevChapter,
    onTogglePlay: togglePlay,
    onToggleMute: toggleMute,
    onToggleFullscreen: toggleFullscreen,
    onEscape: () => {
      if (isOverlayOpen) {
        setIsOverlayOpen(false);
      }
    },
    enabled: true,
  });

  // Touch swipe navigation
  useSwipe({
    onSwipeLeft: advanceChapter,
    onSwipeRight: prevChapter,
    enabled: !isOverlayOpen,
  });

  return (
    <div className={styles.shell}>
      {/* Chapter Render Container */}
      <main className={styles.stage} id="presentation-stage">
        {chapter === 0 && (
          <Chapter0Preshow
            onStart={handleStart}
            onToggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen}
          />
        )}
        {chapter === 1 && <Chapter1Opening />}
        {chapter === 2 && <Chapter2Respected />}
        {chapter === 3 && <Chapter3Roles />}
        {chapter === 4 && <Chapter4Father />}
        {chapter === 5 && (
          <Chapter5Wishes
            onOverlayOpen={() => {
              setIsOverlayOpen(true);
              audio.duck();
            }}
            onOverlayClose={() => {
              setIsOverlayOpen(false);
              audio.unduck();
            }}
          />
        )}
        {chapter === 6 && <Chapter6Climax />}
        {chapter === 7 && (
          <Chapter7Video
            onOverlayOpen={() => {
              setIsOverlayOpen(true);
              audio.duck();
            }}
            onOverlayClose={() => {
              setIsOverlayOpen(false);
              audio.unduck();
            }}
          />
        )}
        {chapter === 8 && (
          <Chapter7Closing
            onRestart={() => goToChapter(1)}
            onGoToWishes={() => goToChapter(5)}
            onGoToVideo={() => goToChapter(7)}
            onGoToPreshow={() => goToChapter(0)}
          />
        )}
      </main>

      {/* Control Bar (Only shown from Chapter 1 onwards) */}
      {chapter > 0 && (
        <ControlBar
          currentChapter={chapter}
          totalChapters={CHAPTER_COUNT}
          isPlaying={isPlaying}
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          onPrev={prevChapter}
          onNext={advanceChapter}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
          onToggleFullscreen={toggleFullscreen}
          onGoToChapter={goToChapter}
          chapterProgress={chapterProgress}
        />
      )}
    </div>
  );
}
