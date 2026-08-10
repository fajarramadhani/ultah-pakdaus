import { useEffect, useCallback } from 'react';

interface KeyboardOptions {
  onNext: () => void;
  onPrev: () => void;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onEscape: () => void;
  enabled: boolean;
}

export function useKeyboard({
  onNext,
  onPrev,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
  onEscape,
  enabled,
}: KeyboardOptions) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      // Don't trigger when user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          onNext();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          onPrev();
          break;
        case ' ':
          e.preventDefault();
          onTogglePlay();
          break;
        case 'm':
        case 'M':
          onToggleMute();
          break;
        case 'f':
        case 'F':
          onToggleFullscreen();
          break;
        case 'Escape':
          onEscape();
          break;
        default:
          break;
      }
    },
    [enabled, onNext, onPrev, onTogglePlay, onToggleMute, onToggleFullscreen, onEscape]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);
}
