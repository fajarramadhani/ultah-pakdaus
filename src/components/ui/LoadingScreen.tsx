import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';
import { siteConfig } from '../../config/site.config';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let frame: number;
    const startTime = performance.now();
    const duration = 2400;

    const animate = (now: number) => {
      const elapsed = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setProgress(Math.round(eased * 100));

      if (elapsed < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onComplete, 800);
        }, 400);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <div className={`${styles.screen} ${fadeOut ? styles.fadeOut : ''}`} role="status" aria-label="Memuat pengalaman...">
      <div className={styles.logoContainer}>
        <img src="/assets/apg-logo.jpg" alt="Logo APG" className={styles.apgLogo} />
      </div>
      <div className={styles.name}>{siteConfig.person.name}</div>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
      <div className={styles.label}>Mempersiapkan pengalaman…</div>
    </div>
  );
}
