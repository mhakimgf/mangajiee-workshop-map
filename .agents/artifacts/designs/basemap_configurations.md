# 🗺️ Konfigurasi Basemap — Mangajiee Workshop Map

Dokumen ini mencatat seluruh referensi, template URL, dan API key untuk provider basemap yang digunakan pada platform **Mangajiee Workshop Map**.

---

## 1. Google Maps Raster Tile Service

Google Maps menyediakan layer raster tile berkecepatan tinggi yang memuat nama jalan detail, label POI, dan kontur wilayah dalam Bahasa Indonesia.

| Tipe Peta | Kode `lyrs` | Deskripsi | Template URL |
|---|---|---|---|
| **Google Roadmap** | `m` | Peta jalan standar, sangat jelas dengan nama jalan | `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}` |
| **Google Altered Road** | `r` | Varian peta jalan dengan kontur halus | `https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}` |
| **Google Hybrid** | `y` | Foto satelit resolusi tinggi + label & nama jalan | `https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}` |
| **Google Satellite** | `s` | Foto satelit murni tanpa label | `https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}` |
| **Google Terrain** | `p` | Peta topografi & kontur elevasi + nama jalan | `https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}` |
| **Google Traffic** | `m,traffic` | Peta jalan dengan overlay arus lalu lintas | `https://mt1.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}` |

> **Subdomain load-balancing**: Gunakan `mt0`, `mt1`, `mt2`, atau `mt3` (e.g. `https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}` dengan `subdomains: ['0', '1', '2', '3']`).

### Contoh Implementasi di Leaflet.js
```javascript
// Google Roadmap (Peta Jalan dengan Nama Jalan Jelas)
const googleRoadmap = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  subdomains: ['0', '1', '2', '3'],
  attribution: '&copy; Google Maps',
  maxZoom: 20
});

// Google Hybrid (Satelit + Jalan)
const googleHybrid = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
  subdomains: ['0', '1', '2', '3'],
  attribution: '&copy; Google Maps Hybrid',
  maxZoom: 20
});
```

---

## 2. CARTO Basemap Raster Tiles

- **API Key**: Dikelola via `.env.local` (`NEXT_PUBLIC_CARTO_API_KEY`)
- **Subdomain**: `a`, `b`, `c`, `d`

| Tipe Peta | Karakter | Template URL |
|---|---|---|
| **CARTO Dark Matter** | Minimalist dark theme, cocok untuk tema industrial | `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key={CARTO_API_KEY}` |
| **CARTO Voyager** | Peta jalan berwarna cerah dengan fokus navigasi & POI | `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?api_key={CARTO_API_KEY}` |
| **CARTO Positron** | Minimalist light grey theme | `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?api_key={CARTO_API_KEY}` |

### Contoh Implementasi di Leaflet.js
```javascript
const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY;
const cartoDarkMatter = L.tileLayer(`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${cartoKey}`, {
  subdomains: 'abcd',
  attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
  maxZoom: 20
});
```

---

## 3. Rekomendasi Penggunaan di Mangajiee

1. **Default View (Pilihan Utama untuk User)**:
   - **Google Roadmap (`lyrs=m`)** atau **CARTO Voyager**: Sangat ideal karena pengguna Indonesia sangat terbiasa dengan toponimi jalan Google Maps (gang, jalan utama, perempatan) saat mencari lokasi fisik bengkel.
2. **Night / Dark Aesthetic Mode**:
   - **CARTO Dark Matter (`dark_all` + API Key)**: Sesuai dengan estetika desain *Obsidian & Mustard Industrial* Mangajiee.
3. **Satellite Verification View**:
   - **Google Hybrid (`lyrs=y`)**: Membantu pengguna melihat kondisi fisik atap bengkel, luas garasi/halaman, dan posisi masuk kendaraan.

---

*Terakhir diperbarui: 2026-10-07 | Status: Verified & Tested*
