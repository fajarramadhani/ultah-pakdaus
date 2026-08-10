import { useEffect, useRef, useCallback } from 'react';
import { siteConfig } from '../config/site.config';

interface AutoplayOptions {
  currentChapter: number;
  totalChapters: number;
  isPlaying: boolean;
  isOverlayOpen: boolean;
  onAdvance: () => void;
}

export function useAutoplay({
  currentChapter,
  totalChapters,
  isPlaying,
  isOverlayOpen,
  onAdvance,
}: AutoplayOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getChapterDuration = useCallback((chapter: number): number => {
    const timings = siteConfig.chapters;
    const durations = [
      timings.ch0_preshow,
      timings.ch1_opening,
      timings.ch2_respected,
      timings.ch3_roles,
      timings.ch4_father,
      timings.ch5_wishes,
      timings.ch6_climax,
      timings.ch7_video,
      timings.ch8_closing,
    ];
    return durations[chapter] ?? 0;
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimer();

    // Chapter 0 is ambient — no auto-advance
    if (currentChapter === 0) return;
    // Last chapter — no auto-advance
    if (currentChapter >= totalChapters - 1) return;
    // Not playing or overlay is open
    if (!isPlaying || isOverlayOpen) return;

    const duration = getChapterDuration(currentChapter);
    if (!duration) return;

    timerRef.current = setTimeout(() => {
      onAdvance();
    }, duration);

    return () => clearTimer();
  }, [currentChapter, isPlaying, isOverlayOpen, totalChapters, getChapterDuration, clearTimer, onAdvance]);

  return { clearTimer };
}
