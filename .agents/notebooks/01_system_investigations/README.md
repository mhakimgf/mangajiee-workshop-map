# 📁 Folder: System Investigations

Folder ini menyimpan **log investigasi mendalam** — root cause analysis, debugging session, profiling, dan post-mortem.

## Kapan Membuat Investigation Log?

Buat log ketika:
- Debugging bug yang butuh > 30 menit investigasi
- Profiling performa dan menemukan bottleneck
- Post-mortem setelah insiden production
- Investigasi perilaku sistem yang tidak terduga

## Konvensi Penamaan File

```
<YYYY-MM-DD>_<judul-masalah>.md

Contoh:
2026-10-07_memory-leak-di-user-session-handler.md
2026-10-20_slow-query-pada-laporan-bulanan.md
2026-11-01_postmortem-downtime-payment-gateway.md
```

## Status Investigasi

- `Open` → Masalah teridentifikasi, belum diinvestigasi
- `In Progress` → Sedang diinvestigasi
- `Resolved` → Root cause ditemukan dan fix diimplementasi
- `Won't Fix` → Diketahui tapi tidak akan diperbaiki (dengan alasan)

---

> **Ingat**: Setelah membuat log baru, **update `notebooks/INDEX.md`**!

*Folder dibuat: 2026-10-07*
