import { useState, useEffect } from 'react';
import styles from './PublicWishesPage.module.css';
import { ALL_GROUPS, type WishGroup, type Wish } from '../config/wishes.data';
import { getBirthdayWishes, createBirthdayWish, subscribeToBirthdayWishes } from '../services/birthday-wishes';

const ITEMS_PER_PAGE = 9;

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

export default function PublicWishesPage() {
  const [wishesList, setWishesList] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeGroup, setActiveGroup] = useState<WishGroup | 'Semua'>('Semua');
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCompanySelect, setFormCompanySelect] = useState('');
  const [formCustomCompany, setFormCustomCompany] = useState('');
  const [formGroupSelect, setFormGroupSelect] = useState<WishGroup>('Tim & Karyawan');
  const [formMessage, setFormMessage] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial Supabase wishes
  const loadWishes = async () => {
    setIsLoading(true);
    try {
      const data = await getBirthdayWishes();
      setWishesList(data);
    } catch (err) {
      console.error('Error loading public wishes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWishes();

    // Subscribe to realtime Supabase changes
    const unsubscribe = subscribeToBirthdayWishes((newWish) => {
      setWishesList((prev) => {
        if (prev.some((w) => w.id === newWish.id)) return prev;
        return [newWish, ...prev];
      });
    });

    return () => unsubscribe();
  }, []);

  const filteredWishes =
    activeGroup === 'Semua'
      ? wishesList
      : wishesList.filter((w) => w.group === activeGroup);

  const visibleGreetings = filteredWishes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredWishes.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

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
      const created = await createBirthdayWish({
        name: formName.trim(),
        company: finalCompany,
        message: formMessage.trim(),
        group_name: formGroupSelect,
      });

      setWishesList((prev) => [created, ...prev]);
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
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden="true" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast}>
          <span className={styles.toastIcon}>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <header className={styles.topHeader}>
        <div className={styles.topHeaderContainer}>
          <div className={styles.logoGroup}>
            <div className={styles.logoBadge}>
              <img src="/assets/apg-logo.jpg" alt="Logo APG" className={styles.apgLogo} />
            </div>
            <div className={styles.headerTitleArea}>
              <h1 className={styles.siteTitle}>Muhammad Firdaus</h1>
              <span className={styles.siteSubtitle}>Halaman Ucapan & Doa Publik · 10-08-2026</span>
            </div>
          </div>

          <div className={styles.topActions}>
            <a href="/" className={styles.btnBackMain}>
              <span>← Presentasi Utama</span>
            </a>
            <button
              className={styles.btnSubmitWish}
              onClick={() => setIsModalOpen(true)}
            >
              <span>✨ Kirim Ucapan</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={styles.mainContainer}>
        {/* Banner Section */}
        <div className={styles.bannerSection}>
          <div className={styles.badgePill}>
            <span>💌 Halaman Ucapan Publik</span>
          </div>
          <h2 className={styles.bannerTitle}>Kumpulan Ucapan & Doa Terbaik</h2>
          <p className={styles.bannerSubtitle}>
            Kirimkan ucapan, doa, dan harapan terbaik Anda untuk Bapak Muhammad Firdaus di hari ulang tahun ke-26.
          </p>

          <div className={styles.bannerCtaRow}>
            <button
              className={styles.btnBannerSubmit}
              onClick={() => setIsModalOpen(true)}
            >
              <span>✨ Kirim Ucapan Saya</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filtersArea}>
          <button
            className={`${styles.filterBtn} ${activeGroup === 'Semua' ? styles.filterActive : ''}`}
            onClick={() => {
              setActiveGroup('Semua');
              setVisibleCount(ITEMS_PER_PAGE);
            }}
          >
            Semua ({wishesList.length})
          </button>
          {ALL_GROUPS.map((g) => {
            const count = wishesList.filter((w) => w.group === g).length;
            return (
              <button
                key={g}
                className={`${styles.filterBtn} ${activeGroup === g ? styles.filterActive : ''}`}
                onClick={() => {
                  setActiveGroup(g);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
              >
                {g} {count > 0 ? `(${count})` : ''}
              </button>
            );
          })}
        </div>

        {/* Wishes Grid */}
        {isLoading ? (
          <div className={styles.loadingArea}>
            <p>Memuat ucapan publik dari database...</p>
          </div>
        ) : visibleGreetings.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💌</div>
            <h3>Belum Ada Ucapan Publik</h3>
            <p>Jadilah orang pertama yang memberikan ucapan dan doa terbaik untuk Pak Firdaus.</p>
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
                  className={styles.wishCard}
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => setSelectedWish(wish)}
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
                        <span>{wish.role}</span>
                      </div>
                    </div>
                  </div>

                  <p className={styles.cardMessage}>
                    "{wish.quote}"
                  </p>

                  <div className={styles.cardFooter}>
                    <span>{wish.group}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className={styles.loadMoreArea}>
            <button className={styles.btnLoadMore} onClick={handleLoadMore}>
              Tampilkan Lebih Banyak ▾
            </button>
          </div>
        )}
      </main>

      {/* Modal Form */}
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
              <h3>Kirim Ucapan & Doa Publik</h3>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className={styles.modalForm}>
              {formErrors.submit && (
                <div className={styles.errorBanner}>{formErrors.submit}</div>
              )}

              <div className={styles.formField}>
                <label htmlFor="public-name">Nama Lengkap *</label>
                <input
                  id="public-name"
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
                {formErrors.name && <span className={styles.errorText}>{formErrors.name}</span>}
              </div>

              <div className={styles.formField}>
                <label htmlFor="public-company">Perusahaan / Jabatan *</label>
                <select
                  id="public-company"
                  value={formCompanySelect}
                  onChange={(e) => setFormCompanySelect(e.target.value)}
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
                  <label htmlFor="public-custom-company">Nama Perusahaan Manual *</label>
                  <input
                    id="public-custom-company"
                    type="text"
                    placeholder="Masukkan nama perusahaan Anda"
                    value={formCustomCompany}
                    onChange={(e) => setFormCustomCompany(e.target.value)}
                  />
                  {formErrors.customCompany && (
                    <span className={styles.errorText}>{formErrors.customCompany}</span>
                  )}
                </div>
              )}

              <div className={styles.formField}>
                <label htmlFor="public-group">Kelompok *</label>
                <select
                  id="public-group"
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
                <label htmlFor="public-message">Ucapan & Doa Terbaik *</label>
                <textarea
                  id="public-message"
                  rows={4}
                  placeholder="Tuliskan ucapan dan doa terbaik Anda untuk Pak Firdaus..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
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

      {/* Overlay Modal */}
      {selectedWish && (
        <div
          className={styles.overlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedWish(null);
          }}
        >
          <div className={styles.overlayInner}>
            <button
              className={styles.closeBtn}
              onClick={() => setSelectedWish(null)}
            >
              ✕
            </button>
            <div className={styles.overlayContent}>
              <h3 className={styles.overlayName}>{selectedWish.name}</h3>
              <p className={styles.overlayRole}>{selectedWish.role}</p>
              <blockquote className={styles.overlayQuote}>"{selectedWish.quote}"</blockquote>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
