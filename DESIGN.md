# BathariSri — Design System
**Versi:** 1.0  
**Berlaku untuk:** Semua halaman area petani (`/petani/*`)  
**Stack:** Laravel 13 + Inertia.js + Vue 3 + Tailwind CSS v4  

---

## Filosofi Desain

BathariSri bukan aplikasi pemerintah dan bukan template generik. Tone visualnya adalah **"agritech startup yang serius"** — seperti Linear atau Vercel kalau mereka membuat aplikasi pertanian. Bersih, presisi, dan percaya diri. Tidak dekoratif, tidak mencolok, tidak terlihat seperti hasil generate AI.

**Tiga prinsip utama:**
1. **Hierarchy dulu, estetika kemudian.** Setiap halaman harus bisa dibaca dalam 3 detik — apa yang penting, apa yang sekunder, apa yang tersier.
2. **Putih adalah fitur.** Whitespace bukan ruang kosong — ini yang memisahkan desain profesional dari template murahan.
3. **Warna bekerja, bukan mendekorasi.** Hijau hanya untuk status positif/sukses. Abu untuk netral. Tidak ada gradient, tidak ada hero card gelap.

---

## 1. Tipografi

### Font Family

```css
/* Heading — Plus Jakarta Sans */
/* Karakter: geometris, modern, personality tanpa terasa playful berlebihan */
/* Bukan Inter (terlalu generik) dan bukan Poppins (terlalu bulat/AI) */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

/* Body — Inter */
/* Karakter: sangat legible di ukuran kecil, standard industri untuk UI */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');
```

**Di `tailwind.config.js`:**
```js
fontFamily: {
  heading: ['"Plus Jakarta Sans"', 'sans-serif'],
  body:    ['Inter', 'sans-serif'],
},
```

**Di `app.css`:**
```css
body {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: #111827;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Plus Jakarta Sans', sans-serif;
}
```

### Skala Tipografi

| Token         | Tag    | Size  | Weight | Line Height | Penggunaan                          |
|---------------|--------|-------|--------|-------------|-------------------------------------|
| `text-page`   | h1     | 22px  | 600    | 1.3         | Judul halaman ("Rekomendasi Pupuk") |
| `text-section`| h2     | 17px  | 600    | 1.4         | Judul section dalam halaman         |
| `text-card`   | h3     | 15px  | 500    | 1.4         | Judul kartu/komponen                |
| `text-label`  | span   | 11px  | 500    | 1.0         | Label form, caption, badge          |
| `text-body`   | p      | 15px  | 400    | 1.6         | Body text utama                     |
| `text-small`  | p/span | 13px  | 400    | 1.5         | Teks sekunder, deskripsi, helper    |
| `text-micro`  | span   | 11px  | 400    | 1.4         | Timestamp, metadata                 |

**Aturan ketat:**
- `font-weight: 700` — **tidak digunakan sama sekali**. Terlalu berat, terlalu AI.
- `font-weight: 600` — hanya untuk heading halaman dan section title.
- `font-weight: 500` — untuk label, judul kartu, nilai penting.
- `font-weight: 400` — semua body text, deskripsi.
- Tidak ada ALL CAPS kecuali untuk label metadata 11px dengan `letter-spacing: 0.06em`.

---

## 2. Palet Warna

### Filosofi Warna
Berbasis **satu warna primer** (hijau slate-toned, bukan hijau neon), dengan skala abu-abu yang kaya sebagai tulang punggung. Warna semantik hanya muncul saat ada informasi yang perlu disampaikan — bukan sebagai dekorasi.

### Warna Primer — Forest Green

```css
/* Bukan hijau emerald yang terlalu cerah, bukan hijau tua yang terlalu gelap */
/* Referensi: hijau kebun teh, agritech serius */
--color-primary-50:  #f0fdf4;   /* bg hover ringan */
--color-primary-100: #dcfce7;   /* bg badge sukses */
--color-primary-200: #bbf7d0;   /* border aktif */
--color-primary-500: #22c55e;   /* TIDAK DIGUNAKAN — terlalu neon */
--color-primary-600: #16a34a;   /* warna teks aktif di sidebar */
--color-primary-700: #15803d;   /* button primary hover */
--color-primary-800: #166534;   /* button primary default */
--color-primary-900: #14532d;   /* teks dark */
```

**Tailwind v4 di `app.css`:**
```css
@theme {
  --color-brand:        #166534;
  --color-brand-light:  #dcfce7;
  --color-brand-hover:  #15803d;
  --color-brand-muted:  #16a34a;
}
```

### Warna Netral — Zinc (bukan Gray biasa)

```
zinc-50:  #fafafa   /* background halaman utama */
zinc-100: #f4f4f5   /* background sidebar, card surface */
zinc-200: #e4e4e7   /* border default, divider */
zinc-300: #d4d4d8   /* border form, border input */
zinc-400: #a1a1aa   /* placeholder text, icon inaktif */
zinc-500: #71717a   /* teks sekunder */
zinc-600: #52525b   /* teks tersier */
zinc-700: #3f3f46   /* teks body */
zinc-800: #27272a   /* teks heading */
zinc-900: #18181b   /* teks paling gelap */
```

### Warna Semantik

```
Sukses/Positif:  #166534 bg + #dcfce7 surface  (green-800 + green-100)
Peringatan:      #92400e bg + #fef3c7 surface  (amber-800 + amber-100)
Bahaya/Error:    #991b1b bg + #fee2e2 surface  (red-800 + red-100)
Info/Netral:     #1e40af bg + #dbeafe surface  (blue-800 + blue-100)
```

**Aturan ketat:**
- Background halaman: **selalu `zinc-50` (`#fafafa`)** — bukan putih murni, bukan abu tua.
- Card: **selalu putih (`#ffffff`)** dengan border `zinc-200` — bukan surface berwarna.
- Tidak ada dark card, tidak ada gradient, tidak ada hero section berwarna gelap.
- Warna primer (`--color-brand`) hanya muncul di: active state sidebar, button primary, badge aktif, garis aksen kiri card penting.

---

## 3. Icon System

### Library: Phosphor Icons (React/Vue)

**Mengapa Phosphor, bukan Heroicons/Lucide/Tabler:**
- Heroicons dan Lucide terlalu identik dengan template Tailwind UI — juri langsung tahu.
- Phosphor memiliki 5 weight variant (Thin, Light, Regular, Bold, Fill) — bisa menyesuaikan konteks lebih presisi.
- Tidak ada kesan "generated" atau "template".
- 1.200+ icon, semua konsisten secara visual.

**Instalasi:**
```bash
npm install @phosphor-icons/vue
```

**Penggunaan:**
```vue
<script setup>
import { PhLeaf, PhDropHalf, PhChartBar, PhWarning } from '@phosphor-icons/vue'
</script>

<template>
  <!-- Sidebar nav: weight "regular", size 18px -->
  <PhLeaf :size="18" weight="regular" />

  <!-- Judul section/card: weight "duotone", size 20px -->
  <PhLeaf :size="20" weight="duotone" />

  <!-- Status/badge inline: weight "fill", size 14px -->
  <PhWarning :size="14" weight="fill" />
</template>
```

### Mapping Icon Per Halaman

| Halaman              | Icon Utama                    | Weight     |
|----------------------|-------------------------------|------------|
| Dashboard            | `PhSquaresFour`               | regular    |
| Lahan Saya           | `PhMapPin`                    | regular    |
| Jadwal Tanam         | `PhCalendarDots`              | regular    |
| Deteksi Penyakit     | `PhMicroscope`                | regular    |
| Rekomendasi Pupuk    | `PhPlant`                     | regular    |
| Prediksi Panen       | `PhChartLineUp`               | regular    |
| Kelola Limbah        | `PhRecycle`                   | regular    |
| Artikel              | `PhNewspaper`                 | regular    |
| Pengaturan           | `PhGear`                      | regular    |
| Keluar               | `PhSignOut`                   | regular    |
| Alert/Peringatan     | `PhWarningCircle`             | fill       |
| Sukses/Centang       | `PhCheckCircle`               | fill       |
| Upload foto          | `PhUploadSimple`              | regular    |
| CO₂/Lingkungan       | `PhLeaf`                      | duotone    |
| Penyakit parah       | `PhBug`                       | fill       |
| Sehat                | `PhSmiley`                    | regular    |
| Nilai ekonomi        | `PhCurrencyDollar`            | regular    |

**Aturan ketat:**
- Sidebar nav: selalu `weight="regular"`, `size={18}` — tidak lebih besar.
- Jangan campur weight dalam satu halaman kecuali ada alasan semantik.
- Icon di dalam teks inline: `size={14}`, `style="vertical-align: -2px"`.
- Tidak ada icon dekoratif tanpa fungsi semantik.

---

## 4. Layout & Spacing

### Struktur Halaman

```
┌─────────────────────────────────────────────────────────┐
│  Sidebar (240px fixed)  │  Content Area (flex-1)        │
│                         │                               │
│  Logo (56px height)     │  Page Header (56px)           │
│  ─────────────────      │  ─────────────────────────    │
│  Nav Items              │  Page Content                 │
│                         │   max-width: 860px            │
│                         │   padding: 0 32px 48px        │
│  ─────────────────      │                               │
│  User Profile           │                               │
└─────────────────────────────────────────────────────────┘
```

### Content Width

```css
/* Semua halaman petani: content tidak boleh terlalu lebar */
.page-content {
  max-width: 860px;    /* bukan full-width — ini penting */
  padding: 0 32px 48px;
  margin: 0 auto;      /* centered jika viewport lebar */
}

/* Untuk halaman form (Rekomendasi Pupuk, dll): lebih sempit */
.form-content {
  max-width: 640px;
}
```

### Spacing Scale (Tailwind units)

```
4px  (space-1)  — gap antar item inline, padding badge
8px  (space-2)  — padding internal komponen kecil
12px (space-3)  — gap antar elemen dalam card
16px (space-4)  — padding card, section internal
20px (space-5)  — gap antar kartu dalam grid
24px (space-6)  — margin antar section
32px (space-8)  — padding page horizontal
48px (space-12) — margin bawah halaman
```

**Aturan:**
- Jangan gunakan padding/margin ganjil (7px, 11px, 15px) kecuali untuk optical alignment.
- Antar section dalam halaman: selalu `mb-6` (24px).
- Card internal padding: selalu `p-4` (16px) atau `p-5` (20px) — tidak lebih kecil.

---

## 5. Komponen — Sidebar

```vue
<!-- Sidebar.vue -->
<!-- Width: 240px, bg: white, border-right: 1px zinc-200 -->
<!-- TIDAK ada shadow, TIDAK ada background berwarna -->
```

**Struktur visual:**
```
┌─────────────────────────┐
│  [Logo] BathariSri      │  ← 56px height, border-bottom zinc-100
│                         │
│  ● Dashboard            │  ← Active: bg-primary-50, text-primary-800,
│    Lahan Saya           │     border-left 2px solid brand
│    Jadwal Tanam         │  ← Inactive: text-zinc-600, hover: bg-zinc-50
│    Deteksi Penyakit     │
│    Rekomendasi Pupuk    │
│    Prediksi Panen       │
│    Kelola Limbah        │
│    Artikel              │
│                         │
│  ─────────────────────  │  ← divider zinc-200
│    Pengaturan           │
│    Keluar               │
│                         │
│  ─────────────────────  │
│  [B] Budi Santoso       │  ← Avatar inisial, bukan foto
│      Petani             │
└─────────────────────────┘
```

**CSS Nav Item:**
```css
/* Base */
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 400;
  color: #52525b;           /* zinc-600 */
  border-radius: 6px;
  margin: 1px 8px;
  transition: background 0.1s, color 0.1s;
}

/* Hover */
.nav-item:hover {
  background: #f4f4f5;      /* zinc-100 */
  color: #27272a;           /* zinc-800 */
}

/* Active */
.nav-item.active {
  background: #f0fdf4;      /* green-50 */
  color: #166534;           /* green-800 */
  font-weight: 500;
}
```

---

## 6. Komponen — Page Header

Setiap halaman memiliki header konsisten di atas content area.

```vue
<!-- Struktur -->
<div class="page-header">
  <!-- Baris 1: breadcrumb (opsional) -->
  <p class="breadcrumb">Dashboard / Rekomendasi Pupuk</p>

  <!-- Baris 2: judul + deskripsi singkat -->
  <h1 class="page-title">Rekomendasi Pupuk</h1>
  <p class="page-desc">
    Sistem Fuzzy Logic untuk menghitung dosis pupuk sesuai kondisi lahan Anda.
  </p>
</div>
```

**CSS:**
```css
.page-header {
  padding: 28px 0 24px;
  border-bottom: 1px solid #e4e4e7;  /* zinc-200 */
  margin-bottom: 28px;
}

.breadcrumb {
  font-size: 12px;
  color: #a1a1aa;     /* zinc-400 */
  margin-bottom: 4px;
  font-family: 'Inter', sans-serif;
}

.page-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #18181b;     /* zinc-900 */
  margin-bottom: 4px;
}

.page-desc {
  font-size: 14px;
  color: #71717a;     /* zinc-500 */
  max-width: 560px;
}
```

---

## 7. Komponen — Card

**Card default (untuk semua section konten):**
```css
.card {
  background: #ffffff;
  border: 1px solid #e4e4e7;    /* zinc-200 — bukan shadow */
  border-radius: 10px;
  padding: 20px;
}
```

**Card dengan aksen kiri (untuk hasil/rekomendasi penting):**
```css
.card-accent {
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-left: 3px solid #166534;   /* brand color */
  border-radius: 0 10px 10px 0;
  padding: 20px;
}
```

**Aturan:**
- Tidak ada `box-shadow` pada card default — border sudah cukup.
- Shadow hanya untuk dropdown/popover yang perlu float di atas konten.
- Tidak ada card dengan background berwarna (hijau, biru, dll) kecuali untuk
  status card yang sangat spesifik (badge area CO₂ di Modul 5).
- `border-radius: 10px` — konsisten di semua card, tidak ada yang 16px atau 24px.

---

## 8. Komponen — Metric Card (Stat)

Untuk menampilkan angka/statistik penting.

```vue
<div class="metric-card">
  <p class="metric-label">Total Lahan</p>
  <div class="metric-value">
    <span class="metric-number">2</span>
    <span class="metric-unit">petak</span>
  </div>
</div>
```

```css
.metric-card {
  background: #fafafa;         /* zinc-50 */
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  padding: 16px;
}

.metric-label {
  font-size: 12px;
  font-weight: 500;
  color: #71717a;              /* zinc-500 */
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.metric-number {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #18181b;              /* zinc-900 */
  line-height: 1;
}

.metric-unit {
  font-size: 14px;
  font-weight: 400;
  color: #71717a;
  margin-left: 4px;
}
```

---

## 9. Komponen — Badge / Status Pill

```css
/* Base */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 99px;
  line-height: 1.4;
}

/* Variant: success */
.badge-success {
  background: #dcfce7;   /* green-100 */
  color: #166534;        /* green-800 */
}

/* Variant: warning */
.badge-warning {
  background: #fef3c7;   /* amber-100 */
  color: #92400e;        /* amber-800 */
}

/* Variant: danger */
.badge-danger {
  background: #fee2e2;   /* red-100 */
  color: #991b1b;        /* red-800 */
}

/* Variant: neutral */
.badge-neutral {
  background: #f4f4f5;   /* zinc-100 */
  color: #3f3f46;        /* zinc-700 */
}

/* Variant: info */
.badge-info {
  background: #dbeafe;   /* blue-100 */
  color: #1e40af;        /* blue-800 */
}
```

**Aturan:**
- Badge teks maksimal 3 kata. Lebih dari itu, gunakan label biasa.
- Jangan campur lebih dari 2 variant badge dalam satu halaman.
- Dot status (bulatan kecil di depan badge): `width: 6px; height: 6px; border-radius: 50%`.

---

## 10. Komponen — Button

```css
/* Primary */
.btn-primary {
  background: #166534;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  padding: 9px 18px;
  border-radius: 7px;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-primary:hover   { background: #15803d; }
.btn-primary:active  { background: #14532d; transform: translateY(1px); }
.btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

/* Secondary (outline) */
.btn-secondary {
  background: transparent;
  color: #27272a;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 17px;
  border-radius: 7px;
  border: 1px solid #d4d4d8;    /* zinc-300 */
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.btn-secondary:hover { background: #f4f4f5; border-color: #a1a1aa; }

/* Ghost (untuk aksi sekunder di dalam card) */
.btn-ghost {
  background: transparent;
  color: #52525b;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.btn-ghost:hover { background: #f4f4f5; color: #18181b; }

/* Danger */
.btn-danger {
  background: #fee2e2;
  color: #991b1b;
  font-size: 14px;
  font-weight: 500;
  padding: 9px 18px;
  border-radius: 7px;
  border: 1px solid #fca5a5;
  cursor: pointer;
}
.btn-danger:hover { background: #fecaca; }
```

**Aturan:**
- Satu halaman: maksimal 1 `btn-primary` yang visible pada satu waktu.
- Loading state: ganti teks dengan teks + spinner SVG kecil 14px, disable button.
- Tidak ada button dengan `border-radius: 99px` (terlalu pill-like, kesan AI).
- Tidak ada icon di kiri button untuk action utama — teks saja lebih bersih.

---

## 11. Komponen — Form

```css
/* Input text */
.input {
  width: 100%;
  height: 38px;
  padding: 0 12px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  color: #18181b;
  background: #ffffff;
  border: 1px solid #d4d4d8;    /* zinc-300 */
  border-radius: 7px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.input::placeholder { color: #a1a1aa; }
.input:hover  { border-color: #a1a1aa; }
.input:focus  {
  border-color: #166534;
  box-shadow: 0 0 0 3px rgba(22, 101, 52, 0.1);
}
.input.error {
  border-color: #f87171;
  box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
}

/* Label */
.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #3f3f46;    /* zinc-700 */
  margin-bottom: 5px;
}

/* Helper text */
.form-helper {
  font-size: 12px;
  color: #71717a;    /* zinc-500 */
  margin-top: 4px;
}

/* Error text */
.form-error {
  font-size: 12px;
  color: #dc2626;
  margin-top: 4px;
}

/* Select — same as input + custom arrow */
.select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%23a1a1aa' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

/* Form group spacing */
.form-group {
  margin-bottom: 20px;
}

/* Required asterisk */
.required::after {
  content: ' *';
  color: #dc2626;
}
```

---

## 12. Komponen — Upload Foto (Deteksi Penyakit)

```css
.upload-area {
  border: 1.5px dashed #d4d4d8;  /* zinc-300 */
  border-radius: 10px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  background: #fafafa;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #16a34a;
  background: #f0fdf4;
}

.upload-area .upload-icon {
  color: #a1a1aa;
  margin-bottom: 12px;
}

.upload-area .upload-text {
  font-size: 14px;
  color: #52525b;
}

.upload-area .upload-hint {
  font-size: 12px;
  color: #a1a1aa;
  margin-top: 4px;
}
```

---

## 13. Komponen — Dashboard Greeting (Pengganti Hero Card Gelap)

**Ini yang paling beda dari versi sebelumnya.**  
Tidak ada card gelap dengan gradient. Cukup teks greeting bersih + stat row.

```vue
<!-- DashboardGreeting.vue -->
<div class="greeting-section">
  <div class="greeting-text">
    <p class="greeting-date">Kamis, 11 Juni 2026</p>
    <h1 class="greeting-name">Selamat pagi, <span>Budi Santoso</span></h1>
    <p class="greeting-sub">
      Berikut ringkasan kondisi lahan Anda hari ini.
    </p>
  </div>
  <div class="greeting-stats">
    <!-- 3 metric card kecil di sebelah kanan, atau di bawah pada mobile -->
  </div>
</div>
```

```css
.greeting-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 28px;
  border-bottom: 1px solid #e4e4e7;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.greeting-date {
  font-size: 12px;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}

.greeting-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #18181b;
  margin-bottom: 4px;
}

.greeting-name span {
  color: #166534;    /* hanya nama yang berwarna brand */
}

.greeting-sub {
  font-size: 14px;
  color: #71717a;
}
```

---

## 14. Komponen — Progress / Timeline Jadwal Tanam

```css
.timeline-bar {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 16px 0;
}

.timeline-segment {
  flex: 1;
  height: 6px;
  background: #e4e4e7;    /* zinc-200 */
  position: relative;
}

.timeline-segment.passed {
  background: #166534;
}

.timeline-segment.current {
  background: linear-gradient(90deg, #166534 0%, #e4e4e7 100%);
  /* Ini satu-satunya gradient yang diizinkan */
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #e4e4e7;
  background: white;
  flex-shrink: 0;
}

.timeline-dot.passed  { background: #166534; border-color: #166534; }
.timeline-dot.current { background: white; border-color: #166534; border-width: 2.5px; }
```

---

## 15. Komponen — Hasil Deteksi Penyakit (Result Card)

```
┌──────────────────────────────────────────────────────┐  ← border zinc-200
│  [Thumbnail foto kecil]                              │
│                                                      │
│  Leaf Blast · Blas Daun              [PARAH ●]      │
│  Pyricularia oryzae                                  │
│                                                      │
│  ────────────────────────────────────────────────    │
│                                                      │
│  Tingkat keyakinan         87%                       │
│  ████████████░░░  zinc progress bar                  │
│                                                      │
│  Gejala                                              │
│  Bercak berbentuk belah ketupat, warna abu-abu...    │
│                                                      │
│  Penanganan (Parah)                                  │
│  Aplikasikan fungisida berbahan aktif...             │
│                                                      │
│  [Minta Rekomendasi Pupuk →]                         │
└──────────────────────────────────────────────────────┘
```

---

## 16. Halaman — Panduan Spesifik

### Dashboard (`/petani/dashboard`)
- Tidak ada hero card gelap. Greeting section putih bersih.
- Grid lahan: 2-3 kolom card, masing-masing menampilkan nama + fase + tanggal panen.
- Section "Sorotan": hanya 3 item terbaru — scan terakhir, rekomendasi terakhir, alert.
- Tidak ada chart/grafik di dashboard — terlalu berat untuk petani, kesan "enterprise".

### Rekomendasi Pupuk (`/petani/spk/pupuk`)
- Form sebelah kiri (640px max), hasil sebelah kanan atau di bawah setelah submit.
- Hasil tidak ditampilkan di hero card hijau besar. Gunakan `card-accent` (border kiri hijau).
- Tabel ranking TOPSIS: `text-sm`, tidak perlu warna per baris, cukup zebra striping zinc-50.

### Deteksi Penyakit (`/petani/scan/penyakit`)
- Upload area di atas, hasil di bawah (bukan side-by-side).
- Loading state: skeleton card yang bergerak, bukan spinner di tengah halaman.

### Kelola Limbah (`/petani/spk/limbah`)
- Section CO₂: gunakan card dengan `border: 1px solid #bbf7d0` dan `background: #f0fdf4`.
  Ini satu-satunya halaman yang boleh punya card background berwarna.
- Tiga chip equivalensi (pohon, km, kWh) di bawah angka CO₂ — pendek, inline.

---

## 17. Apa yang TIDAK Boleh Ada

Ini daftar larangan yang membuat desain terlihat seperti output AI:

```
✗  Hero card dengan background gelap/gradient di dalam dashboard
✗  Font weight 700 (bold) di manapun
✗  Icon Heroicons atau Lucide (ganti ke Phosphor)
✗  Card dengan border-radius > 12px
✗  Box shadow pada card biasa (border sudah cukup)
✗  Gradient pada background section atau card
✗  Tombol dengan border-radius: 9999px / rounded-full
✗  Emoji di dalam UI komponen (✓ ✗ → ← 🌱 👋)
✗  Teks placeholder "Lorem ipsum" yang terlihat di UI
✗  Warna accent lebih dari 1 per halaman
✗  Progress bar dengan height > 8px
✗  Metric card dengan angka ukuran > 36px
✗  Semua uppercase kecuali label 11px dengan letter-spacing
✗  Animasi fade/slide yang terlalu smooth (> 200ms terasa AI)
✗  Tombol yang mengambang/fixed di sudut layar
✗  Sidebar dengan background berwarna (bukan putih/zinc-50)
```

---

## 18. Responsive — Mobile Breakpoints

```css
/* Sidebar collapse di bawah 768px */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
    z-index: 50;
  }
  .sidebar.open {
    transform: translateX(0);
    box-shadow: 4px 0 20px rgba(0,0,0,0.1);
  }
  .page-content {
    padding: 0 16px 48px;
  }
  .greeting-stats {
    width: 100%;
  }
}

/* Grid adjustment */
@media (max-width: 640px) {
  .metric-grid { grid-template-columns: repeat(2, 1fr); }
  .lahan-grid  { grid-template-columns: 1fr; }
}
```

**Mobile nav:** Bottom navigation bar 4 icon (Dashboard, Deteksi, Pupuk, Lahan) — lebih natural untuk petani yang akses dari HP.

---

## 19. Implementasi di Vue/Inertia

### AppLayout.vue (base layout untuk semua halaman petani)
```vue
<template>
  <div class="app-shell">
    <Sidebar :user="$page.props.auth.user" />
    <main class="main-content">
      <div class="page-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  background: #fafafa;  /* zinc-50 */
}
.main-content {
  flex: 1;
  min-width: 0;         /* penting: mencegah overflow di flex */
}
.page-content {
  max-width: 860px;
  padding: 0 32px 48px;
}
</style>
```

### Cara install font di Inertia (resources/views/app.blade.php):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

---

*Dokumen ini adalah satu-satunya sumber kebenaran untuk visual BathariSri. Setiap keputusan desain yang tidak ada di dokumen ini harus mengacu pada prinsip di Bagian 1 (Filosofi Desain) terlebih dahulu.*
