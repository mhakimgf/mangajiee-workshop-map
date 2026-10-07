# 🚫 Rule 04 — Anti-Patterns & Larangan Keras

> **Prioritas**: 🔴 Critical — Pola-pola ini dilarang karena terbukti merusak kualitas, maintainability, dan keandalan sistem.
> Jika ragu, **tanya dulu** sebelum menggunakan pola yang terasa "cerdas" atau "shortcut".

---

## Filosofi Dasar

```
"Make it work, make it right, make it fast" — Kent Beck

Urutan ini BUKAN opsional.
Jangan optimasi sebelum kode benar.
Jangan perumit sebelum ada kebutuhan nyata.
```

---

## 1. ❌ Anti-Slop — Dilarang Keras Menulis Kode Generik/Boilerplate Tanpa Nilai

**Slop** adalah kode yang terlihat "sibuk" tapi tidak menambah nilai:

```typescript
// ❌ SLOP — Getter/setter tidak berguna
class User {
  private _name: string;
  getName() { return this._name; }  // Mengapa tidak pakai public property saja?
  setName(v: string) { this._name = v; }
}

// ❌ SLOP — Comment yang mengulang kode
// Get user by ID and return user object
const user = await getUserById(id);

// ❌ SLOP — Interface yang hanya dipakai sekali dan tidak menambah abstraksi
interface IUserService {
  getUser(id: string): Promise<User>;
}
class UserService implements IUserService { ... }

// ✅ BENAR — Langsung ke tujuan
class User {
  public name: string;
}
const user = await getUserById(id);
class UserService {
  async getUser(id: string): Promise<User> { ... }
}
```

---

## 2. ❌ Anti-Overengineering

### Dilarang membangun abstraksi sebelum ada 3 use case nyata.

```typescript
// ❌ OVERENGINEERED — Factory + Strategy + Observer untuk kirim email
class EmailSenderFactory {
  create(strategy: EmailStrategy): EmailSender { ... }
}
interface EmailStrategy { send(opts: SendOptions): void; }
// ... 200 baris pattern untuk hal yang bisa ditulis dalam 10 baris

// ✅ CUKUP untuk kebutuhan saat ini
async function sendWelcomeEmail(email: string) {
  await emailClient.send({ to: email, template: "welcome" });
}
```

**Tanda-tanda overengineering**:
- Abstraksi yang hanya punya satu implementasi
- File konfigurasi untuk sesuatu yang tidak perlu dikonfigurasi
- Sistem plugin untuk fitur yang tidak akan pernah di-extend
- "Generic" solution untuk problem yang spesifik

---

## 3. ❌ Dilarang: Premature Optimization

```typescript
// ❌ Optimasi sebelum ada bukti bottleneck
const userMap = new Map(users.map(u => [u.id, u])); // "lebih cepat dari find()"
// STOP — apakah ada benchmark yang membuktikan ini perlu?

// ✅ Tulis yang jelas dulu, profile kemudian
const user = users.find(u => u.id === targetId);
```

**Aturan**: Jangan optimasi tanpa **profiling data** yang membuktikan ada bottleneck nyata.

---

## 4. ❌ Dilarang: Magic Numbers & Magic Strings

```typescript
// ❌ SALAH — Magic number/string
if (user.role === 3) { ... }
setTimeout(refresh, 300000);
if (items.length > 100) { ... }

// ✅ BENAR — Named constants
const ROLE = { ADMIN: 3, USER: 1, GUEST: 0 } as const;
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ITEMS_PER_PAGE = 100;

if (user.role === ROLE.ADMIN) { ... }
setTimeout(refresh, REFRESH_INTERVAL_MS);
if (items.length > MAX_ITEMS_PER_PAGE) { ... }
```

---

## 5. ❌ Dilarang: Callback Hell & Promise Anti-Patterns

```typescript
// ❌ SALAH — Callback hell
getData(function(a) {
  getMore(a, function(b) {
    doSomething(b, function(c) {
      // ... 5 level dalam
    });
  });
});

// ❌ SALAH — Promise tanpa error handling
fetch("/api/users").then(r => r.json()).then(data => setData(data));
// Tidak ada .catch() !

// ✅ BENAR — async/await dengan try-catch
try {
  const response = await fetch("/api/users");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  setData(data);
} catch (error) {
  logger.error("Failed to fetch users", { error });
  setError(error);
}
```

---

## 6. ❌ Dilarang: Any Type di TypeScript

```typescript
// ❌ DILARANG — any mengalahkan tujuan TypeScript
function processData(data: any): any {
  return data.value; // Tidak ada type safety
}

// ❌ Juga dilarang — type casting paksa
const user = response.data as User; // Tidak ada validasi runtime

// ✅ BENAR — Type yang spesifik + validasi runtime
import { z } from "zod";

const UserSchema = z.object({ id: z.string(), email: z.string().email() });
type User = z.infer<typeof UserSchema>;

function processUserData(raw: unknown): User {
  return UserSchema.parse(raw); // Validasi runtime + type safety
}
```

**Exception**: `any` boleh digunakan di file test dan di tempat yang ada komentar justifikasi `// eslint-disable-next-line @typescript-eslint/no-explicit-any -- [alasan]`.

---

## 7. ❌ Dilarang: Mutable Global State

```typescript
// ❌ SALAH — Global mutable state
let currentUser: User | null = null; // Bisa diubah dari mana saja

// ❌ SALAH — Singleton dengan state mutable
class AppState {
  static instance: AppState;
  user: User | null = null;
}

// ✅ BENAR — State management terpusat dan terkontrol
// Gunakan context, store (Redux/Zustand), atau dependency injection
const userStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

---

## 8. ❌ Dilarang: Dead Code & Commented-Out Code

```typescript
// ❌ SALAH — Kode yang di-comment tapi tidak dihapus
// function oldGetUser(id) {
//   return fetch(`/api/users/${id}`);
// }

// ❌ SALAH — Variable yang tidak dipakai
const unusedVar = calculateSomething(); // tidak dipakai di bawah

// ✅ BENAR — Hapus kode yang tidak dipakai
// Gunakan git history jika perlu recover kode lama
```

**Alasan**: Kode yang di-comment menciptakan noise dan kebingungan. Git ada untuk menyimpan history.

---

## 9. ❌ Dilarang: Swallow Exception (Silent Fail)

```typescript
// ❌ PALING BERBAHAYA — Exception ditelan diam-diam
try {
  await sendEmail(user.email);
} catch {
  // ← TIDAK BOLEH KOSONG
}

// ❌ Juga salah — log tapi tidak handle
try {
  await sendEmail(user.email);
} catch (err) {
  console.log(err); // Bukan solusi yang cukup untuk error kritis
}

// ✅ BENAR — Handle dengan tepat
try {
  await sendEmail(user.email);
} catch (err) {
  logger.error("Failed to send welcome email", { userId: user.id, error: err });
  // Lalu: retry, fallback, atau propagate error ke caller
  throw new EmailDeliveryError("Welcome email failed", { cause: err });
}
```

---

## 10. ❌ Dilarang: Mengubah Kontrak API Tanpa Versioning

```
❌ Jangan ubah response shape endpoint yang sudah ada di production
❌ Jangan rename field yang sudah digunakan client
❌ Jangan hapus field tanpa deprecation period

✅ Tambahkan endpoint baru (/v2/users) jika perlu breaking change
✅ Gunakan deprecation header dan komunikasikan ke consumer
✅ Pertahankan backward compatibility minimal 1 siklus release
```

---

## Ringkasan Cepat

| # | Anti-Pattern | Dampak |
|---|---|---|
| 1 | Slop / boilerplate tanpa nilai | Noise, waktu baca terbuang |
| 2 | Overengineering | Kompleksitas tak perlu, sulit maintain |
| 3 | Premature optimization | Kode sulit dibaca tanpa bukti manfaat |
| 4 | Magic numbers/strings | Bug tersembunyi, sulit refactor |
| 5 | Callback hell / missing catch | Race condition, error tidak tertangkap |
| 6 | `any` di TypeScript | Kehilangan type safety, bug runtime |
| 7 | Global mutable state | Side effect tak terduga, sulit test |
| 8 | Dead / commented-out code | Kebingungan, noise di codebase |
| 9 | Silent exception | Bug tersembunyi, sistem gagal diam-diam |
| 10 | Breaking API tanpa versioning | Memecah client yang sudah ada |

---

*Rule ini berlaku sejak: 2026-10-07 | Versi: 1.0*
