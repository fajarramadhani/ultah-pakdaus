import { useState, useEffect } from 'react';
import styles from './Chapter7Video.module.css';
import ParticleLayer from '../ui/ParticleLayer';
import { siteConfig } from '../../config/site.config';

interface Chapter7VideoProps {
  onOverlayOpen?: () => void;
  onOverlayClose?: () => void;
}

export function getGoogleDriveEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('/preview')) return url;

  // Extract Google Drive File ID
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
}

export default function Chapter7Video({ onOverlayOpen, onOverlayClose }: Chapter7VideoProps) {
  const defaultUrl = siteConfig.person.tributeVideoUrl || '';
  const [driveUrl, setDriveUrl] = useState<string>(() => {
    const saved = localStorage.getItem('mf_tribute_video_url');
    return saved || defaultUrl;
  });

  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState(driveUrl);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const embedUrl = getGoogleDriveEmbedUrl(driveUrl);
  const isEmbeddable = embedUrl.includes('drive.google.com') && !embedUrl.includes('EXAMPLE_ID');

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputUrl.trim();
    if (clean) {
      setDriveUrl(clean);
      localStorage.setItem('mf_tribute_video_url', clean);
    }
    setIsEditingModalOpen(false);
  };

  const handleOpenEdit = () => {
    setInputUrl(driveUrl);
    setIsEditingModalOpen(true);
    onOverlayOpen?.();
  };

  const handleCloseEdit = () => {
    setIsEditingModalOpen(false);
    onOverlayClose?.();
  };

  return (
    <div className={`${styles.chapter} ${mounted ? styles.mounted : ''}`}>
      <div className={styles.bg} aria-hidden="true" />
      <ParticleLayer count={20} color="champagne" intensity="subtle" />

      <div className={`${styles.container} chapter-scroll`}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.badgePill}>
            <span className={styles.filmIcon}>🎬</span>
            <span>Video Persembahan</span>
          </div>

          <h2 className={styles.title}>Video Persembahan untuk Pak Firdaus</h2>
          <p className={styles.subtitle}>
            Saksikan video persembahan istimewa dari keluarga besar dan tim APG.
          </p>
        </div>

        {/* Video Player Box */}
        <div className={styles.videoPlayerWrapper}>
          <div className={styles.videoFrame}>
            {isEmbeddable ? (
              <iframe
                src={embedUrl}
                title="Video Persembahan Google Drive"
                className={styles.iframePlayer}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className={styles.fallbackPlayer}>
                {/* Fallback Local Video Player */}
                <video
                  src="/assets/videos/video-1.mp4"
                  controls
                  playsInline
                  className={styles.localVideo}
                />
              </div>
            )}
          </div>

          {/* Action Bar Below Player */}
          <div className={styles.actionBar}>
            {driveUrl && !driveUrl.includes('EXAMPLE_ID') && (
              <a
                href={driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnDriveLink}
              >
                <span>🔗 Buka di Google Drive</span>
              </a>
            )}

            <button className={styles.btnEditLink} onClick={handleOpenEdit}>
              <span>✏️ Ubah Link Google Drive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Form to Edit Google Drive Link */}
      {isEditingModalOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Ubah Link Video Google Drive"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseEdit();
          }}
        >
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleArea}>
                <span className={styles.modalIcon}>🔗</span>
                <h3>Atur Link Video Google Drive</h3>
              </div>
              <button className={styles.modalCloseBtn} onClick={handleCloseEdit}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLink} className={styles.modalForm}>
              <div className={styles.formField}>
                <label htmlFor="drive-url-input">Link Google Drive Video *</label>
                <input
                  id="drive-url-input"
                  type="url"
                  placeholder="Paste link Google Drive (contoh: https://drive.google.com/file/d/.../view)"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  autoFocus
                />
                <span className={styles.helperText}>
                  Tips: Pastikan akses link di Google Drive diatur ke "Siapa saja yang memiliki link dapat melihat".
                </span>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={handleCloseEdit}
                >
                  Batal
                </button>
                <button type="submit" className={styles.btnSave}>
                  Simpan & Putar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
