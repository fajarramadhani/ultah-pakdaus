import { useEffect, useState } from 'react';
import styles from './Chapter7Closing.module.css';
import ParticleLayer from '../ui/ParticleLayer';
import { siteConfig } from '../../config/site.config';

interface Chapter7ClosingProps {
  onRestart: () => void;
  onGoToWishes: () => void;
  onGoToVideo?: () => void;
  onGoToPreshow: () => void;
}

export default function Chapter7Closing({
  onRestart,
  onGoToWishes,
  onGoToVideo,
  onGoToPreshow,
}: Chapter7ClosingProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const { person } = siteConfig;

  return (
    <div className={`${styles.chapter} ${mounted ? styles.mounted : ''}`}>
      <div className={styles.bg} aria-hidden="true" />
      <ParticleLayer count={15} color="champagne" intensity="subtle" />

      <div className={`${styles.content} chapter-scroll`}>
        <div className={styles.card}>
          <div className={styles.logoContainer}>
            <img src="/assets/apg-logo.jpg" alt="Logo APG" className={styles.apgLogo} />
          </div>

          <p className={styles.closingQuote}>
            "Di usia ke-26, semoga setiap langkah yang ditempuh selalu membawa kebaikan bagi orang-orang yang berjalan bersama."
          </p>

          <p className={styles.closingSubquote}>
            "Semoga tetap menjadi sosok yang menginspirasi, memimpin dengan keteguhan, dan hadir dengan ketulusan."
          </p>

          <div className={styles.divider} />

          <div className={styles.birthdayBadge}>
            <div className={styles.badgeLabel}>SELAMAT ULANG TAHUN KE-26</div>
            <h1 className={styles.badgeName}>{person.name}</h1>
            <div className={styles.badgeDate}>{person.birthdayDate}</div>
          </div>

          <div className={styles.finalTagline}>
            "Satu Nama. Seribu Sosok. Ribuan Arti."
          </div>

          {/* Navigation Action Buttons */}
          <div className={styles.actions}>
            <button className={styles.btnPrimary} onClick={onRestart}>
              Putar Ulang
            </button>
            {onGoToVideo && (
              <button className={styles.btnSecondary} onClick={onGoToVideo}>
                🎬 Video Persembahan
              </button>
            )}
            <button className={styles.btnSecondary} onClick={onGoToWishes}>
              Lihat Semua Ucapan
            </button>
            <button className={styles.btnSecondary} onClick={onGoToPreshow}>
              Kembali ke Layar Acara
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
