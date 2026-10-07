# 📝 Rule 01 — Code Style & Arsitektur Proyek

> **Prioritas**: 🔴 Critical — Berlaku untuk semua kode yang ditulis atau dimodifikasi AI.

---

## 1. Prinsip Utama

### SOLID & Clean Code
- **Single Responsibility**: Setiap fungsi/kelas punya **satu alasan** untuk berubah.
- **Open/Closed**: Tambah fitur via ekstensi, bukan modifikasi kode yang sudah berjalan.
- **DRY (Don't Repeat Yourself)**: Duplikasi logika → ekstrak ke fungsi/modul tersendiri.
- **YAGNI**: Jangan tambahkan fitur yang *belum* diminta. Tidak ada "nanti mungkin berguna".

### Keterbacaan di Atas Segalanya
```
Kode dibaca 10x lebih sering daripada ditulis.
Optimalkan untuk pembaca, bukan untuk penulis.
```

---

## 2. Penamaan

| Elemen | Konvensi | Contoh Benar | Contoh Salah |
|---|---|---|---|
| Variabel | camelCase | `userEmail` | `user_email`, `ue` |
| Fungsi | camelCase, verb-first | `getUserById()` | `userData()`, `get()` |
| Kelas/Type | PascalCase | `UserProfile` | `user_profile` |
| Konstanta | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` | `maxRetry` |
| File | kebab-case | `user-profile.ts` | `UserProfile.ts` |
| Folder | kebab-case | `auth-middleware/` | `AuthMiddleware/` |

### Aturan Penamaan Tambahan
- ❌ **Dilarang**: nama satu huruf (`x`, `y`, `i`) kecuali di loop matematika pendek.
- ❌ **Dilarang**: singkatan ambigu (`mgr`, `usr`, `tmp`) — gunakan nama lengkap.
- ✅ **Wajib**: nama boolean dimulai dengan `is`, `has`, `can`, `should`. (contoh: `isLoading`, `hasPermission`)

---

## 3. Struktur Fungsi

```typescript
// ✅ BENAR — Fungsi pendek, satu tujuan, early return
async function getUserProfile(userId: string): Promise<UserProfile> {
  if (!userId) throw new Error("userId is required");

  const user = await db.users.findById(userId);
  if (!user) throw new NotFoundError(`User ${userId} not found`);

  return mapToUserProfile(user);
}

// ❌ SALAH — Fungsi panjang, banyak tujuan, nested dalam
async function handleUser(id, flag, extra) {
  if (id) {
    const res = await db.find(id);
    if (res) {
      if (flag === "profile") { /* 50 baris kode */ }
      else { /* 80 baris kode */ }
    }
  }
}
```

**Batas panjang**: Fungsi > **40 baris** → wajib refactor atau beri komentar justifikasi.

---

## 4. Komentar & Dokumentasi

```typescript
// ✅ BENAR — Komentar menjelaskan MENGAPA, bukan APA
// Retry 3x karena upstream service kadang flaky saat cold start
const MAX_RETRY = 3;

// ❌ SALAH — Komentar redundan (kode sudah jelas)
// Increment counter by 1
counter++;
```

- **JSDoc/TSDoc** wajib untuk semua fungsi publik dan API endpoint.
- **Inline comment** hanya untuk logika non-obvious atau workaround.
- **TODO/FIXME** harus disertai nomor issue: `// TODO(#123): Refactor setelah migrasi`

---

## 5. Error Handling

```typescript
// ✅ BENAR — Error spesifik, pesan informatif
throw new ValidationError("Email format invalid", { field: "email", value: input });

// ❌ SALAH — Error generik, pesan tidak berguna
throw new Error("Something went wrong");
throw err; // re-throw tanpa konteks
```

- **Jangan** pernah `catch` error lalu biarkan kosong (silent fail).
- **Selalu** log error dengan konteks yang cukup untuk debugging.
- **Gunakan** custom error classes untuk domain logic.

---

## 6. Impor & Dependensi

```typescript
// Urutan impor (dipisah blank line):
// 1. Built-in Node.js / framework core
import { readFile } from "fs/promises";

// 2. External packages
import { z } from "zod";
import express from "express";

// 3. Internal modules (absolute)
import { UserService } from "@/services/user.service";

// 4. Internal modules (relative)
import { formatDate } from "./utils";

// 5. Types only
import type { User } from "@/types";
```

- ❌ Dilarang impor `*` (wildcard) dari modul besar.
- ❌ Dilarang circular dependency — gunakan dependency injection.

---

## 7. Testing

- **Coverage minimum**: 80% untuk business logic, 60% untuk utilities.
- **Setiap bug yang diperbaiki** → harus ada regression test.
- **Format nama test**: `describe("namaFungsi") > it("should [expected behavior] when [condition]")`

```typescript
// ✅ BENAR
it("should return 404 when user does not exist", async () => { ... });

// ❌ SALAH
it("test user", () => { ... });
it("works", () => { ... });
```

---

*Rule ini berlaku sejak: 2026-10-07 | Versi: 1.0*
