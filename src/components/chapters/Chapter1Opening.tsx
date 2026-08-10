import { useEffect, useState } from 'react';
import styles from './Chapter1Opening.module.css';
import { siteConfig } from '../../config/site.config';

const sentences = [
  'Bagi sebagian orang, beliau adalah seorang pemimpin.',
  'Bagi yang lain, seorang mentor dan panutan.',
  'Bagi sahabatnya, seseorang yang selalu hadir.',
  'Dan bagi satu hati kecil, beliau adalah Ayah.',
];

type Phase =
  | 'sentences'
  | 'portrait'
  | 'title'
  | 'tagline'
  | 'done';

export default function Chapter1Opening() {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [sentenceVisible, setSentenceVisible] = useState(true);
  const [phase, setPhase] = useState<Phase>('sentences');

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (phase === 'sentences') {
      if (sentenceIndex < sentences.length - 1) {
        timeout = setTimeout(() => {
          setSentenceVisible(false);
          setTimeout(() => {
            setSentenceIndex((i) => i + 1);
            setSentenceVisible(true);
          }, 700);
        }, 3000);
      } else {
        timeout = setTimeout(() => {
          setSentenceVisible(false);
          setTimeout(() => setPhase('portrait'), 800);
        }, 3200);
      }
    }
    return () => clearTimeout(timeout);
  }, [phase, sentenceIndex]);

  useEffect(() => {
    if (phase === 'portrait') {
      setTimeout(() => setPhase('title'), 2000);
    }
    if (phase === 'title') {
      setTimeout(() => setPhase('tagline'), 2000);
    }
  }, [phase]);

  const { person } = siteConfig;

  return (
    <div className={styles.chapter}>
      <div className={styles.bg} />

      {/* Sentences phase */}
      {phase === 'sentences' && (
        <div className={styles.sentenceArea}>
          <p
            className={`${styles.sentence} ${sentenceVisible ? styles.visible : styles.hidden}`}
          >
            {sentences[sentenceIndex]}
          </p>
        </div>
      )}

      {/* Portrait + title */}
      {(phase === 'portrait' || phase === 'title' || phase === 'tagline' || phase === 'done') && (
        <div className={styles.portraitScene}>
          <div className={styles.portraitFrame}>
            <img
              src={person.heroPhoto}
              alt={`Portrait ${person.name}`}
              className={styles.portraitImg}
              style={{ objectPosition: person.heroPhotoPosition }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.classList.add(styles.portraitFallback);
              }}
            />
            <div className={styles.portraitOverlay} />
            <div className={styles.portraitGlow} />
          </div>

          <div className={`${styles.titleBlock} ${phase === 'portrait' ? styles.hidden : styles.visible}`}>
            <div className={styles.titleAge}>
              26 <span>Years of Becoming Many</span>
            </div>
            <h1 className={styles.titleName}>{person.name}</h1>
            <div className={styles.titleRole}>
              {person.title} · {person.company}
            </div>
          </div>

          {(phase === 'tagline' || phase === 'done') && (
            <div className={styles.tagline}>
              <span className={styles.taglineText}>Satu Nama. Seribu Sosok.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
