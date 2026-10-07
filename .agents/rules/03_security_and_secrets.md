# 🔐 Rule 03 — Security & Secrets Management

> **Prioritas**: 🔴 CRITICAL — Pelanggaran rule ini dapat menyebabkan insiden keamanan serius.
> **Tindakan langsung**: Jika ditemukan pelanggaran, HENTIKAN pekerjaan dan laporkan ke developer.

---

## ⛔ Larangan Mutlak (Zero Tolerance)

Hal-hal berikut **TIDAK PERNAH** boleh dilakukan, dalam kondisi apapun:

```
❌ DILARANG KERAS:

1. Menulis API key, token, password, atau secret ke dalam kode sumber
2. Commit file .env ke repository
3. Hardcode URL database dengan kredensial
4. Log credentials ke console atau file log
5. Kirim secret melalui query parameter URL
6. Simpan secret di komentar kode
7. Gunakan kredensial production di environment development
8. Share secret melalui chat, email, atau dokumen tidak terenkripsi
```

---

## 1. Pengelolaan Secret yang Benar

### Hierarki Environment Variables

```
Prioritas (dari tertinggi ke terendah):
1. Secret manager service (AWS Secrets Manager, Vault, GCP Secret Manager)
2. Environment variables di CI/CD (GitHub Actions Secrets, etc.)
3. File .env lokal (TIDAK pernah di-commit)
4. Default values di kode (HANYA untuk nilai non-sensitif)
```

### Struktur File .env

```bash
# .env.example — BOLEH di-commit, tanpa nilai asli
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-jwt-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
STRIPE_SECRET_KEY=sk_live_...

# .env.local — JANGAN pernah di-commit
# .env.production — JANGAN pernah di-commit
# .env — JANGAN pernah di-commit
```

### .gitignore Wajib untuk Secrets
```gitignore
# Environment files
.env
.env.local
.env.*.local
.env.production
.env.staging

# Secret files
*.pem
*.key
*.p12
*.pfx
secrets/
```

---

## 2. Cara Akses Secret di Kode

```typescript
// ✅ BENAR — Akses via environment variable
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL is not set");

// ✅ BENAR — Validasi di startup dengan schema
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(["development", "test", "production"]),
});

export const env = envSchema.parse(process.env);

// ❌ SALAH — Hardcoded secret
const dbUrl = "postgresql://admin:SuperSecret123@prod-db:5432/myapp";

// ❌ SALAH — Secret di kode dengan komentar "temporary"
const apiKey = "sk-abc123xyz"; // TODO: move to env later (INI TETAP SALAH)
```

---

## 3. Logging yang Aman

```typescript
// ✅ BENAR — Log tanpa informasi sensitif
logger.info("User login attempt", { userId: user.id, email: maskEmail(user.email) });
logger.error("Database connection failed", { host: db.host, port: db.port });

// ❌ SALAH — Log yang mengekspos secret
logger.debug("Connecting to DB", { url: process.env.DATABASE_URL }); // URL mungkin berisi password
logger.info("Auth token", { token: jwt }); // Token tidak boleh di-log

// Helper untuk masking
function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  return `${user[0]}***@${domain}`;
}
```

---

## 4. Input Validation & Sanitization

```typescript
// ✅ Validasi SEMUA input dari user sebelum diproses
import { z } from "zod";

const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100).trim(),
  age: z.number().int().min(13).max(120),
});

// ✅ Parameterized queries — WAJIB untuk database
const user = await db.query(
  "SELECT * FROM users WHERE email = $1",
  [email] // Bukan string interpolation!
);

// ❌ SALAH — SQL injection vulnerability
const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
```

---

## 5. Autentikasi & Otorisasi

### Prinsip Least Privilege
> Setiap komponen hanya boleh punya akses minimum yang dibutuhkan.

```typescript
// ✅ BENAR — Cek permission spesifik
if (!user.hasPermission("orders:write")) {
  throw new ForbiddenError("Insufficient permissions");
}

// ❌ SALAH — Cek hanya apakah login
if (!user) throw new UnauthorizedError(); // Tidak cukup untuk operasi sensitif
```

### JWT Best Practices
- ✅ Set expiry yang pendek (`accessToken`: 15 menit, `refreshToken`: 7 hari)
- ✅ Gunakan `RS256` (asymmetric) untuk production, bukan `HS256`
- ✅ Validasi `iss`, `aud`, `exp` saat verify
- ❌ Jangan simpan JWT di localStorage (rentan XSS) — gunakan `httpOnly` cookie

---

## 6. Dependency Security

```bash
# Cek vulnerability secara rutin
npm audit

# Fix otomatis (hati-hati dengan breaking changes)
npm audit fix

# Cek outdated packages
npm outdated
```

- Jalankan `npm audit` **sebelum setiap release**.
- Dependency dengan severity `high` atau `critical` **wajib** diperbaiki sebelum merge ke main.

---

## 7. Checklist Security Review

Sebelum setiap PR yang menyentuh auth, data handling, atau API:

- [ ] Tidak ada secret yang ter-hardcode
- [ ] Semua input di-validasi sebelum diproses
- [ ] Query database menggunakan parameterized queries
- [ ] Error message tidak mengekspos detail internal
- [ ] Log tidak mengandung informasi sensitif
- [ ] Permission check sudah ada di semua endpoint sensitif
- [ ] `npm audit` sudah dijalankan

---

## 🚨 Prosedur Jika Secret Ter-expose

Jika secret sudah ter-commit ke repository:

1. **Segera revoke** secret yang ter-expose (generate yang baru)
2. **Hapus dari history** git: `git filter-branch` atau `git-secrets`
3. **Force push** ke semua branch (koordinasi dengan tim)
4. **Audit log** — cek apakah secret sudah disalahgunakan
5. **Dokumentasikan** insiden di `notebooks/01_system_investigations/`

---

*Rule ini berlaku sejak: 2026-10-07 | Versi: 1.0*
