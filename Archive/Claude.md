# Fleet Health Dashboard

## Overview

Fleet Health Dashboard adalah aplikasi berbasis web yang digunakan untuk melakukan inspeksi kesehatan kendaraan secara visual.

Data disimpan di Google Sheets dan aplikasi di-host menggunakan Google Apps Script Web App sehingga pengguna hanya perlu membuka sebuah URL tanpa menginstal aplikasi.

Target pengguna:
- Pemilik armada kecil
- Komunitas otomotif
- Bengkel
- Pengguna pribadi dengan banyak kendaraan

---

# Tujuan

Membuat dashboard yang:

- mudah digunakan
- visual
- mobile friendly
- realtime
- tidak membutuhkan Microsoft Excel
- tidak membutuhkan database tambahan
- gratis menggunakan Google Workspace

---

# Tech Stack

Frontend
- HTML
- CSS
- Vanilla JavaScript

Backend
- Google Apps Script

Database
- Google Sheets

Hosting
- Google Apps Script Web App

---

# Arsitektur

```
User

↓

HTML Dashboard

↓

Google Apps Script API

↓

Google Sheets
```

---

# Google Sheet Structure

## Sheet : Vehicles

| VehicleID | Name | Plate | Type |
| ---------- | ---- | ----- | ---- |
| 1 | Mobil A | D1234XX | SUV |

---

## Sheet : Inspection

Satu baris = satu inspeksi.

| Timestamp | VehicleID | Part | Status | Notes | Inspector |
| ---------- | --------- | ---- | ------ | ----- | --------- |

Status terdiri dari

- Good
- Warning
- Critical

---

## Sheet : Users (Opsional)

Untuk login sederhana.

| Username | Role |
| -------- | ---- |
| Admin | admin |
| User | user |

---

# Dashboard

Dashboard menampilkan daftar kendaraan.

Contoh

```
Mobil A

[Visual Mobil]

Engine
Brake
Ban Depan
Ban Belakang
Lampu
Oli
Radiator

Status:
🟢
🟡
🔴
```

---

# Visual Vehicle

Kendaraan digambar menggunakan SVG.

Bukan PNG.

Alasan:

- scalable
- kualitas tetap bagus
- setiap bagian dapat diberi ID
- setiap bagian dapat diubah warnanya melalui JavaScript

Contoh

```
<svg>

<path id="engine"/>

<path id="front_left_tire"/>

<path id="rear_left_tire"/>

<path id="hood"/>

...

</svg>
```

Setiap part memiliki ID unik.

---

# Warna Status

Good

```
#2ECC71
```

Warning

```
#F1C40F
```

Critical

```
#E74C3C
```

Belum dicek

```
#BDC3C7
```

---

# Mapping

Contoh mapping

```
engine
↓

Engine
```

```
hood
↓

Body Depan
```

```
front_left_tire
↓

Ban Depan Kiri
```

dan seterusnya.

---

# Workflow

User membuka dashboard.

↓

Daftar kendaraan muncul.

↓

User memilih kendaraan.

↓

SVG kendaraan tampil.

↓

Data inspeksi diambil dari Google Sheets.

↓

Setiap bagian kendaraan diberi warna sesuai status.

↓

User dapat mengubah checklist.

↓

Perubahan dikirim ke Apps Script.

↓

Apps Script mengupdate Google Sheets.

↓

Dashboard otomatis memperbarui warna.

---

# Inspection Panel

Panel kanan berisi checklist.

Contoh

☐ Engine

☐ Brake

☐ Radiator

☐ Battery

☐ Oil

☐ Front Tire Left

☐ Front Tire Right

dst.

Saat memilih item muncul pilihan

○ Good

○ Warning

○ Critical

serta kolom

Notes

---

# Summary

Di bagian atas dashboard tampil ringkasan.

Contoh

```
Vehicle Health

Good :
18

Warning :
3

Critical :
1

Health Score :
87%
```

Health Score dihitung

```
Good = 100

Warning = 50

Critical = 0

Score =
rata-rata seluruh part
```

---

# Riwayat

Tampilkan histori inspeksi.

| Date | Inspector | Score |

Klik salah satu histori untuk melihat kondisi saat itu.

---

# Dashboard Home

Menampilkan semua kendaraan.

Contoh

```
🚗 Mobil A

85%

🟢
```

```
🚙 Mobil B

60%

🟡
```

```
🚐 Mobil C

40%

🔴
```

---

# Search

Mendukung

- Search nama kendaraan
- Search plat nomor

---

# Filter

Filter berdasarkan

- Jenis kendaraan
- Kondisi
- Tanggal inspeksi

---

# Responsive

Harus optimal pada

- Desktop
- Tablet
- Smartphone

---

# Animasi

Gunakan animasi ringan.

Misalnya

- Fade
- Color transition
- Hover effect

Tidak perlu animasi berat.

Contoh

Saat status berubah

Merah

↓

transisi 300 ms

↓

Hijau

Gunakan CSS transition.

---

# Backend API

Apps Script menyediakan endpoint.

GET

```
getVehicles()
```

GET

```
getInspection(vehicleID)
```

POST

```
saveInspection()
```

GET

```
getHistory(vehicleID)
```

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

│   └── ui.js

├── assets

│   └── vehicle.svg

└── appscript

    └── Code.gs
```

---

# Prinsip Pengembangan

- Clean Architecture
- Modular JavaScript
- Tidak menggunakan framework (React/Vue) kecuali benar-benar diperlukan
- Kode mudah dipelihara
- Mudah menambah jenis kendaraan baru
- Semua konfigurasi part kendaraan disimpan dalam file konfigurasi, bukan hardcoded

---

# Future Features

- Foto kondisi kendaraan
- Upload langsung dari kamera HP
- QR Code pada setiap kendaraan
- Notifikasi inspeksi berkala
- Export PDF
- Dashboard statistik
- Grafik tren kesehatan kendaraan
- Multi-user
- Role Admin dan Inspector
- Dark Mode

---

# AI Implementation Instructions

Implementasikan aplikasi dengan prioritas berikut:

1. Backend Google Apps Script yang terhubung ke Google Sheets.
2. Dashboard HTML responsif.
3. Rendering SVG kendaraan secara dinamis.
4. Sinkronisasi status checklist ke warna SVG.
5. Update data secara realtime setelah pengguna menyimpan perubahan tanpa me-refresh halaman.
6. Kode harus modular, terdokumentasi, dan mudah diperluas untuk mendukung berbagai tipe kendaraan (mobil, motor, truk, dll.) hanya dengan menambahkan file SVG dan konfigurasi mapping part.