import { useEffect, useState } from 'react';
import styles from './ParticleLayer.module.css';

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface ParticleLayerProps {
  count?: number;
  color?: 'champagne' | 'amber';
  intensity?: 'subtle' | 'medium';
}

export default function ParticleLayer({
  count = 20,
  color = 'champagne',
  intensity = 'subtle',
}: ParticleLayerProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const ps: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 15,
      opacity: Math.random() * 0.6 + 0.2,
    }));
    setParticles(ps);
  }, [count]);

  const colorMap = {
    champagne: 'rgba(201, 169, 110, VAR)',
    amber: 'rgba(212, 129, 58, VAR)',
  };

  return (
    <div className={styles.layer} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: colorMap[color].replace('VAR', `${p.opacity * (intensity === 'subtle' ? 0.5 : 1)}`),
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--px': `${(Math.random() - 0.5) * 60}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
