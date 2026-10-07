---
# ═══════════════════════════════════════════════════════════
# SKILL FRONTMATTER — Standar wajib untuk semua file SKILL.md
# ═══════════════════════════════════════════════════════════
name: "nama-skill-kebab-case"
display_name: "Nama Skill Yang Mudah Dibaca"
version: "1.0.0"
description: >
  Satu atau dua kalimat yang menjelaskan APA yang skill ini lakukan
  dan KAPAN harus digunakan. Bersifat action-oriented.
author: "AI Agent / Nama Developer"
created: YYYY-MM-DD
updated: YYYY-MM-DD
category: research | code | review | refactor | testing | infra | documentation
tags:
  - tag1
  - tag2

# Kondisi yang harus dipenuhi agar skill ini relevan
triggers:
  - "User meminta [aksi spesifik]"
  - "Ada kebutuhan untuk [konteks tertentu]"
  - "Ketika menghadapi [situasi X]"

# Skill lain yang harus dijalankan SEBELUM skill ini
prerequisites:
  - "Skill atau kondisi prasyarat (atau tulis 'none')"

# Output yang dihasilkan skill ini
outputs:
  - type: file | artifact | code | report
    description: "Deskripsi singkat output"
---

# [Nama Skill]

> **TL;DR**: [Satu kalimat ringkasan apa yang dilakukan skill ini]

---

## 🎯 Kapan Menggunakan Skill Ini

Gunakan skill ini ketika:
- [ ] Kondisi 1: ...
- [ ] Kondisi 2: ...
- [ ] Kondisi 3: ...

**Jangan gunakan** skill ini untuk:
- ❌ [Kasus yang tidak sesuai]
- ❌ [Kasus yang lebih cocok pakai skill lain]

---

## 📋 Langkah-Langkah Eksekusi

### Step 1: [Nama Langkah]

**Tujuan**: [Apa yang ingin dicapai di step ini]

```bash
# Contoh perintah atau kode
echo "Lakukan ini dulu"
```

> ⚠️ **Catatan**: [Hal penting yang perlu diperhatikan]

---

### Step 2: [Nama Langkah]

**Tujuan**: [Apa yang ingin dicapai di step ini]

```
# Contoh output yang diharapkan setelah step ini
Expected output: ...
```

**Cek validasi**:
- [ ] Pastikan [kondisi A] terpenuhi
- [ ] Pastikan [kondisi B] terpenuhi

---

### Step 3: [Nama Langkah]

<!-- Lanjutkan langkah sesuai kebutuhan -->

---

### Step N: Finalisasi & Dokumentasi

1. Simpan output ke `artifacts/[reports|designs|scratch]/`
2. Jika temuan penting ditemukan → buat notebook baru di `notebooks/`
3. Update `notebooks/INDEX.md` jika ada notebook baru

---

## 🔄 Decision Points

> *Titik-titik di mana agent perlu membuat keputusan atau bertanya ke user*

| Situasi | Pertanyaan ke User | Default Jika Tidak Ada Jawaban |
|---|---|---|
| [Situasi ambiguous] | "Apakah Anda ingin X atau Y?" | Pilih X |

---

## 📎 Referensi & Sumber Daya

- Dokumentasi terkait: [Link]
- Skill terkait: `skills/<nama-skill>/SKILL.md`
- Notebook relevan: `notebooks/<folder>/<nama-notebook>.md`

---

## 📝 Catatan Versi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0.0 | YYYY-MM-DD | Versi awal |

---

*Template ini dibuat mengikuti standar `.agents/skills/_template/SKILL.md`*
