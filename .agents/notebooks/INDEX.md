# 📚 Notebooks Index — Katalog Pengetahuan Proyek

> **Instruksi untuk AI**: Setiap kali membuat notebook baru, **wajib tambahkan baris baru** ke tabel di bawah.
> Format: `| [Judul](path/ke/file.md) | Kategori | YYYY-MM-DD | Author | Status | tag1, tag2 |`

---

## 🗺️ Navigasi Cepat

| Kategori | Deskripsi | Jumlah Entri |
|---|---|---|
| [Architecture Decisions](#-architecture-decisions-adr) | Keputusan desain & pilihan teknologi | 1 |
| [System Investigations](#-system-investigations) | Investigasi bug, profiling, root cause | 0 |

---

## 🏗️ Architecture Decisions (ADR)

> Folder: `00_architecture_decisions/`

| Judul | ID | Tanggal | Author | Status | Tags |
|---|---|---|---|---|---|
| [Core Architecture, Data Layer, and Deployment Strategy](00_architecture_decisions/2026-10-07_ADR-001_core_tech_stack_and_deployment.md) | ADR-001 | 2026-10-07 | Mangajiee Team | `Accepted` | `architecture`, `database`, `infra`, `security` |

**Status yang valid**: `Draft` · `Proposed` · `Accepted` · `Deprecated` · `Superseded`

---

## 🔍 System Investigations

> Folder: `01_system_investigations/`

| Judul | Tanggal | Author | Status | Tags |
|---|---|---|---|---|
| *(belum ada entri)* | — | — | — | — |

**Status yang valid**: `Open` · `In Progress` · `Resolved` · `Won't Fix`

---

## 🏷️ Tag Glossary

Gunakan tag konsisten agar pencarian mudah:

| Tag | Penggunaan |
|---|---|
| `architecture` | Keputusan level sistem/arsitektur |
| `database` | Skema, query, migrasi |
| `api` | Desain endpoint, kontrak API |
| `security` | Autentikasi, otorisasi, enkripsi |
| `performance` | Profiling, bottleneck, optimasi |
| `bug` | Root cause analysis bug kritis |
| `refactor` | Restrukturisasi kode besar |
| `infra` | CI/CD, deployment, cloud config |
| `ux` | Flow pengguna, aksesibilitas |
| `dependency` | Library baru, upgrade, atau removal |

---

## 📋 Cara Menambah Notebook Baru

```bash
# 1. Salin template
cp notebooks/templates/NOTEBOOK_TEMPLATE.md \
   notebooks/<folder>/<YYYY-MM-DD>_<judul-singkat>.md

# 2. Isi konten notebook
# (edit file baru tersebut)

# 3. Tambahkan baris ke tabel di INDEX.md ini
# 4. Commit keduanya sekaligus
```

---

*Terakhir diperbarui: 2026-10-07 | Auto-index version: 1.0*
