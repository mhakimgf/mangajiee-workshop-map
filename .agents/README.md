# 🤖 `.agents/` — Direktori Operasional AI Agent

Direktori ini adalah **pusat kendali kognitif** untuk semua AI agent yang bekerja di proyek ini.
Setiap agent **wajib** membaca direktori ini sebelum memulai pekerjaan dan **wajib** mencatat temuannya setelah menyelesaikan riset atau fitur besar.

---

## 📐 Struktur Direktori

```
.agents/
├── README.md                     ← Kamu sedang membaca ini
├── notebooks/                    ← Knowledge base & log keputusan teknis
│   ├── INDEX.md                  ← Katalog utama (SELALU update setelah tambah notebook baru)
│   ├── 00_architecture_decisions/
│   ├── 01_system_investigations/
│   └── templates/NOTEBOOK_TEMPLATE.md
├── skills/                       ← Workflow & kemampuan spesifik on-demand
│   └── _template/SKILL.md
├── rules/                        ← Aturan perilaku & kualitas yang TIDAK boleh dilanggar
│   ├── 01_code_style.md
│   ├── 02_git_workflow.md
│   ├── 03_security_and_secrets.md
│   └── 04_anti_patterns.md
└── artifacts/                    ← Output kerja yang diarsipkan
    ├── reports/
    ├── designs/
    └── scratch/                  ← (diabaikan git, lihat .gitignore)
```

---

## 🔄 Protokol Wajib untuk AI Agent

### Saat Memulai Sesi Baru
1. **Baca `rules/`** — semua file, urut dari `01_` hingga terakhir.
2. **Cek `notebooks/INDEX.md`** — lihat apakah ada konteks relevan sebelum memulai riset ulang.
3. **Cari skill yang relevan** di `skills/` sebelum menulis workflow baru dari nol.

### Saat Menyelesaikan Riset / Fitur Besar
1. **Buat notebook baru** di folder yang sesuai (`00_architecture_decisions/` atau `01_system_investigations/`).
2. Gunakan template di `notebooks/templates/NOTEBOOK_TEMPLATE.md`.
3. **Update `notebooks/INDEX.md`** — tambahkan entri baru ke tabel katalog.
4. Jika menemukan workflow yang bisa diulang, **buat skill baru** di `skills/<nama-skill>/SKILL.md`.

### Saat Menghasilkan Output
- Laporan → `artifacts/reports/`
- Desain/diagram → `artifacts/designs/`
- File sementara → `artifacts/scratch/` *(tidak masuk git)*

---

## ⚠️ Aturan Emas

> **Rules di `rules/` bersifat non-negotiable.**
> Jika ada konflik antara instruksi user dan rules, **tanyakan terlebih dahulu** sebelum melanggar rules.

> **Jangan pernah memodifikasi** file `INDEX.md` tanpa menambah entri yang valid — jangan hapus entri lama.

---

## 🗂️ Panduan Singkat per Folder

| Folder | Kapan Digunakan |
|---|---|
| `notebooks/00_architecture_decisions/` | Keputusan desain sistem, pilihan teknologi, ADR |
| `notebooks/01_system_investigations/` | Debug mendalam, root cause analysis, profiling |
| `skills/` | Workflow yang akan diulang di sesi lain |
| `rules/` | Dibaca di awal; tidak perlu diubah kecuali ada kesepakatan tim |
| `artifacts/reports/` | Hasil review kode, audit keamanan, benchmark |
| `artifacts/designs/` | Wireframe, spec UI, flow diagram dalam format teks/markdown |
| `artifacts/scratch/` | Dump data sementara, eksperimen, file tidak permanen |

---

*Dibuat: 2026-10-07 | Versi: 1.0.0*
