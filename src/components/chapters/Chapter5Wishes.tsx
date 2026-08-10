import { useState, useRef, useEffect } from 'react';
import styles from './Chapter5Wishes.module.css';
import { type WishGroup, type Wish } from '../../config/wishes.data';
import { getBirthdayWishes, createBirthdayWish, subscribeToBirthdayWishes } from '../../services/birthday-wishes';

interface Chapter5WishesProps {
  onOverlayOpen?: () => void;
  onOverlayClose?: () => void;
}

const ITEMS_PER_PAGE = 6;

const COMPANY_OPTIONS = [
  'ARDANA PERKASA GROUP',
  'PT BUANA PERKASA RAJANEGARA',
  'PT DWI KUSUMA PERKASA',
  'PT CARAKA MULIA',
  'LAINNYA',
];

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
  'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
];

function getInitials(name: string): string {
  if (!name) return 'AP';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

export default function Chapter5Wishes({ onOverlayOpen, onOverlayClose }: Chapter5WishesProps) {
  const [wishesList, setWishesList] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCompanySelect, setFormCompanySelect] = useState('');
  const [formCustomCompany, setFormCustomCompany] = useState('');
  const [formGroupSelect, setFormGroupSelect] = useState<WishGroup>('Tim & Karyawan');
  const [formMessage, setFormMessage] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Load live data from Supabase
  const loadSupabaseWishes = async () => {
    setIsLoading(true);
    try {
      const data = await getBirthdayWishes();
      setWishesList(data);
    } catch (err) {
      console.error('Error fetching wishes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
    loadSupabaseWishes();

    const handleNewWishEvent = (e: Event) => {
      const customEvent = e as CustomEvent<Wish>;
      if (customEvent.detail) {
        const newWish = customEvent.detail;
        setWishesList((prev) => {
          const exists = prev.some(
            (w) =>
              w.id === newWish.id ||
              (w.name.trim().toLowerCase() === newWish.name.trim().toLowerCase() &&
                w.quote.trim().toLowerCase() === newWish.quote.trim().toLowerCase())
          );
          if (exists) return prev;
          return [newWish, ...prev];
        });
      }
    };

    window.addEventListener('mf_new_wish', handleNewWishEvent);
    window.addEventListener('storage', loadSupabaseWishes);

    // Subscribe to realtime Supabase changes
    const unsubscribe = subscribeToBirthdayWishes((newWish) => {
      setWishesList((prev) => {
        const exists = prev.some(
          (w) =>
            w.id === newWish.id ||
            (w.name.trim().toLowerCase() === newWish.name.trim().toLowerCase() &&
              w.quote.trim().toLowerCase() === newWish.quote.trim().toLowerCase())
        );
        if (exists) return prev;
        return [newWish, ...prev];
      });
    });

    return () => {
      window.removeEventListener('mf_new_wish', handleNewWishEvent);
      window.removeEventListener('storage', loadSupabaseWishes);
      unsubscribe();
    };
  }, []);

  const filteredWishes = wishesList;
  const visibleGreetings = filteredWishes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredWishes.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const openWish = (wish: Wish) => {
    setSelectedWish(wish);
    onOverlayOpen?.();
  };

  const closeWish = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSelectedWish(null);
    onOverlayClose?.();
  };

  // Form submission handling to Supabase
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
      const createdWish = await createBirthdayWish({
        name: formName.trim(),
        company: finalCompany,
        message: formMessage.trim(),
        group_name: formGroupSelect,
      });

      setWishesList((prev) => [createdWish, ...prev]);
      setIsModalOpen(false);

      // Reset form
      setFormName('');
      setFormCompanySelect('');
      setFormCustomCompany('');
      setFormMessage('');
      setFormErrors({});

      setToastMessage('Terima kasih! Ucapan Anda telah dikirim dan dapat dilihat oleh publik.');
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Gagal mengirim ucapan.';
      setFormErrors({ submit: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.chapter} ${mounted ? styles.mounted : ''}`}>
      <div className={styles.bg} aria-hidden="true" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast}>
          <span className={styles.toastIcon}>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className={styles.inner}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.badgePill}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>Kumpulan Doa & Harapan</span>
            </div>

            <button
              className={styles.btnSubmitWish}
              onClick={() => setIsModalOpen(true)}
            >
              <span>✨ Kirim Ucapan Saya</span>
            </button>
          </div>

          <h2 className={styles.title}>Ucapan dan Doa Terbaik</h2>
          <p className={styles.subtitle}>
            Kumpulan ucapan real-time dari keluarga besar dan publik untuk Bapak Muhammad Firdaus.
          </p>
        </div>

        {/* Wishes Grid */}
        <div className={`${styles.gridContainer} chapter-scroll`}>
          {isLoading ? (
            <div className={styles.loadingSkeletonArea}>
              {[1, 2, 3].map((idx) => (
                <div key={idx} className={styles.skeletonCard} />
              ))}
            </div>
          ) : visibleGreetings.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>💌</div>
              <h3>Belum Ada Ucapan Publik</h3>
              <p>Jadilah orang pertama yang mengirimkan ucapan dan doa terbaik untuk Pak Firdaus.</p>
              <button
                className={styles.btnSubmitWish}
                onClick={() => setIsModalOpen(true)}
              >
                ✨ Kirim Ucapan Pertama
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {visibleGreetings.map((wish, i) => {
                const initials = getInitials(wish.name);
                const avatarGrad = getGradient(wish.name);

                return (
                  <div
                    key={wish.id}
                    className={`${styles.wishCard} ${wish.isHighlight ? styles.wishHighlight : ''}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                    onClick={() => openWish(wish)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Buka ucapan dari ${wish.name}`}
                  >
                    <div className={styles.cardTopAccent} />
                    <div className={styles.quoteWatermark} aria-hidden="true">"</div>

                    <div className={styles.cardHeader}>
                      <div
                        className={styles.avatarCircle}
                        style={{ background: avatarGrad }}
                      >
                        {wish.portraitSrc ? (
                          <img
                            src={wish.portraitSrc}
                            alt={wish.name}
                            className={styles.avatarImg}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>

                      <div className={styles.senderInfo}>
                        <h3 className={styles.senderName}>{wish.name}</h3>
                        <div className={styles.companyBadge}>
                          <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                          </svg>
                          <span className={styles.companyText}>{wish.role}</span>
                        </div>
                      </div>
                    </div>

                    <p className={styles.cardMessage}>
                      "{wish.quote.slice(0, 140)}{wish.quote.length > 140 ? '…' : ''}"
                    </p>

                    <div className={styles.cardFooter}>
                      <div className={styles.footerGroupTag}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                        </svg>
                        <span>{wish.group}</span>
                      </div>

                      {wish.mediaType === 'video' && (
                        <span className={styles.mediaTag}>▶ Video</span>
                      )}
                      {wish.mediaType === 'audio' && (
                        <span className={styles.mediaTag}>♪ Audio</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className={styles.loadMoreArea}>
              <button className={styles.btnLoadMore} onClick={handleLoadMore}>
                <span>Tampilkan Lebih Banyak</span>
                <span className={styles.chevronIcon}>▾</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Greeting Form Modal */}
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
                <h3>Kirim Ucapan Ulang Tahun</h3>
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
                <label htmlFor="form-name">Nama Lengkap *</label>
                <input
                  id="form-name"
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
                <label htmlFor="form-company">Perusahaan / Jabatan *</label>
                <select
                  id="form-company"
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
                  <label htmlFor="form-custom-company">Nama Perusahaan Manual *</label>
                  <input
                    id="form-custom-company"
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
                <label htmlFor="form-group">Kelompok *</label>
                <select
                  id="form-group"
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
                <label htmlFor="form-message">Ucapan & Doa Terbaik *</label>
                <textarea
                  id="form-message"
                  rows={4}
                  placeholder="Tuliskan pesan, doa, dan harapan terbaik Anda untuk Pak Firdaus..."
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
                  {isSubmitting ? 'Mengirim...' : 'Kirim Ucapan (Publik)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Overlay */}
      {selectedWish && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={`Ucapan dari ${selectedWish.name}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeWish();
          }}
        >
          <div className={styles.overlayInner}>
            <button
              className={styles.closeBtn}
              onClick={closeWish}
              aria-label="Tutup detail"
            >
              ✕
            </button>

            <div className={styles.overlayContent}>
              <div className={styles.overlayPortrait}>
                {selectedWish.portraitSrc ? (
                  <img
                    src={selectedWish.portraitSrc}
                    alt={selectedWish.name}
                    className={styles.overlayPortraitImg}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className={styles.overlayPortraitFallback}>
                    {getInitials(selectedWish.name)}
                  </div>
                )}
              </div>

              <div className={styles.overlayName}>{selectedWish.name}</div>
              <div className={styles.overlayRole}>{selectedWish.role}</div>
              <div className={styles.overlayGroupTag}>{selectedWish.group}</div>

              {selectedWish.mediaType === 'video' && selectedWish.mediaSrc && (
                <video
                  ref={videoRef}
                  src={selectedWish.mediaSrc}
                  className={styles.overlayVideo}
                  controls
                  playsInline
                  autoPlay
                  onPlay={() => onOverlayOpen?.()}
                  onPause={() => onOverlayClose?.()}
                  onEnded={() => onOverlayClose?.()}
                />
              )}

              {selectedWish.mediaType === 'audio' && selectedWish.mediaSrc && (
                <audio
                  src={selectedWish.mediaSrc}
                  className={styles.overlayAudio}
                  controls
                  autoPlay
                  onPlay={() => onOverlayOpen?.()}
                  onPause={() => onOverlayClose?.()}
                  onEnded={() => onOverlayClose?.()}
                />
              )}

              <blockquote className={styles.overlayQuote}>
                "{selectedWish.quote}"
              </blockquote>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
