import { useEffect, useState } from 'react';
import styles from './Chapter2Respected.module.css';
import { siteConfig } from '../../config/site.config';

const traits = ['Visioner', 'Tenang', 'Tegas', 'Menghargai', 'Dipercaya'];

export default function Chapter2Respected() {
  const [traitIndex, setTraitIndex] = useState(0);
  const [traitVisible, setTraitVisible] = useState(true);
  const [allShown, setAllShown] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  useEffect(() => {
    if (allShown) return;
    const timer = setTimeout(() => {
      if (traitIndex < traits.length - 1) {
        setTraitVisible(false);
        setTimeout(() => {
          setTraitIndex((i) => i + 1);
          setTraitVisible(true);
        }, 600);
      } else {
        setTimeout(() => setAllShown(true), 2500);
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [traitIndex, allShown]);

  const { person } = siteConfig;

  return (
    <div className={`${styles.chapter} ${mounted ? styles.mounted : ''}`}>
      {/* Background */}
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.lightBeam} aria-hidden="true" />

      <div className={styles.layout}>
        {/* Left: single full-height editorial photo */}
        <div className={styles.photoArea}>
          <div className={styles.photoFrame}>
            <img
              src={person.heroPhoto}
              alt={`${person.name} dalam kepemimpinan`}
              className={styles.photo}
              style={{ objectPosition: person.heroPhotoPosition }}
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = 'none';
                el.parentElement!.classList.add(styles.photoFallback);
              }}
            />
            <div className={styles.photoGrade} />
          </div>
        </div>

        {/* Right: content */}
        <div className={styles.content}>
          <div className={styles.label}>Sosok yang Disegani</div>

          {/* Trait word */}
          <div className={styles.traitArea} aria-live="polite">
            {!allShown ? (
              <span className={`${styles.trait} ${traitVisible ? styles.traitIn : styles.traitOut}`}>
                {traits[traitIndex]}
              </span>
            ) : (
              <div className={styles.allTraits}>
                {traits.map((t, i) => (
                  <span key={t} className={styles.traitChip} style={{ animationDelay: `${i * 0.15}s` }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <blockquote className={styles.quote}>
            "Tak semua kewibawaan lahir dari suara yang keras. Ada yang tumbuh dari ketenangan, ketegasan, dan cara memperlakukan orang lain dengan hormat."
          </blockquote>

          <div className={styles.metaLine}>
            <span className={styles.metaName}>{person.name}</span>
            <span className={styles.metaDot} aria-hidden="true">·</span>
            <span className={styles.metaRole}>{person.title}, {person.company}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
