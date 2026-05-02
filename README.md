# LogMyJobs Frontend

A React + TypeScript frontend for managing job applications, interviews, and follow-ups.

## Overview

This repository contains the **frontend application only**.
The backend API is maintained in a **separate repository/folder** and is not included here.

## Core Features

- Authentication: register, login, profile update, password update, account deletion
- Job management: create, read, update, delete applications
- Job organization: filter, search, sort, and paginate records
- Collaboration context: notes and timeline per job
- Follow-up workflow: reminder creation and tracking
- Analytics views: overview, trends, and monthly breakdown
- Data export: CSV and PDF

## Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui + Radix UI
- TanStack Query
- React Router

## Project Scope

- Frontend: `react-jobs-app-main` (this repository)
- Backend: separate repository/folder (required for full local development)

## API Configuration

API integration is centralized in `src/lib/api.ts`.

Current base URL:

```ts
const API_BASE_URL = 'https://jobs-api-03hd.onrender.com/api/v1';
```

For local full-stack development, update this value to your backend service URL from the separate backend project.

## Local Development

### Prerequisites

- Node.js 18+
- npm 9+

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build production assets
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks

## Source Structure

```text
src/
  components/   # Reusable UI and feature components
  contexts/     # React context providers
  hooks/        # Custom hooks
  lib/          # API client and utilities
  pages/        # Route-level pages
  types/        # Shared TypeScript interfaces/types
```

## Deployment

Build output is generated in `dist/` and can be deployed to any static hosting platform (e.g., Vercel, Netlify, Cloudflare Pages, GitHub Pages).

Ensure the deployed frontend has network access to the backend API and correct CORS configuration.

## Portfolio / Reviewer Note

This repository demonstrates frontend architecture, UI, and client-side logic.
Backend implementation is external and must be run or deployed independently.
