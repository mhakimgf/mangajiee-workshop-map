# 🌿 Rule 02 — Git Workflow, Branching & Versioning

> **Prioritas**: 🟠 High — Semua perubahan kode wajib mengikuti konvensi ini.

---

## 1. Branching Strategy (Trunk-Based + Feature Flags)

```
main              ← production-ready, selalu stabil
├── develop       ← integrasi fitur aktif (opsional, untuk tim besar)
├── feat/...      ← fitur baru
├── fix/...       ← bug fix
├── refactor/...  ← refactoring tanpa perubahan behavior
├── chore/...     ← update dependency, konfigurasi, CI
├── docs/...      ← update dokumentasi saja
└── hotfix/...    ← perbaikan kritis langsung ke main
```

### Aturan Branch
- ✅ Branch dari `main` (atau `develop` jika ada).
- ✅ Merge via **Pull Request** — tidak boleh push langsung ke `main`.
- ✅ Hapus branch setelah di-merge.
- ❌ Branch hidup > **7 hari** tanpa merge → harus di-review dan diputuskan.
- ❌ Nama branch menggunakan spasi atau karakter spesial.

---

## 2. Konvensi Commit Message (Conventional Commits)

### Format
```
<type>(<scope>): <subject>

[body - opsional]

[footer - opsional]
```

### Types yang Valid

| Type | Kapan Digunakan |
|---|---|
| `feat` | Fitur baru yang terlihat oleh user |
| `fix` | Perbaikan bug |
| `refactor` | Perubahan kode tanpa ubah behavior/fix bug |
| `test` | Tambah atau perbaiki test |
| `docs` | Perubahan dokumentasi saja |
| `chore` | Update dependency, konfigurasi, tooling |
| `perf` | Optimasi performa |
| `ci` | Perubahan pipeline CI/CD |
| `revert` | Revert commit sebelumnya |
| `style` | Formatting, whitespace (tidak ubah logika) |

### Contoh Commit yang Benar
```bash
# ✅ Benar
feat(auth): add OAuth2 Google login support
fix(cart): resolve total price calculation with discount stacking
refactor(user-service): extract email validation to shared utils
chore(deps): upgrade zod from 3.21 to 3.23
test(auth): add unit tests for JWT expiry edge cases
docs(api): update OpenAPI spec for /users endpoint

# ❌ Salah
git commit -m "fix"
git commit -m "update stuff"
git commit -m "WIP"
git commit -m "asdfgh"
git commit -m "Ubah beberapa hal"
```

### Aturan Subject Line
- ✅ Maksimal **72 karakter**.
- ✅ Gunakan **imperative mood**: "add", "fix", "update" (bukan "added", "fixed").
- ✅ Huruf kecil semua (kecuali nama proper: `OAuth`, `API`).
- ❌ Jangan akhiri dengan titik.

### Breaking Changes
```bash
feat(api)!: rename /user to /users endpoint

BREAKING CHANGE: All clients must update their base URL.
Old: GET /api/user/:id
New: GET /api/users/:id
```

---

## 3. Pull Request

### Checklist Wajib Sebelum Buat PR
- [ ] Branch up-to-date dengan `main` / `develop`
- [ ] Semua test hijau (`npm test` atau equivalent)
- [ ] Tidak ada `console.log` debugging yang tertinggal
- [ ] Tidak ada hardcoded secret atau token (lihat `rules/03_security_and_secrets.md`)
- [ ] PR description diisi dengan format di bawah

### Template PR Description
```markdown
## Apa yang berubah?
[Deskripsi singkat perubahan]

## Mengapa?
[Konteks atau issue yang diselesaikan. Link ke issue: closes #123]

## Cara Test
1. [Langkah 1]
2. [Langkah 2]

## Screenshot (jika ada perubahan UI)

## Checklist
- [ ] Test coverage tidak turun
- [ ] Dokumentasi diperbarui jika perlu
- [ ] Tidak ada breaking change (atau sudah didokumentasikan)
```

### Aturan Review
- Minimal **1 approver** sebelum merge.
- Resolve semua comment sebelum merge.
- Gunakan **Squash merge** untuk feature branch agar history rapi.
- Gunakan **Merge commit** untuk hotfix agar traceable.

---

## 4. Semantic Versioning

Format: `MAJOR.MINOR.PATCH`

| Increment | Kapan |
|---|---|
| `MAJOR` | Breaking change yang tidak backward-compatible |
| `MINOR` | Fitur baru yang backward-compatible |
| `PATCH` | Bug fix, patch keamanan, perubahan kecil |

```bash
# Contoh
1.0.0  → Initial release
1.1.0  → Tambah fitur dark mode (minor, tidak break apapun)
1.1.1  → Fix bug di dark mode toggle (patch)
2.0.0  → Rombak struktur API (breaking change)
```

### Pre-release Tags
```
1.2.0-alpha.1  → Eksperimen, tidak stabil
1.2.0-beta.3   → Feature complete, sedang testing
1.2.0-rc.1     → Release Candidate, siap QA final
```

---

## 5. Tagging

```bash
# Buat tag setelah merge ke main
git tag -a v1.2.0 -m "Release v1.2.0: Add dark mode feature"
git push origin v1.2.0
```

---

---

## 6. CI/CD Pipeline & Quality Gates

### Pre-commit Hooks (Layer 1 — Wajib lokal)

Setiap developer **wajib** menginstall hooks setelah clone repo:

```bash
npm install        # install semua deps termasuk husky
npm run prepare    # setup husky hooks otomatis
```

Hooks yang berjalan setiap `git commit`:

```
pre-commit
  ├── lint-staged
  │     ├── ESLint       → *.ts, *.tsx
  │     ├── Prettier     → auto-format (tidak menolak, hanya format)
  │     └── tsc --noEmit → type check file yang berubah
  │
  └── ❌ Commit dibatalkan jika ESLint atau tsc gagal
```

> ⚠️ **Jangan skip hooks** dengan `git commit --no-verify` kecuali dalam keadaan darurat yang didokumentasikan.

---

### CI Pipeline (Layer 2 — GitHub Actions)

Berjalan otomatis di **setiap push dan PR**. PR tidak bisa di-merge jika CI gagal.

**File**: `.github/workflows/ci.yml`

| Step | Tool | Gagal = |
|---|---|---|
| 1. Install deps | `npm ci` | Pipeline berhenti |
| 2. ESLint | `npm run lint` | PR diblokir |
| 3. Type check | `tsc --noEmit` | PR diblokir |
| 4. Unit tests | `vitest run` | PR diblokir |
| 5. API tests | `vitest run --coverage` | PR diblokir |

---

### Deploy Pipeline (Layer 3 — Hanya dari `main`)

**File**: `.github/workflows/deploy.yml`

Berjalan hanya setelah merge ke `main`. Urutan:

1. Re-run full CI
2. `npm run build` — jika gagal, deploy dibatalkan
3. SSH ke Hostinger VPS → `git pull` → `npm ci` → `npm run build` → `pm2 restart`
4. Health check: hit `/api/workshops` → expect 200

> **Rollback**: jika health check gagal, jalankan `pm2 restart mangajiee --previous` di VPS.

---

*Rule ini berlaku sejak: 2026-10-07 | Versi: 1.1*
