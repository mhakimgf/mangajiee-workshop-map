# 📁 Folder: Architecture Decision Records

Folder ini menyimpan **ADR (Architecture Decision Records)** — catatan formal untuk setiap keputusan arsitektur yang signifikan.

## Kapan Membuat ADR?

Buat ADR ketika memutuskan:
- Pilihan framework, library, atau bahasa baru
- Perubahan struktur database yang besar
- Strategi deployment atau infrastruktur
- Pola integrasi antar service
- Trade-off keamanan vs performa

## Konvensi Penamaan File

```
<YYYY-MM-DD>_<nomor-urut>_<judul-singkat>.md

Contoh:
2026-10-07_001_pilihan-database-postgresql-vs-mongodb.md
2026-10-15_002_strategi-autentikasi-jwt-vs-session.md
```

## Status ADR

- `Draft` → Sedang dirumuskan
- `Proposed` → Siap direview tim
- `Accepted` → Keputusan diambil dan berlaku
- `Deprecated` → Sudah tidak relevan
- `Superseded` → Digantikan ADR lain (sebutkan nomor pengganti)

---

> **Ingat**: Setelah membuat ADR baru, **update `notebooks/INDEX.md`**!

*Folder dibuat: 2026-10-07*
