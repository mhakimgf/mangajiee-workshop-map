# Fleet Health Dashboard

## Overview

Fleet Health Dashboard adalah aplikasi berbasis web untuk melakukan inspeksi kesehatan kendaraan secara visual.

Data disimpan di Google Sheets dan aplikasi di-host menggunakan Google Apps Script Web App, sehingga pengguna hanya perlu membuka sebuah URL tanpa menginstal aplikasi.

**Target pengguna:** pemilik armada kecil, komunitas otomotif, bengkel, pengguna pribadi dengan banyak kendaraan.

**Catatan penting:** Aplikasi ini didesain untuk penggunaan casual/trusted circle (lihat bagian *Security & Auth*). Bukan untuk data sensitif multi-tenant tanpa penambahan auth serius.

**Model distribusi:** Aplikasi ini adalah **template yang di-copy per orang/organisasi**. Tiap pemilik armada punya salinan Sheet + Apps Script sendiri, deploy Web App sendiri, dan datanya 100% independen dari orang lain (lihat bagian *Distribusi & Multi-Instance*).

---

# Tujuan

- Mudah digunakan, visual, mobile friendly
- Update mendekati realtime (via polling, lihat bagian *Realtime Strategy*)
- Tidak butuh Microsoft Excel atau database tambahan
- Gratis, hanya pakai Google Workspace

---

# Tech Stack

**Frontend:** HTML, CSS, Vanilla JavaScript
**Backend:** Google Apps Script
**Database:** Google Sheets
**Hosting:** Google Apps Script Web App

---

# Arsitektur

```
User
 ↓
HTML Dashboard  ──(polling tiap N detik)──┐
 ↓                                         │
Google Apps Script API  ←──────────────────┘
 ↓
Google Sheets
```

---

# Google Sheet Structure

Data model direvisi supaya history & health score bisa dihitung dengan benar, dan supaya polling murah (tidak scan seluruh sheet tiap kali).

## Sheet: `Vehicles`

Master data kendaraan.

| VehicleID | Name | Plate | Merk | Category | Type | LastScore | LastUpdated |
|---|---|---|---|---|---|---|---|
| 1 | Mobil A | D1234XX | Toyota | mobil | SUV | 87 | 2026-07-10T10:00:00 |

- **Merk** = brand kendaraan (Toyota, Honda, Mitsubishi, dst) → dipakai buat grouping, search, dan filter di dashboard.
- **Category** = `mobil` / `motor` / `truk` → menentukan file SVG & config part mana yang dipakai. Ini yang membedakan struktur kendaraan secara fundamental. **Beda dengan Merk** — Category soal bentuk fisik/SVG, Merk soal branding.
- **Type** = sub-klasifikasi kosmetik (SUV, Sedan, MPV, dst) → hanya untuk display/filter, tidak memengaruhi SVG.
- **LastScore** & **LastUpdated** = cache, di-update tiap kali ada inspeksi baru. Dashboard Home cukup baca sheet ini saja (murah), tidak perlu hitung ulang dari history tiap polling.

## Sheet: `VehicleStatus` (cache status terkini)

Satu baris = status terkini satu part satu kendaraan. Di-*upsert* tiap kali inspeksi baru disimpan.

| VehicleID | Part | Status | Notes | UpdatedAt |
|---|---|---|---|---|

Ini yang dibaca saat render SVG kendaraan & saat polling halaman detail — jauh lebih murah daripada query history tiap saat.

## Sheet: `InspectionSessions` (riwayat, level sesi)

Satu baris = satu kali sesi inspeksi (bisa berisi banyak part).

| SessionID | VehicleID | Timestamp | Inspector | Score |
|---|---|---|---|---|

Dipakai untuk tab **Riwayat** — tinggal filter by VehicleID, sort by Timestamp desc.

## Sheet: `InspectionDetails` (riwayat, level part — append only)

| SessionID | Part | Status | Notes |
|---|---|---|---|

Saat user klik satu baris di Riwayat, detail kondisi tiap part saat itu diambil dari sini via SessionID. Sheet ini murni log/audit trail, tidak pernah di-update, hanya di-append.

## Sheet: `Users` (opsional, bukan auth beneran)

Untuk isi dropdown nama inspector saja — bukan mekanisme login/password.

| Username | Role |
|---|---|

---

# Config File Structure (part & kategori kendaraan)

Supaya "fokus mobil dulu tapi extensible" beneran jalan, semua definisi part & SVG per kategori kendaraan ditaruh di file config, bukan hardcoded di kode UI.

```js
// js/config/vehicleCategories.js
const VEHICLE_CATEGORIES = {
  mobil: {
    label: "Mobil",
    svgFile: "assets/mobil.svg",
    parts: [
      { id: "engine",            label: "Engine",          group: "Mesin" },
      { id: "hood",               label: "Body Depan",      group: "Body" },
      { id: "front_left_tire",    label: "Ban Depan Kiri",  group: "Ban" },
      { id: "front_right_tire",   label: "Ban Depan Kanan", group: "Ban" },
      { id: "rear_left_tire",     label: "Ban Belakang Kiri",  group: "Ban" },
      { id: "rear_right_tire",    label: "Ban Belakang Kanan", group: "Ban" },
      { id: "brake",               label: "Rem",             group: "Mesin" },
      { id: "radiator",            label: "Radiator",        group: "Mesin" },
      { id: "battery",             label: "Aki",             group: "Kelistrikan" },
      { id: "oil",                 label: "Oli",             group: "Mesin" },
      { id: "lights",              label: "Lampu",           group: "Kelistrikan" }
    ]
  }

  // motor: { label: "Motor", svgFile: "assets/motor.svg", parts: [...] }  // tinggal tambah blok ini nanti
  // truk:  { label: "Truk",  svgFile: "assets/truk.svg",  parts: [...] }  // sama
};
```

Menambah kendaraan kategori baru = tambah 1 file SVG + 1 blok config. Tidak menyentuh kode UI/logic sama sekali.

---

# Dashboard

Dashboard menampilkan daftar kendaraan, tiap kendaraan bisa diklik untuk melihat visual SVG + panel inspeksi.

```
Mobil A
[Visual Mobil]

Engine · Brake · Ban Depan · Ban Belakang · Lampu · Oli · Radiator

Status: 🟢 🟡 🔴
```

---

# Visual Vehicle (SVG)

Kendaraan digambar pakai SVG (bukan PNG) karena scalable, tiap part bisa diberi ID unik dan warnanya diubah lewat JS.

```html
<svg>
  <path id="engine"/>
  <path id="front_left_tire"/>
  <path id="rear_left_tire"/>
  <path id="hood"/>
  ...
</svg>
```

ID di SVG **harus match** dengan `id` di config part kategori kendaraan tersebut.

---

# Warna Status

| Status | Warna |
|---|---|
| Good | `#2ECC71` |
| Warning | `#F1C40F` |
| Critical | `#E74C3C` |
| Belum dicek | `#BDC3C7` |

---

# Workflow

1. User buka dashboard → daftar kendaraan muncul (baca sheet `Vehicles`, murah)
2. User pilih kendaraan → SVG tampil, status part diambil dari `VehicleStatus`
3. Halaman detail mulai **polling** `getVehicleStatus(vehicleId)` tiap beberapa detik (lihat *Realtime Strategy*)
4. User ubah checklist di panel inspeksi (bisa banyak part sekaligus dalam satu sesi)
5. User klik Simpan → satu request `saveInspectionSession()` dikirim, berisi semua part yang diubah
6. Apps Script: generate `SessionID` baru → append ke `InspectionSessions` & `InspectionDetails` → upsert `VehicleStatus` → hitung ulang & update `LastScore`/`LastUpdated` di `Vehicles`
7. Dashboard update warna SVG otomatis dari hasil polling berikutnya, tanpa refresh halaman

---

# Inspection Panel

Checklist per part. Saat part dipilih, muncul pilihan status (○ Good ○ Warning ○ Critical) **dan kolom Notes sendiri untuk part itu** — bukan satu notes global untuk seluruh sesi. Tiap part yang dicek punya catatannya masing-masing.

Semua perubahan dalam satu kali buka panel dikumpulkan dulu di sisi client, baru dikirim sebagai **satu** `saveInspectionSession()` call (bukan satu request per part) — ini penting supaya tercatat sebagai satu sesi inspeksi yang koheren di history, dan supaya tidak boros request ke Apps Script.

Contoh payload yang dikirim:

```js
{
  vehicleId: 1,
  inspector: "Budi",
  parts: [
    { id: "engine",           status: "Warning",  notes: "Suara kasar pas idle" },
    { id: "front_left_tire",  status: "Good",      notes: "" },
    { id: "brake",            status: "Critical",  notes: "Kampas rem tipis, ganti segera" }
  ]
}
```

Tiap elemen di `parts[]` masuk sebagai satu baris terpisah di `InspectionDetails` (dengan `SessionID` yang sama), jadi notes-nya tersimpan per part, bukan tercampur jadi satu.

---

# Summary & Health Score

```
Vehicle Health
Good: 18   Warning: 3   Critical: 1   Belum dicek: 2
Health Score: 87%
```

**Perhitungan:**

```
Good = 100, Warning = 50, Critical = 0
Score = rata-rata dari part yang SUDAH pernah diinspeksi
```

Part berstatus **"Belum dicek" dikecualikan dari rata-rata**, tapi jumlahnya tetap ditampilkan terpisah di summary supaya user tahu ada bagian yang belum lengkap datanya. (Alternatif: kalau mau lebih strict, "belum dicek" bisa dihitung sebagai 0 — tinggal ganti satu baris logic ini kalau butuh.)

---

# Riwayat

| Date | Inspector | Score |
|---|---|---|

Data dari `InspectionSessions`, filter by VehicleID, sort terbaru dulu. Klik satu baris → fetch `getSessionDetail(sessionId)` dari `InspectionDetails` untuk lihat kondisi tiap part persis saat sesi itu.

---

# Dashboard Home

Kendaraan dikelompokkan per **Merk**.

```
Toyota
  🚗 Mobil A   85%   🟢
  🚙 Mobil B   60%   🟡

Honda
  🚐 Mobil C   40%   🔴
```

Dibaca langsung dari `LastScore` di sheet `Vehicles` (cache), bukan hitung ulang dari history — supaya polling di halaman home tetap ringan. Grouping per Merk dilakukan di sisi client (`getVehicles()` tetap return flat list, di-group pas render).

---

# Search & Filter

- Search: nama kendaraan, plat nomor, merk
- Filter: merk, kategori kendaraan, kondisi (score range), tanggal inspeksi terakhir

---

# Responsive & Animasi

Optimal di desktop/tablet/smartphone. Animasi ringan saja: fade, color transition (CSS transition ~300ms saat status berubah warna), hover effect. Tidak perlu animasi berat.

---

# Realtime Strategy (Polling)

Karena Apps Script Web App tidak support websocket, "realtime" diimplementasikan sebagai **polling otomatis**:

- Halaman detail kendaraan: poll `getVehicleStatus(vehicleId)` tiap **~8–10 detik**, hanya baca sheet `VehicleStatus` (kecil, cepat)
- Halaman home: poll `getVehiclesSummary()` tiap **~15 detik**, hanya baca sheet `Vehicles` (cache score, bukan raw history)
- **Pause polling** saat tab tidak aktif (pakai `document.visibilityState`) untuk hemat quota Apps Script
- Apps Script punya kuota harian request per akun — kalau nanti dipakai banyak user simultan, interval polling perlu dinaikkan atau pakai `LockService` + caching di `CacheService` biar tidak tiap request hit Sheets langsung

Saat user sendiri yang save, UI langsung update optimistically (tidak perlu nunggu polling cycle berikutnya) untuk feel yang lebih responsif.

---

# Security & Auth

**Level yang dipilih: casual, link-based.**

- Web App di-deploy dengan akses "Anyone with the link" — siapapun yang punya URL bisa buka dan mengubah data
- Sheet `Users` cuma dipakai untuk isi dropdown nama Inspector (buat atribusi "siapa yang inspeksi"), **bukan** password/login beneran
- **Implikasi:** jangan pakai untuk data sensitif atau multi-tenant (misal beberapa bengkel beda pelanggan pakai instance yang sama) tanpa upgrade ke auth serius nanti (misal cek `Session.getActiveUser().getEmail()` dan whitelist domain, kalau suatu saat dibutuhkan)
- Ini cukup buat use case armada kecil/personal/komunitas trusted seperti yang ditarget

---

# Distribusi & Multi-Instance (Template & Copy)

Ke depan akan ada **banyak Sheet independen**, satu per pemilik armada/bengkel. Pendekatan yang dipakai: **Template & Copy** — bukan satu backend terpusat yang melayani banyak sheet.

**Kenapa bukan satu backend terpusat?** Karena polling aktif (~8-10 detik) dari banyak user sekaligus akan numpuk ke satu kuota Apps Script kalau backend-nya terpusat. Dengan tiap orang deploy instance sendiri, kuotanya juga kepisah per akun — jadi skalanya jauh lebih aman.

**Struktur teknis:**

- Script Apps Script bersifat **container-bound** (nempel langsung ke Spreadsheet-nya), bukan standalone. Jadi kode backend cukup pakai `SpreadsheetApp.getActiveSpreadsheet()` — **tidak perlu** logic lookup Spreadsheet ID atau tenant registry sama sekali. Backend API tetap sesederhana desain awal.
- Satu Google Sheets file = satu Spreadsheet, isinya semua sheet (`Vehicles`, `VehicleStatus`, `InspectionSessions`, `InspectionDetails`, `Users`) + Apps Script project yang nempel di dalamnya (Extensions → Apps Script).
- Setiap instance 100% independen: data, permission, dan quota Apps Script terpisah sendiri-sendiri.

**Cara pakai untuk orang baru:**

1. Buka Sheet template (master) → **File → Make a copy**
2. Di salinan barunya, buka **Extensions → Apps Script** (kode backend otomatis ikut ter-copy)
3. **Deploy → New deployment → Web app**, akses "Anyone with the link", execute as "Me"
4. Isi sheet `Vehicles` dengan data kendaraan mereka
5. Bagikan URL Web App hasil deploy ke tim/inspector mereka

**Update strategy (biar maintenance nggak berat):**

Karena tiap instance kodenya independen, update fitur harus disebar manual ke tiap copy — ini downside utama Approach A. Cara paling ringan buat handle ini ke depan (opsional, bukan wajib untuk v1):

- Simpan file `Code.gs` dari template sebagai satu sumber kebenaran (misal di GitHub)
- Kalau ada update, developer replace isi `Code.gs` di tiap instance secara manual (untuk jumlah instance kecil, ini cukup)
- Kalau instance-nya udah banyak banget, baru pertimbangkan migrasi logic inti ke **Apps Script Library** — tiap instance cukup punya wrapper tipis yang manggil library, jadi update library otomatis ke-propagate ke semua instance tanpa copy-paste manual. Ini upgrade path kalau maintenance manual mulai kerasa berat.

---

# Backend API (Apps Script)

```
GET  getVehicles()                     → daftar kendaraan + LastScore (dashboard home, ringan)
GET  getVehicleStatus(vehicleId)       → status semua part terkini (dari VehicleStatus, buat polling)
GET  getHistory(vehicleId)             → daftar sesi inspeksi (dari InspectionSessions)
GET  getSessionDetail(sessionId)       → detail part per sesi (dari InspectionDetails)
POST saveInspectionSession(vehicleId, inspector, parts[])
                                        → buat SessionID baru, append session+details,
                                          upsert VehicleStatus, update cache LastScore
```

`saveInspectionSession` wajib pakai `LockService.getScriptLock()` untuk cegah race condition kalau ada 2 user save bersamaan.

Karena script container-bound (satu instance = satu Spreadsheet), semua fungsi di atas cukup pakai `SpreadsheetApp.getActiveSpreadsheet()` — **tidak ada parameter tenant/spreadsheetId** di endpoint manapun.

---

# Struktur Folder

```
FleetHealth
│
├── index.html
├── css
│   └── style.css
├── js
│   ├── app.js
│   ├── api.js
│   ├── svg.js
│   ├── ui.js
│   ├── polling.js
│   └── config
│       └── vehicleCategories.js
├── assets
│   └── mobil.svg          (motor.svg, truk.svg ditambah belakangan)
└── appscript
    └── Code.gs
```

---

# Prinsip Pengembangan

- Clean architecture, modular JavaScript
- Tidak pakai framework (React/Vue) kecuali benar-benar diperlukan
- Semua definisi part & kategori kendaraan ada di file config (`vehicleCategories.js`), bukan hardcoded — nambah kategori baru = nambah SVG + config block, tanpa ubah logic UI
- Kode mudah dipelihara

---

# Future Features

- Foto kondisi kendaraan (perlu integrasi Google Drive, Sheets tidak bisa simpan gambar langsung)
- Upload dari kamera HP
- QR Code per kendaraan
- Notifikasi inspeksi berkala
- Export PDF
- Grafik tren kesehatan kendaraan (butuh query history InspectionSessions per vehicle over time)
- Multi-user dengan role Admin/Inspector (butuh upgrade Security & Auth dulu)
- Dark Mode

---

# AI Implementation Instructions

Implementasikan dengan prioritas berikut:

1. Sheets: buat `Vehicles` (termasuk kolom `Merk`), `VehicleStatus`, `InspectionSessions`, `InspectionDetails`, `Users` sesuai struktur di atas
2. Backend Apps Script: **container-bound** (nempel ke Spreadsheet, pakai `getActiveSpreadsheet()`, bukan standalone), 5 endpoint di atas, pakai `LockService` di `saveInspectionSession`
3. Config: `vehicleCategories.js` hanya isi kategori **`mobil`** dulu (sesuai scope v1), tapi struktur harus siap nampung kategori lain tanpa refactor
4. Dashboard HTML responsif + rendering SVG dinamis berdasar config kategori kendaraan
5. Dashboard Home: group kendaraan per `Merk`, sinkronisasi status checklist → warna SVG via `VehicleStatus`
6. Inspection Panel: tiap part checklist punya field Notes sendiri-sendiri (lihat contoh payload di bagian *Inspection Panel*)
7. Polling: `getVehicleStatus` tiap ~8-10 detik di halaman detail (pause saat tab inactive), `getVehicles` tiap ~15 detik di home
8. Kode modular, terdokumentasi, gampang diperluas ke kategori kendaraan lain (motor, truk) cukup dengan nambah SVG + config — tanpa nyentuh app.js/svg.js/ui.js
9. Pastikan seluruh project (Sheet + Apps Script + HTML) bisa langsung di-"Make a copy" dan jalan sebagai instance independen tanpa config tambahan (lihat bagian *Distribusi & Multi-Instance*)