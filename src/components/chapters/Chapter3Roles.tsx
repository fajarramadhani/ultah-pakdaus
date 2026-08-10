import { useEffect, useState } from 'react';
import styles from './Chapter3Roles.module.css';
import { siteConfig } from '../../config/site.config';

interface Role {
  word: string;
  context: string;
  color: string;
}

const roles: Role[] = [
  { word: 'Pemimpin', context: 'Bagi perusahaan, seorang pemimpin.', color: 'var(--emerald-light)' },
  { word: 'Mentor', context: 'Bagi tim, seorang mentor.', color: 'var(--champagne)' },
  { word: 'Sahabat', context: 'Bagi rekan, seorang sahabat.', color: 'var(--ivory)' },
  { word: 'Panutan', context: 'Bagi banyak orang, seorang panutan.', color: 'var(--champagne-light)' },
  { word: 'Ayah', context: 'Bagi anaknya, seluruh dunia.', color: 'var(--amber-light)' },
];

type Phase = 'cycle' | 'converge';

export default function Chapter3Roles() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [phase, setPhase] = useState<Phase>('cycle');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  useEffect(() => {
    if (phase !== 'cycle') return;
    const isLast = roleIndex === roles.length - 1;
    const timer = setTimeout(() => {
      if (!isLast) {
        setWordVisible(false);
        setTimeout(() => {
          setRoleIndex((i) => i + 1);
          setWordVisible(true);
        }, 600);
      } else {
        setWordVisible(false);
        setTimeout(() => setPhase('converge'), 800);
      }
    }, 2800);
    return () => clearTimeout(timer);
  }, [roleIndex, phase]);

  const { person } = siteConfig;

  return (
    <div className={`${styles.chapter} ${mounted ? styles.mounted : ''}`}>
      <div className={styles.bg} aria-hidden="true" />

      {phase === 'cycle' && (
        <div className={styles.cycleArea}>
          <div className={styles.contextLine} aria-live="polite">
            <p
              className={`${styles.context} ${wordVisible ? styles.contextIn : styles.contextOut}`}
            >
              {roles[roleIndex].context}
            </p>
          </div>

          <div className={styles.roleWordWrap} aria-live="polite">
            <span
              className={`${styles.roleWord} ${wordVisible ? styles.wordIn : styles.wordOut}`}
              style={{ color: roles[roleIndex].color }}
            >
              {roles[roleIndex].word}
            </span>
          </div>

          <div className={styles.roleIndicators}>
            {roles.map((r, i) => (
              <div
                key={r.word}
                className={`${styles.indicator} ${i === roleIndex ? styles.indicatorActive : ''}`}
              />
            ))}
          </div>
        </div>
      )}

      {phase === 'converge' && (
        <div className={styles.convergeArea}>
          {/* All roles orbiting the name */}
          <div className={styles.orbitRing}>
            {roles.map((r, i) => {
              const angle = (i / roles.length) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const rx = Math.cos(rad) * 42;
              const ry = Math.sin(rad) * 36;
              return (
                <span
                  key={r.word}
                  className={styles.orbitWord}
                  style={{
                    left: `calc(50% + ${rx}%)`,
                    top: `calc(50% + ${ry}%)`,
                    color: r.color,
                    animationDelay: `${i * 0.15}s`,
                  }}
                >
                  {r.word}
                </span>
              );
            })}

            <div className={styles.centerName}>
              <div className={styles.centerNameText}>{person.name}</div>
              <div className={styles.centerTagline}>Satu Nama. Banyak Makna.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
