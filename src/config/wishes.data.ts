// ============================================================
// WISHES DATA SCHEMA — Config & Types
// ============================================================

export type MediaType = 'video' | 'audio' | 'photo' | 'text-only';
export type WishGroup = 'Direksi' | 'Tim & Karyawan' | 'Rekan & Sahabat' | 'Keluarga' | 'Anak';

export interface Wish {
  id: string;
  name: string;
  role: string;           // jabatan atau perusahaan
  group: WishGroup;
  quote: string;          // ucapan & doa
  mediaType: MediaType;
  mediaSrc?: string;      // path ke video atau audio (opsional)
  portraitSrc?: string;   // path ke foto (opsional)
  isHighlight?: boolean;  // tampil sebagai kartu sorotan utama
  isPlaceholder?: boolean;
}

export const ALL_GROUPS: WishGroup[] = [
  'Direksi',
  'Tim & Karyawan',
  'Rekan & Sahabat',
  'Keluarga',
  'Anak',
];

// Data ucapan awal (dimuat secara dinamis dari database Supabase)
export const wishes: Wish[] = [];
