import { useEffect, useState } from 'react';
import styles from './Chapter4Father.module.css';
import ParticleLayer from '../ui/ParticleLayer';
import { siteConfig } from '../../config/site.config';

const familyPhotos = [
  { src: '/assets/family/family-1.jpeg', alt: 'Bersama Keluarga', label: 'Momen Bersama Anak & Keluarga' },
  { src: '/assets/family/family-2.jpeg', alt: 'Momen Kebersamaan', label: 'Momen Hangat Keluarga' },
  { src: '/assets/family/family-3.jpeg', alt: 'Bermain Bersama', label: 'Senyum Sang Buah Hati' },
];

export default function Chapter4Father() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const { person } = siteConfig;

  return (
    <div className={`${styles.chapter} ${mounted ? styles.mounted : ''}`}>
      {/* Warm background */}
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.warmGlow} aria-hidden="true" />
      <ParticleLayer count={10} color="amber" intensity="subtle" />

      <div className={styles.layout}>
        {/* Left: text content */}
        <div className={styles.content}>
          <div className={styles.label}>Dunia Kecil Bernama Ayah</div>

          <blockquote className={styles.mainQuote}>
            "Bagi banyak orang, beliau adalah seorang pemimpin. Tetapi bagi satu hati kecil, beliau adalah <em>rumah</em>."
          </blockquote>

          <div className={styles.nameArea}>
            <div className={styles.personName}>{person.name}</div>
            <div className={styles.personRole}>Seorang Ayah</div>
          </div>

          {/* Child message placeholder */}
          <div className={styles.childMessage}>
            <div className={styles.childMessageInner}>
              <div className={styles.childIcon}>💛</div>
              <p className={styles.childText}>
                "Selamat ulang tahun, Ayah."
              </p>
              <div className={styles.childNote}>
                — Pesan dari buah hati tercinta
              </div>
            </div>
          </div>
        </div>

        {/* Right: family photos grid */}
        <div className={styles.photosArea}>
          <div className={styles.photosGrid}>
            {familyPhotos.map((photo, i) => (
              <div
                key={i}
                className={styles.photoCard}
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className={styles.photoImg}
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = 'none';
                    el.parentElement!.classList.add(styles.photoCardEmpty);
                  }}
                />
                <div className={styles.photoPlaceholder}>
                  <span className={styles.phIcon}>📷</span>
                  <span className={styles.phText}>{photo.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
