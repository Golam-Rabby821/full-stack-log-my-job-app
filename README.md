# LogMyJobs Web

A React + strict TypeScript frontend for managing job applications, interviews, follow-up reminders, and conversion analytics.

## Key Features
- **One-Click Live Demo:** Instant demo login with ~18 realistic seeded applications, notes, timelines, and reminders — plus a one-click **Reset** button.
- **List & Kanban Pipeline Views:** Drag-and-drop applications across stages (`Pending → Interview → Offer → Accepted → Declined`) with optimistic TanStack Query updates.
- **Command Palette (`Ctrl+K` / `Cmd+K`):** Quick keyboard navigation, theme switching, and account actions powered by `cmdk`.
- **Server-Side Filtering & Bulk Actions:** Debounced search, status/type/priority filtering, sorting, pagination, and multi-select bulk updates.
- **Follow-Up Reminders & Timeline:** Per-job notes, automatic status-change timelines, and reminders with mark-done / reopen controls.
- **Conversion Funnel Analytics:** Interview rate, offer rate, weekly application velocity, stale pending alerts, and interactive Recharts visualizations.
- **Data Export:** One-click CSV and formatted multi-page PDF report exports.

## Tech Stack
- **Framework:** React 18, TypeScript (`strict: true`), Vite
- **State & Caching:** TanStack Query v5 + React Context
- **Forms & Validation:** React Hook Form + Zod
- **UI & Drag-and-Drop:** Tailwind CSS, Radix UI primitives, `@dnd-kit/core`, `cmdk`, `recharts`, `sonner`
- **Testing & CI:** Vitest, React Testing Library, ESLint, GitHub Actions

## Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure API URL**
   Copy `.env.example` to `.env` (defaults to the hosted API if omitted):
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Verify typecheck, lint, tests, and production build**
   ```bash
   npm run typecheck
   npm run lint
   npm test
   npm run build
   ```

## Architecture
```text
src/
  components/   # Feature components (KanbanBoard, JobModal, CommandPalette, ProtectedRoute, ErrorBoundary)
  contexts/     # AuthContext (with 401 session expiry handling) & ThemeContext
  hooks/        # TanStack Query hooks (useJobs, useAnalytics, useReminders) & useDebounce
  lib/          # Centralized API client & utilities
  pages/        # Lazy-loaded route pages (Dashboard, Analytics, JobDetails, Reminders, Profile, Login, Register)
  schemas/      # Zod validation schemas for forms
  types/        # Shared TypeScript interfaces
  test/         # Vitest + React Testing Library test suite
```
