---
title: "ADR-001: Core Architecture, Data Layer, and Deployment Strategy"
date: 2026-10-07
author: "Mangajiee Engineering & Product Team"
category: architecture-decision
status: Accepted
tags:
  - architecture
  - database
  - infra
  - security
related_notebooks: []
---

# ADR-001: Core Architecture, Data Layer, and Deployment Strategy

---

## 1. 🎯 Konteks & Tujuan

**Latar belakang:**
Mangajiee Workshop Map membutuhkan fondasi teknis terpadu untuk platform kurasi bengkel interaktif di Bandung. Sistem harus mendukung:
1. Peta interaktif performan tinggi tanpa biaya lisensi runtime API yang membesar seiring traffic.
2. Rendering halaman publik yang ramah SEO (SSR/SSG).
3. Backend, database, autentikasi admin, dan media storage yang hemat biaya pada fase MVP.
4. Alur input & kurasi data yang ketat (tidak ada bengkel yang live tanpa persetujuan tim kurator Mangajiee).
5. Quality gates lokal dan CI/CD otomatis untuk menjamin integritas kode sebelum rilis ke server produksi (Hostinger VPS).

**Pertanyaan utama:**
- Framework & arsitektur apa yang digunakan (monorepo/unified vs split microservices)?
- Provider peta apa yang efisien biaya tanpa mengorbankan fungsionalitas?
- Database & BaaS apa yang paling efisien untuk relasi data kurasi dan storage foto?
- Infrastruktur hosting & pipeline deployment mana yang memberikan kontrol penuh dengan efisiensi biaya optimal?

**Scope:**
- **Dalam scope**: Stack framework web, Map engine, Database & Auth provider, Storage, Hosting target, Quality Gates (Pre-commit & CI/CD).
- **Di luar scope**: Mobile native apps (React Native/Flutter ditunda ke fase 2).

---

## 2. 🔬 Analisis & Perbandingan Opsi

### 2.1 Arsitektur Aplikasi & Framework

| Opsi | Kelebihan | Kekurangan | Skor (1-5) |
|---|---|---|---|
| **A. Next.js 14+ (App Router)** | Fullstack dalam 1 codebase, SSR/SSG prima untuk SEO, API routes terpadu, ekosistem React masif | Butuh Node runtime yang stabil | 4.8 |
| **B. Vite React + Express.js terpisah** | Fleksibel, pemisahan tugas jelas | Dua repo/service terpisah, SEO butuh setup SSR tambahan, beban maintenance ganda | 3.6 |
| **C. Laravel / Inertia** | Monolitik matang, auth bawaan | Ekosistem frontend JS terfragmentasi dibanding Next.js | 3.9 |

### 2.2 Map Provider

| Opsi | Kelebihan | Kekurangan | Biaya |
|---|---|---|---|
| **A. Leaflet.js + CartoDB Dark Matter (OSM)** | 100% open-source, tile estetik dark mode gratis, no API billing risk | Fitur 3D/street view terbatas | **Gratis** |
| **B. Google Maps JavaScript API** | Data POI terlengkap, street view | Mahal ($7 per 1,000 load setelah kuota kredit), tagihan bisa melonjak | Berbayar |
| **C. Mapbox GL JS** | Visual sangat fleksibel | Batas free tier 50,000 loads/bln, butuh kartu kredit | Freemium |

### 2.3 Backend & Database Solution

| Opsi | Kelebihan | Kekurangan | Skor (1-5) |
|---|---|---|---|
| **A. Supabase (PostgreSQL + Auth + Storage)** | Relasional SQL lengkap, RLS bawaan, auth terintegrasi, S3-compatible storage, Free tier lega (500MB DB, 1GB storage) | Vendor lock-in sebagian ke API Supabase (bisa self-host via Docker jika perlu) | 4.9 |
| **B. Firebase (Firestore)** | Setup cepat | NoSQL sulit menangani query relasi spasial & junction table workshop-spesialisasi | 3.2 |
| **C. Raw PostgreSQL di VPS** | Bebas biaya platform pihak ketiga | Harus kelola backup, auth, storage S3 sendiri secara manual | 3.5 |

### 2.4 Hosting & Infrastruktur

| Opsi | Kelebihan | Kekurangan | Skor (1-5) |
|---|---|---|---|
| **A. Hostinger VPS (Self-managed Node/Nginx/PM2)** | Biaya flat terjangkau, kontrol penuh atas server & resource, tidak terkena limit serverless function timeout | Butuh setup reverse proxy Nginx, PM2, dan SSL Certbot manual | 4.6 |
| **B. Vercel** | Zero-config deployment | Biaya tim/commercial bisa membengkak, bandwidth overage mahal | 4.0 |

---

## 3. ✅ Keputusan

**Keputusan Akhir:**
1. **Frontend & API**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS.
2. **Peta Interaktif**: Leaflet.js dengan Tile CartoDB Dark Matter (OpenStreetMap data).
3. **Database, Auth, & Storage**: Supabase (PostgreSQL dengan Row-Level Security, Supabase Auth untuk kurator/admin, dan Supabase Storage bucket `workshop-media`).
4. **Hosting & Server**: Hostinger VPS (Ubuntu Linux, Node.js runtime, PM2 process manager, Nginx reverse proxy, Let's Encrypt SSL).
5. **Quality Gates & CI/CD**:
   - **Layer 1 (Lokal)**: Husky + lint-staged (ESLint, Prettier, TypeScript `tsc --noEmit`).
   - **Layer 2 (GitHub Actions)**: Full CI run (lint, typecheck, Vitest unit & API integration tests).
   - **Layer 3 (Deploy)**: SSH Deployment otomatis ke Hostinger VPS setelah PR di-merge ke branch `main`.

**Konsekuensi yang diterima:**
- ✅ Biaya operasional awal mendekati nol (hanya biaya sewa VPS bulanan/tahunan yang flat).
- ✅ Keamanan data kurasi terjamin oleh Supabase RLS (bengkel hanya tayang jika `status = 'approved'`).
- ✅ Tidak ada risiko tagihan lonjakan tak terduga dari map API.
- ⚠️ Tim engineering bertanggung jawab menjaga konfigurasi Nginx dan PM2 di VPS (dimitigasi dengan script deployment otomatis).

---

## 4. 📋 Action Items

| # | Tugas | Assignee | Deadline | Status |
|---|---|---|---|---|
| 1 | Inisialisasi scaffolding Next.js 14 + Tailwind + TypeScript | Eng Lead | Sprint 1 | `todo` |
| 2 | Setup Git hooks (`husky`, `lint-staged`) dan ruleset ESLint | Eng Lead | Sprint 1 | `todo` |
| 3 | Konfigurasi project Supabase & eksekusi DDL Migration 8 tabel | Data/Backend | Sprint 1 | `todo` |
| 4 | Setup Vitest test runner untuk API endpoint status check | QA/Eng | Sprint 1 | `todo` |
| 5 | Setup GitHub Actions CI workflow (`.github/workflows/ci.yml`) | DevOps | Sprint 1 | `todo` |
| 6 | Konfigurasi Hostinger VPS (Nginx, PM2, Node.js 20, SSL) | DevOps | Sprint 2 | `todo` |

---

## 5. 📎 Referensi

- Dokumen PRD: [.agents/artifacts/designs/PRD_mangajiee-workshop-map.md](file:///c:/Users/Lenovo/Desktop/Ka%20Aji/.agents/artifacts/designs/PRD_mangajiee-workshop-map.md)
- Git Workflow Rules: [.agents/rules/02_git_workflow.md](file:///c:/Users/Lenovo/Desktop/Ka%20Aji/.agents/rules/02_git_workflow.md)
- Security Guidelines: [.agents/rules/03_security_and_secrets.md](file:///c:/Users/Lenovo/Desktop/Ka%20Aji/.agents/rules/03_security_and_secrets.md)

---

*Dibuat: 2026-10-07 | Status: Accepted*
