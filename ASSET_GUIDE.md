# Panduan Pengelolaan Aset & Konten
## Website Ulang Tahun Muhammad Firdaus (Direktur Utama APG)

Website ini dirancang secara *data-driven*, sehingga Anda dapat mengganti foto, video, audio, ucapan, dan durasi presentasi **tanpa perlu mengubah kode komponen**.

---

## 📁 Struktur Folder Aset (`public/assets/`)

```text
public/assets/
├── firdaus/
│   └── hero.webp          # Foto portrait utama Pak Firdaus
├── family/
│   ├── family-01.webp     # Foto Pak Firdaus menggandeng/bersama anak
│   ├── family-02.webp     # Momen kebersamaan keluarga
│   └── family-03.webp     # Foto bermain bersama
├── leadership/
│   └── leadership.webp    # Foto Pak Firdaus saat rapat/memimpin
├── wishes/
│   ├── video-01.mp4       # Video ucapan dari smartphone/kamera
│   ├── audio-child.mp3    # Rekaman suara anak (jika ada)
│   └── portrait-*.webp    # Foto pemberi ucapan
├── audio/
│   └── background.mp3     # Musik latar instrumental sinematik
└── videos/
    └── chapter-bg.mp4     # Video latar (opsional)
```

---

## 📷 1. Mengganti Foto Utama Pak Firdaus

1. Simpan foto berformat `.webp`, `.jpg`, atau `.png` ke folder `public/assets/firdaus/hero.webp`.
2. Jika posisi wajah kurang pas di layar desktop atau mobile, buka file `src/config/site.config.ts` dan atur:

```ts
heroPhoto: '/assets/firdaus/hero.webp',
heroPhotoPosition: '50% 20%',       // Desktop (posisi x% y%)
heroPhotoPositionMobile: '50% 15%', // Mobile
```

---

## 👨‍👧 2. Menambahkan Foto Bersama Anak / Keluarga

1. Simpan foto ke `public/assets/family/family-01.webp`, `family-02.webp`, dst.
2. Komponen `Chapter4Father.tsx` akan otomatis menampilkan foto tersebut.
3. Jika foto belum diunggah, website akan menampilkan **placeholder premium** yang rapi dengan label *"Tambahkan foto bersama anak"*.

---

## 💬 3. Menambah & Mengubah Ucapan

Semua ucapan dikelola dari file: **`src/config/wishes.data.ts`**

Format data:

```ts
{
  id: 'w-01',
  name: 'Nama Pemberi Ucapan',
  role: 'Jabatan / Hubungan',
  group: 'Direksi', // Opsi: 'Direksi' | 'Tim & Karyawan' | 'Rekan & Sahabat' | 'Keluarga' | 'Anak'
  quote: 'Ucapan tulus...',
  mediaType: 'video', // Opsi: 'video' | 'audio' | 'photo' | 'text-only'
  mediaSrc: '/assets/wishes/video-01.mp4',
  portraitSrc: '/assets/wishes/portrait-01.webp',
  isHighlight: true, // Tampilkan di kartu sorotan
  isPlaceholder: false, // Set false jika sudah diganti dengan ucapan asli
}
```

---

## 🎵 4. Mengganti Musik Latar

1. Simpan file MP3/WAV ke `public/assets/audio/background.mp3`.
2. Pengaturan musik ada di `src/config/site.config.ts`:

```ts
audio: {
  enabled: true,
  src: '/assets/audio/background.mp3',
  volume: 0.35,      // Volume default (0.0 - 1.0)
  fadeInMs: 2000,    // Durasi fade-in saat mulai
  fadeOutMs: 1500,   // Durasi fade-out saat jeda
  duckingVolume: 0.08, // Volume musik diturunkan otomatis saat video diputar
}
```

---

## ⏱️ 5. Mengatur Durasi Autoplay Presentasi

Semua durasi per chapter dapat diatur di `src/config/site.config.ts`:

```ts
chapters: {
  ch0_preshow: 0,           // Ambient (manual klik mulai)
  ch1_opening: 45 * 1000,   // 45 detik
  ch2_respected: 40 * 1000, // 40 detik
  ch3_roles: 45 * 1000,     // 45 detik
  ch4_father: 50 * 1000,    // 50 detik
  ch5_wishes: 90 * 1000,    // 90 detik
  ch6_climax: 40 * 1000,    // 40 detik
  ch7_closing: 50 * 1000,   // 50 detik
}
```

---

## ⌨️ 6. Kontrol Navigasi & Presentasi

| Tombol / Aksi | Fungsi |
|---|---|
| **Spasi** / Klik Play | Play / Pause Autoplay |
| **Panah Kanan / PageDown / Swipe Kiri** | Advance Chapter Berikutnya |
| **Panah Kiri / PageUp / Swipe Kanan** | Advance Chapter Sebelumnya |
| **F** | Toggle Fullscreen (Layar Penuh) |
| **M** | Toggle Mute Audio |
| **Escape** | Tutup Overlay Video / Ucapan |

*Kontrol UI akan disembunyikan otomatis setelah 3 detik tanpa pergerakan mouse.*

---

## 🌐 7. Menjalankan Offline di Lokasi Acara

Website ini **100% self-contained** (seluruh aset dan font diload secara lokal / cached).

1. Jalankan `npm run build`
2. Jalankan `npm run preview` atau buka folder `dist/` menggunakan lokal web server (seperti Live Server / Serve).
