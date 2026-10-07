# 🚗 Mangajiee Workshop Map

> *"Find the right workshop, not just the nearest one."*

**Mangajiee Workshop Map** adalah platform kurasi bengkel otomotif terpercaya berbasis peta interaktif untuk membantu pemilik kendaraan menemukan bengkel yang tepat berdasarkan spesialisasi, jenis kendaraan, dan verifikasi kurator Mangajiee.

---

## 🌟 Highlight Fitur

- 🗺️ **Interactive Workshop Map**: Peta interaktif berbasis Leaflet.js dengan styling dark industrial (*CartoDB Dark Matter*).
- 🏅 **Mangajiee Recommended Badge**: Verifikasi dan kurasi editorial langsung oleh kurator otomotif Mangajiee.
- 🔧 **Pencarian & Filter Spesialisasi**: Filter cepat berdasarkan kebutuhan (Kaki-kaki, AC, Kelistrikan/ECU, Body & Paint, BMW Specialist, Toyota/Jepang, dll).
- 💬 **Editorial "Why Mangajiee Recommends It"**: Opini kurator yang transparan mengenai keahlian mekanik, kelengkapan alat, dan integritas harga.
- ⚡ **Direct Action**: Tombol langsung WhatsApp (dengan format pesan konsultasi otomatis) & rute GPS ke Google Maps.

---

## 💻 Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend Framework** | [Next.js 14+](https://nextjs.org/) (App Router) + TypeScript |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/) (Obsidian & Mustard Industrial Design) |
| **Interactive Map** | [Leaflet.js](https://leafletjs.com/) + OpenStreetMap (*CartoDB Dark Matter tiles*) |
| **Database & BaaS** | [Supabase](https://supabase.com/) (PostgreSQL dengan RLS, Auth, Storage) |
| **Testing** | [Vitest](https://vitest.dev/) (Unit & API endpoint route status testing) |
| **CI/CD** | Husky + lint-staged (Lokal) → GitHub Actions → Hostinger VPS |

---

## 🎨 Interactive Mockup

Prototype interaktif mandiri telah tersedia di folder `mockup/index.html`. 

Untuk menjalankannya:
1. Buka file [`mockup/index.html`](file:///c:/Users/Lenovo/Desktop/Ka%20Aji/mockup/index.html) langsung di browser Anda, atau
2. Jalankan local server sederhana:
   ```bash
   npx serve mockup
   ```

Fitur mockup:
- Peta interaktif Leaflet dengan pin custom (*Gold Crown* untuk bengkel terkurasi Mangajiee).
- Sinkronisasi realtime antara klik pin di peta dan kartu di sidebar.
- Filter pill instan dan search query bengkel di Bandung.
- Modal detail lengkap dengan narasi *"Why Mangajiee Recommends It"*.
- Mode simulasi Admin Pin Picker untuk menetapkan koordinat bengkel baru.

---

## 📁 Struktur Repositori

```
├── .agents/                    # Knowledge base, rules, dan artefak AI Agent
│   ├── artifacts/designs/      # PRD komprehensif (PRD_mangajiee-workshop-map.md)
│   ├── notebooks/              # Catatan arsitektur & investigasi (ADR-001)
│   └── rules/                  # Standar kode, Git workflow, dan keamanan
├── mockup/                     # Prototype interaktif HTML/CSS/JS mandiri
│   └── index.html
├── .gitignore                  # Konfigurasi proteksi secrets & ignore files
└── README.md
```

---

## 📖 Dokumentasi Lengkap

- **Product Requirements Document (PRD v0.5)**: [.agents/artifacts/designs/PRD_mangajiee-workshop-map.md](file:///c:/Users/Lenovo/Desktop/Ka%20Aji/.agents/artifacts/designs/PRD_mangajiee-workshop-map.md)
- **Architecture Decision Record (ADR-001)**: [.agents/notebooks/00_architecture_decisions/2026-10-07_ADR-001_core_tech_stack_and_deployment.md](file:///c:/Users/Lenovo/Desktop/Ka%20Aji/.agents/notebooks/00_architecture_decisions/2026-10-07_ADR-001_core_tech_stack_and_deployment.md)
- **Git Workflow Rules**: [.agents/rules/02_git_workflow.md](file:///c:/Users/Lenovo/Desktop/Ka%20Aji/.agents/rules/02_git_workflow.md)

---

*Dikembangkan oleh Mangajiee Media & Engineering Team*
