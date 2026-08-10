// ============================================================
// WISHES DATA — Edit this file to add/change ucapan
// Do NOT modify the component files.
// ============================================================

export type MediaType = 'video' | 'audio' | 'photo' | 'text-only';
export type WishGroup = 'Direksi' | 'Tim & Karyawan' | 'Rekan & Sahabat' | 'Keluarga' | 'Anak';

export interface Wish {
  id: string;
  name: string;
  role: string;           // jabatan atau hubungan
  group: WishGroup;
  quote: string;          // ucapan utama (bisa berupa teks pembuka jika ada video)
  mediaType: MediaType;
  mediaSrc?: string;      // path ke video atau audio (opsional)
  portraitSrc?: string;   // path ke foto wajah (opsional)
  isHighlight?: boolean;  // tampil sebagai kartu sorotan utama
  isPlaceholder?: boolean;// tandai sebagai konten yang perlu diganti
}

// ============================================================
// DATA UCAPAN — Berisi aset foto & video nyata dari Pak Firdaus
// ============================================================

export const wishes: Wish[] = [
  // ── Direksi ─────────────────────────────────────────────
  {
    id: 'w-dir-01',
    name: 'Jajaran Direksi APG',
    role: 'Direksi — APG',
    group: 'Direksi',
    quote:
      'Di balik setiap keputusan besar yang kita ambil bersama, selalu ada ketenangan dan ketegasan Pak Firdaus yang mengarahkan APG menuju masa depan yang lebih baik. Selamat ulang tahun ke-26.',
    mediaType: 'photo',
    portraitSrc: '/assets/leadership/leadership-2.jpeg',
    isHighlight: true,
  },
  {
    id: 'w-dir-02',
    name: 'Rekan Direksi',
    role: 'Direktur — APG',
    group: 'Direksi',
    quote:
      'Kepemimpinan bukan soal posisi—tapi soal pengaruh dan ketulusan. Pak Firdaus membuktikan itu dalam setiap langkahnya. Selamat ulang tahun, Pak.',
    mediaType: 'photo',
    portraitSrc: '/assets/leadership/leadership-3.jpeg',
  },

  // ── Tim & Karyawan ───────────────────────────────────────
  {
    id: 'w-team-01',
    name: 'Tim APG',
    role: 'Tim & Management APG',
    group: 'Tim & Karyawan',
    quote:
      'Pak Firdaus bukan hanya pemimpin yang dihormati—beliau juga mentor yang benar-benar peduli pada perkembangan tim. Terima kasih atas setiap inspirasi, Pak.',
    mediaType: 'video',
    mediaSrc: '/assets/videos/video-1.mp4',
    portraitSrc: '/assets/leadership/leadership-4.jpeg',
    isHighlight: true,
  },
  {
    id: 'w-team-02',
    name: 'Keluarga Besar APG',
    role: 'Tim Lapangan & Staff',
    group: 'Tim & Karyawan',
    quote:
      'Melihat keteguhan dan dedikasi Pak Firdaus membuat kami terus bersemangat memberikan yang terbaik. Selamat ulang tahun ke-26!',
    mediaType: 'photo',
    portraitSrc: '/assets/leadership/leadership-5.jpeg',
  },
  {
    id: 'w-team-03',
    name: 'Seluruh Insan APG',
    role: 'Tim APG',
    group: 'Tim & Karyawan',
    quote:
      'Dari seluruh tim APG: Selamat ulang tahun ke-26, Pak Firdaus. Terima kasih telah menjadi nahkoda yang membawa kita terbang lebih tinggi.',
    mediaType: 'video',
    mediaSrc: '/assets/videos/video-2.mp4',
    portraitSrc: '/assets/leadership/leadership-6.jpeg',
    isHighlight: true,
  },

  // ── Rekan & Sahabat ──────────────────────────────────────
  {
    id: 'w-friend-01',
    name: 'Sahabat & Partner',
    role: 'Sahabat Dekat',
    group: 'Rekan & Sahabat',
    quote:
      'Seseorang yang selalu hadir dengan ketulusan dan kerendahan hati. Selamat ulang tahun ke-26 untuk sahabat terbaik.',
    mediaType: 'video',
    mediaSrc: '/assets/videos/video-3.mp4',
    portraitSrc: '/assets/family/family-4.jpeg',
  },
  {
    id: 'w-friend-02',
    name: 'Rekan Seperjuangan',
    role: 'Mitra & Rekan',
    group: 'Rekan & Sahabat',
    quote:
      'Integritas dan kejujurannya adalah karakter utama yang selalu menginspirasi orang-orang di sekelilingnya.',
    mediaType: 'photo',
    portraitSrc: '/assets/family/family-5.jpeg',
  },

  // ── Keluarga ─────────────────────────────────────────────
  {
    id: 'w-family-01',
    name: 'Keluarga Tercinta',
    role: 'Keluarga',
    group: 'Keluarga',
    quote:
      'Melihat Pak Firdaus tumbuh menjadi sosok yang bijaksana, penuh kasih, dan berdedikasi adalah kebanggaan terbesar seluruh keluarga.',
    mediaType: 'video',
    mediaSrc: '/assets/videos/video-4.mp4',
    portraitSrc: '/assets/family/family-6.jpeg',
    isHighlight: true,
  },
  {
    id: 'w-family-02',
    name: 'Momen Hangat Keluarga',
    role: 'Keluarga Besar',
    group: 'Keluarga',
    quote:
      'Semoga kebahagiaan, kesehatan, dan kemudahan senantiasa mengiringi setiap langkah Pak Firdaus.',
    mediaType: 'photo',
    portraitSrc: '/assets/family/family-7.jpeg',
  },

  // ── Anak ─────────────────────────────────────────────────
  {
    id: 'w-child-01',
    name: 'Buah Hati Tercinta',
    role: 'Putra/Putri',
    group: 'Anak',
    quote: 'Selamat ulang tahun, Ayah. Terima kasih sudah selalu menjadi rumah hangat bagi kami. We love you, Ayah! 💛',
    mediaType: 'video',
    mediaSrc: '/assets/videos/video-5.mp4',
    portraitSrc: '/assets/family/family-1.jpeg',
    isHighlight: true,
  },
];

// ── Helper: get wishes by group ──────────────────────────────
export const getWishesByGroup = (group: WishGroup): Wish[] =>
  wishes.filter((w) => w.group === group);

export const getHighlightWishes = (): Wish[] =>
  wishes.filter((w) => w.isHighlight);

export const ALL_GROUPS: WishGroup[] = [
  'Direksi',
  'Tim & Karyawan',
  'Rekan & Sahabat',
  'Keluarga',
  'Anak',
];
