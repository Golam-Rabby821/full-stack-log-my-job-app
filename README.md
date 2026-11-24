# LogMyJobs

A calm, structured job application tracker built with React, strict TypeScript, TanStack Query, and Zod. Designed around fast pipeline triage, drag-and-drop stage management, follow-up reminders, and conversion funnel analytics.

**Live App:** https://g-rabby-full-stack-app.netlify.app *(includes a 1-click Live Demo — no sign-up required)*

---

## Highlights

- **Pipeline Ledger & Kanban Board:** Toggle between a scannable table ledger (search, multi-filter, sort, pagination, bulk actions) and a 5-stage drag-and-drop Kanban board (`Pending → Interview → Offer → Accepted → Declined`) with optimistic TanStack Query updates.
- **One-Click Live Demo:** Explore the full app immediately with ~18 seeded applications, notes, timeline events, and upcoming reminders, plus an in-menu reset option.
- **Conversion Funnel Analytics:** Real stage-to-stage progression (`Applied → Interview+ → Offer+ → Accepted`), weekly application volume, status/work-type distributions, and stale pending alerts (>14 days).
- **Notes, Timeline & Reminders:** Per-application notes, automatic status-change timeline logging, and follow-up reminders with completion toggles.
- **Command Palette & Theme:** Instant keyboard navigation via `Ctrl+K` / `Cmd+K` (`cmdk`) and Light/Dark mode toggle.
- **Data Portability:** One-click CSV and multi-page PDF report exports.

---

## Tech Stack

- **Core:** React 18, TypeScript (`strict: true`), Vite
- **Data & Forms:** TanStack Query v5, React Hook Form, Zod
- **UI & Visualization:** Tailwind CSS, Radix UI primitives, `@dnd-kit/core`, `cmdk`, Recharts, Lucide, Sonner
- **Quality & CI:** Vitest, React Testing Library, ESLint, GitHub Actions, Netlify

---

## Engineering & Security Practices

- **Strict Client Validation & Safe Rendering:** All forms use Zod schemas via `react-hook-form`, external job posting URLs are protocol-checked (`http(s)` only), and an `ErrorBoundary` + `vite:preloadError` guard handle chunk updates gracefully.
- **Session & Network Resilience:** Centralized API client with `401` session-expiry handling and friendly offline/server-error recovery states (`QueryErrorState`).
- **Deployment Hardening:** `netlify.toml` enforces SPA fallback routing, `no-cache` on `index.html`, immutable asset caching, and HTTP security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`).
- **Automated Verification:** CI workflow runs TypeScript typechecking, ESLint, Vitest component/client tests, and production builds on every push.

---

## Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   Copy `.env.example` to `.env` if pointing to a local backend (defaults to the hosted API when omitted):
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```
   > **Note:** `VITE_API_URL` is a public client endpoint URL by design — authentication, rate limiting, CORS allowlists, password hashing, and database credentials are enforced on the separate Express + MongoDB backend service.

3. **Start dev server**
   ```bash
   npm run dev
   ```

4. **Verify**
   ```bash
   npm run typecheck
   npm run lint
   npm test
   npm run build
   ```

---

## Project Structure

```text
src/
  components/   # Pipeline UI (KanbanBoard, JobModal, CommandPalette, Navbar, ErrorBoundary, ProtectedRoute)
  contexts/     # AuthContext (401 expiry handling) & ThemeContext (light/dark)
  hooks/        # TanStack Query hooks (useJobs, useAnalytics, useReminders) & useDebounce
  lib/          # Centralized fetch client & utilities
  pages/        # Route pages (Index, Login, Register, Dashboard, JobDetails, Analytics, Reminders, Profile, NotFound)
  schemas/      # Zod validation schemas
  types/        # Shared TypeScript interfaces
  test/         # Vitest + React Testing Library suite
```
