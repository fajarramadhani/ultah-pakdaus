import { useEffect, useState, useCallback } from 'react';
import styles from './Chapter0Preshow.module.css';
import ParticleLayer from '../ui/ParticleLayer';
import { siteConfig } from '../../config/site.config';
import { createBirthdayWish } from '../../services/birthday-wishes';
import type { WishGroup } from '../../config/wishes.data';

interface Chapter0PreshowProps {
  onStart: (withMusic: boolean) => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

const ambientWords = ['PEMIMPIN', 'PANUTAN', 'SAHABAT', 'AYAH'];

const COMPANY_OPTIONS = [
  'ARDANA PERKASA GROUP',
  'PT BUANA PERKASA RAJANEGARA',
  'PT DWI KUSUMA PERKASA',
  'PT CARAKA MULIA',
  'LAINNYA',
];

export default function Chapter0Preshow({
  onStart,
  onToggleFullscreen,
  isFullscreen,
}: Chapter0PreshowProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Modal & Toast State for Sending Wish directly from Pre-show
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCompanySelect, setFormCompanySelect] = useState('');
  const [formCustomCompany, setFormCustomCompany] = useState('');
  const [formGroupSelect, setFormGroupSelect] = useState<WishGroup>('Tim & Karyawan');
  const [formMessage, setFormMessage] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Ambient word cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ambientWords.length);
        setWordVisible(true);
      }, 700);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = useCallback(() => {
    onStart(true);
  }, [onStart]);

  // Global Enter & Space key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        isModalOpen
      )
        return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStart, isModalOpen]);

  // Handle Form Submission directly on Pre-show
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formName.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi.';
    }
    if (!formCompanySelect) {
      newErrors.company = 'Perusahaan / Jabatan wajib dipilih.';
    } else if (formCompanySelect === 'LAINNYA' && !formCustomCompany.trim()) {
      newErrors.customCompany = 'Nama perusahaan manual wajib diisi.';
    }
    if (!formMessage.trim()) {
      newErrors.message = 'Ucapan dan doa terbaik wajib diisi.';
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    const finalCompany =
      formCompanySelect === 'LAINNYA' ? formCustomCompany.trim() : formCompanySelect;

    try {
      await createBirthdayWish({
        name: formName.trim(),
        company: finalCompany,
        message: formMessage.trim(),
        group_name: formGroupSelect,
      });

      setIsModalOpen(false);

      // Reset form
      setFormName('');
      setFormCompanySelect('');
      setFormCustomCompany('');
      setFormMessage('');
      setFormErrors({});

      setToastMessage('Terima kasih! Ucapan & doa Anda telah berhasil dikirim.');
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Gagal mengirim ucapan.';
      setFormErrors({ submit: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const { person } = siteConfig;

  return (
    <div className={`${styles.preshow} ${mounted ? styles.mounted : ''}`}>
      {/* Background layers */}
      <div className={styles.bgGradient} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.portraitGlow} aria-hidden="true" />

      {/* Subtle Monogram Background */}
      <div className={styles.bgMonogram} aria-hidden="true">
        <span>MF</span>
      </div>

      {/* Ambient Words Floating in Background */}
      <div className={styles.ambientWordArea} aria-hidden="true">
        <span
          className={`${styles.ambientWord} ${
            wordVisible ? styles.ambientWordIn : styles.ambientWordOut
          }`}
        >
          {ambientWords[wordIndex]}
        </span>
      </div>

      <ParticleLayer count={35} color="champagne" intensity="subtle" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast}>
          <span className={styles.toastIcon}>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP APG BADGE — Fixed Top-Left Corner */}
      <div className={styles.topLeftLogo}>
        <div className={styles.logoBadge}>
          <img
            src="/assets/apg-logo.jpg"
            alt="APG Logo"
            className={styles.apgLogoImg}
          />
        </div>
      </div>

      {/* Fullscreen Controls — Fixed Top-Right Corner */}
      <div className={styles.topRightControls}>
        {onToggleFullscreen && (
          <button
            type="button"
            className={styles.fsBtn}
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}
            title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}
          >
            {isFullscreen ? '⤢' : '⤢'}
          </button>
        )}
      </div>

      {/* Main Content Layout Container */}
      <div className={styles.container}>
        {/* Left Column — Editorial Typography & CTA */}
        <div className={styles.leftCol}>
          {/* Eyebrow Label */}
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            <span>A BIRTHDAY PORTRAIT · 10-08-2026</span>
          </div>

          {/* MAIN HEADLINE NAME — TEKS TERBESAR & PALING DOMINAN */}
          <h1 className={styles.nameHeadline}>
            <span className={styles.firstName}>MUHAMMAD</span>
            <span className={styles.lastName}>FIRDAUS</span>
          </h1>

          {/* Supporting Theme Statement */}
          <div className={styles.themeStatement}>Satu Nama. Seribu Sosok.</div>

          {/* Editorial Description */}
          <p className={styles.description}>
            Seorang pemimpin, panutan, sahabat, dan ayah—hadir dengan arti yang
            berbeda bagi setiap orang.
          </p>

          {/* CTA Buttons & Hint */}
          <div className={styles.ctaGroup}>
            <div className={styles.btnRow}>
              <button
                type="button"
                id="btn-start-experience"
                className={styles.btnPrimary}
                onClick={handleStart}
                aria-label="Saksikan Persembahan"
              >
                <span>SAKSIKAN PERSEMBAHAN</span>
                <span className={styles.arrowCircle} aria-hidden="true">
                  →
                </span>
              </button>

              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setIsModalOpen(true)}
                aria-label="Kirim Ucapan dan Doa"
              >
                <span>✍️ KIRIM UCAPAN & DOA</span>
              </button>
            </div>

            <div className={styles.enterHint}>ENTER · BUKA PERSEMBAHAN</div>
          </div>
        </div>

        {/* Right Column — Hero Portrait */}
        <div className={styles.rightCol}>
          <div className={styles.portraitWrapper}>
            <img
              src={person.heroPhoto}
              alt={`Portrait ${person.name}`}
              className={styles.portraitImg}
              style={{ objectPosition: person.heroPhotoPosition }}
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = 'none';
              }}
            />
            <div className={styles.portraitMask} aria-hidden="true" />
            <div className={styles.portraitRimLight} aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Greeting Form Modal on Pre-show */}
      {isModalOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Kirim Ucapan Ulang Tahun"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleArea}>
                <span className={styles.modalHeaderIcon}>💖</span>
                <h3>Kirim Ucapan & Doa</h3>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setIsModalOpen(false)}
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className={styles.modalForm}>
              {formErrors.submit && (
                <div className={styles.errorBanner}>{formErrors.submit}</div>
              )}

              <div className={styles.formField}>
                <label htmlFor="preshow-name">Nama Lengkap *</label>
                <input
                  id="preshow-name"
                  type="text"
                  placeholder="Masukkan nama Anda"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: '' }));
                  }}
                />
                {formErrors.name && <span className={styles.errorText}>{formErrors.name}</span>}
              </div>

              <div className={styles.formField}>
                <label htmlFor="preshow-company">Perusahaan / Jabatan *</label>
                <select
                  id="preshow-company"
                  value={formCompanySelect}
                  onChange={(e) => {
                    setFormCompanySelect(e.target.value);
                    if (formErrors.company) setFormErrors((prev) => ({ ...prev, company: '' }));
                  }}
                >
                  <option value="">-- Pilih Perusahaan / Jabatan --</option>
                  {COMPANY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {formErrors.company && (
                  <span className={styles.errorText}>{formErrors.company}</span>
                )}
              </div>

              {formCompanySelect === 'LAINNYA' && (
                <div className={styles.formField}>
                  <label htmlFor="preshow-custom-company">Nama Perusahaan Manual *</label>
                  <input
                    id="preshow-custom-company"
                    type="text"
                    placeholder="Masukkan nama perusahaan Anda"
                    value={formCustomCompany}
                    onChange={(e) => {
                      setFormCustomCompany(e.target.value);
                      if (formErrors.customCompany)
                        setFormErrors((prev) => ({ ...prev, customCompany: '' }));
                    }}
                  />
                  {formErrors.customCompany && (
                    <span className={styles.errorText}>{formErrors.customCompany}</span>
                  )}
                </div>
              )}

              <div className={styles.formField}>
                <label htmlFor="preshow-group">Kelompok *</label>
                <select
                  id="preshow-group"
                  value={formGroupSelect}
                  onChange={(e) => setFormGroupSelect(e.target.value as WishGroup)}
                >
                  <option value="Direksi">Direksi</option>
                  <option value="Tim & Karyawan">Tim & Karyawan</option>
                  <option value="Rekan & Sahabat">Rekan & Sahabat</option>
                  <option value="Keluarga">Keluarga</option>
                </select>
              </div>

              <div className={styles.formField}>
                <label htmlFor="preshow-message">Ucapan & Doa Terbaik *</label>
                <textarea
                  id="preshow-message"
                  rows={4}
                  placeholder="Tuliskan ucapan dan doa terbaik Anda untuk Pak Firdaus..."
                  value={formMessage}
                  onChange={(e) => {
                    setFormMessage(e.target.value);
                    if (formErrors.message)
                      setFormErrors((prev) => ({ ...prev, message: '' }));
                  }}
                />
                {formErrors.message && (
                  <span className={styles.errorText}>{formErrors.message}</span>
                )}
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={styles.btnSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
