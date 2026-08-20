# ☁️ POSEHANUM — Backend Sync & Cloud Architecture

**Audit Date**: August 2026  
**Auditor**: Senior Lead Mobile, AI & Systems Engineer  
**Component**: `backend/` & `src/features/templates/services/CloudTemplateRepository.ts`

---

## 1. REST API Endpoints

Mounted under `/api/templates`:

- `GET /api/templates`: Feed discovery with pagination (`page`, `limit`), search query, and category filtering.
- `GET /api/templates/trending`: Top 10 trending templates ranked by usage, likes, and velocity.
- `GET /api/templates/:id`: Full template detail by ID.
- `POST /api/templates`: Create and publish template with creator authentication.
- `PUT /api/templates/:id`: Owner-restricted edit.
- `DELETE /api/templates/:id`: Owner-restricted delete.
- `POST /api/templates/:id/like`: Atomically increment likes count.
- `POST /api/templates/:id/use`: Record template usage and update trend score.
- `POST /api/templates/:id/remix`: Record template remix and update trend score.
- `POST /api/templates/:id/report`: Submit report to moderation review queue.

---

## 2. Local-First Offline Resilience

- When device is offline, creations, favorites, and attempts are stored immediately in MMKV and SQLite.
- Background [`syncWorker.ts`](file:///f:/snappose/src/services/api/syncWorker.ts) retries queued mutations with exponential backoff upon network restoration.
