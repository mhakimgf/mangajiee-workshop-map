# 📁 Folder: Designs

Tempat menyimpan artefak desain dan spesifikasi:

- **Wireframe & Mockup** — Dalam format Markdown, ASCII art, atau link ke tool desain
- **Flow Diagram** — User flow, data flow, sequence diagram (Mermaid syntax)
- **UI/UX Specification** — Deskripsi komponen, behavior, state
- **API Contract** — Draft OpenAPI spec sebelum implementasi

## Konvensi Penamaan

```
<YYYY-MM-DD>_<fitur>_<tipe>.md

Contoh:
2026-10-07_user-onboarding_flow-diagram.md
2026-10-15_dashboard_wireframe.md
2026-11-01_checkout-api_openapi-draft.md
```

## Tips Diagram dengan Mermaid

```mermaid
flowchart TD
    A[User Login] --> B{Valid Credentials?}
    B -->|Yes| C[Dashboard]
    B -->|No| D[Error Message]
    D --> A
```

---
*Folder dibuat: 2026-10-07*
