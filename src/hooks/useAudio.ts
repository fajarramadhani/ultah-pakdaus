import { useEffect, useRef, useCallback } from 'react';
import { siteConfig } from '../config/site.config';

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadingRef = useRef(false);
  const isMutedRef = useRef(false);

  useEffect(() => {
    if (!siteConfig.audio.enabled) return;
    const audio = new Audio(siteConfig.audio.src);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const fadeVolume = useCallback(
    (targetVolume: number, durationMs: number) => {
      const audio = audioRef.current;
      if (!audio || isMutedRef.current) return;
      const startVolume = audio.volume;
      const startTime = performance.now();
      const diff = targetVolume - startVolume;
      fadingRef.current = true;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 2);
        audio.volume = Math.max(0, Math.min(1, startVolume + diff * eased));
        if (progress < 1 && fadingRef.current) {
          requestAnimationFrame(step);
        } else {
          fadingRef.current = false;
        }
      };
      requestAnimationFrame(step);
    },
    []
  );

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch(() => {});
    fadeVolume(siteConfig.audio.volume, siteConfig.audio.fadeInMs);
  }, [fadeVolume]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    fadeVolume(0, siteConfig.audio.fadeOutMs);
    setTimeout(() => audio.pause(), siteConfig.audio.fadeOutMs);
  }, [fadeVolume]);

  const duck = useCallback(() => {
    fadeVolume(siteConfig.audio.duckingVolume, 800);
  }, [fadeVolume]);

  const unduck = useCallback(() => {
    if (!isMutedRef.current) {
      fadeVolume(siteConfig.audio.volume, 1200);
    }
  }, [fadeVolume]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    isMutedRef.current = !isMutedRef.current;
    if (isMutedRef.current) {
      fadingRef.current = false;
      audio.volume = 0;
    } else {
      fadeVolume(siteConfig.audio.volume, 800);
    }
    return isMutedRef.current;
  }, [fadeVolume]);

  const setMuted = useCallback((muted: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    isMutedRef.current = muted;
    if (muted) {
      fadingRef.current = false;
      audio.volume = 0;
    } else {
      fadeVolume(siteConfig.audio.volume, 800);
    }
  }, [fadeVolume]);

  return { play, pause, duck, unduck, toggleMute, setMuted, audioRef };
}
