import { useEffect, useState } from 'react';
import styles from './Chapter6Climax.module.css';
import ParticleLayer from '../ui/ParticleLayer';
import { siteConfig } from '../../config/site.config';

type Phase = 'mosaic' | 'phrases' | 'cheer';

export default function Chapter6Climax() {
  const [phase, setPhase] = useState<Phase>('mosaic');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('phrases'), 3500);
    const t2 = setTimeout(() => setPhase('cheer'), 8000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const { person } = siteConfig;

  // Generate grid tiles from all gallery & leadership photos
  const galleryPhotos = Array.from({ length: 20 }, (_, i) => `/assets/gallery/gallery-${i + 1}.jpeg`).concat(
    Array.from({ length: 4 }, (_, i) => `/assets/leadership/leadership-${i + 1}.jpeg`)
  );

  const tiles = Array.from({ length: 24 }, (_, i) => {
    return {
      id: i,
      name: `Momen ${i + 1}`,
      portrait: galleryPhotos[i % galleryPhotos.length],
    };
  });

  return (
    <div className={`${styles.chapter} ${mounted ? styles.mounted : ''}`}>
      <div className={styles.bg} aria-hidden="true" />
      <ParticleLayer count={35} color="champagne" intensity="medium" />

      <div className={styles.content}>
        {/* Phase 1 & 2: Mosaic & Monogram / Portrait transition */}
        <div className={`${styles.mosaicArea} ${phase !== 'mosaic' ? styles.mosaicFormed : ''}`}>
          <div className={styles.grid}>
            {tiles.map((tile, i) => (
              <div
                key={tile.id}
                className={styles.tile}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {tile.portrait ? (
                  <img
                    src={tile.portrait}
                    alt={tile.name}
                    className={styles.tileImg}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <div className={styles.tileFallback}>{tile.name.charAt(0)}</div>
              </div>
            ))}
          </div>

          {/* Monogram Overlay on formed mosaic */}
          <div className={styles.overlayMonogram}>
            <span className={styles.monogramText}>{person.monogram}</span>
          </div>
        </div>

        {/* Text sequence */}
        <div className={styles.textContainer}>
          {phase === 'mosaic' && (
            <div className={styles.subtextFade}>
              <p className={styles.leadText}>Banyak peran. Banyak cerita. Banyak hati yang disentuh.</p>
            </div>
          )}

          {phase === 'phrases' && (
            <div className={styles.climaxTextFade}>
              <h2 className={styles.climaxHeadline}>Seribu Sosok. Satu Firdaus.</h2>
            </div>
          )}

          {phase === 'cheer' && (
            <div className={styles.cheerFade}>
              <div className={styles.cheerLabel}>Selamat Ulang Tahun</div>
              <h1 className={styles.cheerHeadline}>
                SELAMAT ULANG TAHUN,<br />
                <span>PAK FIRDAUS!</span>
              </h1>
              <div className={styles.cheerAge}>ke-26</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
