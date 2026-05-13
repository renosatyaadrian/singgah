# Singgah — Place & Food Visit History Web App

## Overview

Web app untuk mendokumentasikan tempat/makanan yang dikunjungi.
1 review per tempat (editable), 1 foto (auto-compress 500KB),
filter kategori, copy review ke Google Maps.

**Stack:**
- Frontend : Next.js 14 (Vercel)
- Backend  : .NET 10 Web API (AWS EC2 t2.micro, ap-southeast-1)
- Database : AWS RDS PostgreSQL (db.t3.micro)
- Storage  : AWS S3 bucket singgah-photos
- Auth     : Google OAuth + JWT httpOnly cookie via NextAuth.js
- Repo     : D:\Code\singgah\

---

## Phase 0 — Repo Setup

1. Buat D:\Code\singgah\ → subfolder frontend/, backend/
2. git init, .gitignore (Node + .NET + .env*), README.md
3. Buat GitHub repo "singgah", set remote, push initial commit

---

## Phase 1 — Project Init & AWS

4. Init Next.js 14:
   npx create-next-app@latest frontend --typescript --tailwind --app --src-dir
   (parallel step 5)

5. Init .NET 10 Web API:
   dotnet new webapi -n Singgah.API
   Buat folder: Controllers/ Services/ Repositories/ Models/ DTOs/
   (parallel step 4)

6. Setup AWS (ap-southeast-1):
   - RDS: PostgreSQL db.t3.micro, 20GB, automated backups on
   - S3 : bucket singgah-photos, block public access
   - EC2: t2.micro Ubuntu 22.04, SG port 22/80/443/5000

7. Google Cloud Console: OAuth 2.0 credentials,
   whitelist http://localhost:3000 + Vercel domain

8. Connect repo ke Vercel, root = frontend/, auto-deploy dari main

---

## Phase 2 — Backend (.NET 8)

### NuGet Packages
- Npgsql.EntityFrameworkCore.PostgreSQL
- AWSSDK.S3
- Google.Apis.Auth
- Microsoft.AspNetCore.Authentication.JwtBearer
- AspNetCoreRateLimit

### Database Schema (EF Core)

Users
  id UUID PK | google_id unique | email | name | avatar_url? | created_at | updated_at

Places
  id UUID PK | user_id FK→Users | name | category enum(Food/TouristSpot/Hotel)
  gmaps_url | created_at | updated_at

Reviews
  id UUID PK | place_id FK | user_id FK | rating int(1-5) | description
  visited_at date? | created_at | updated_at
  UNIQUE CONSTRAINT: (place_id, user_id)

Photos
  id UUID PK | review_id FK | s3_key | s3_url | order_index int default 0 | created_at
  NOTE: max 1 foto saat ini (validasi backend), schema siap multi-foto nanti

### Endpoints

Auth
  POST /api/auth/google
    → validasi Google ID token via GoogleJsonWebSignature.ValidateAsync()
    → upsert user ke DB
    → return JWT httpOnly cookie

Places
  GET    /api/places          filter: category, search, page, pageSize; scoped user_id
  POST   /api/places
  GET    /api/places/{id}     detail + review milik user
  PUT    /api/places/{id}
  DELETE /api/places/{id}     cascade delete review + foto (S3 + DB)

Reviews
  GET    /api/places/{placeId}/reviews   return single atau 404
  POST   /api/places/{placeId}/reviews   409 jika sudah ada
  PUT    /api/reviews/{id}               edit rating, description, visited_at
  DELETE /api/reviews/{id}

Photos
  POST   /api/photos/presigned-url   validasi max 1; return presigned PUT URL + s3_key (expire 10 menit)
  POST   /api/photos/confirm         simpan ke DB setelah upload S3 berhasil
  DELETE /api/photos/{id}            hapus S3 + DB

Middleware
  - JWT auth
  - CORS: Vercel domain + localhost:3000
  - Global exception → ProblemDetails
  - Rate limit: auth max 10 req/mnt/IP | photos max 20 req/mnt/IP

---

## Phase 3 — Frontend (Next.js 14)

### Install
npm install next-auth @tanstack/react-query axios react-hook-form zod lucide-react browser-image-compression
npx shadcn-ui@latest init

### Auth (frontend/lib/auth.ts)
NextAuth Google Provider.
jwt callback: POST Google id_token ke /api/auth/google → simpan app JWT ke session.

### Routing
app/
├── (auth)/login/page.tsx           ← "Masuk dengan Google"
└── (app)/
    ├── layout.tsx                  ← navbar + auth guard
    ├── page.tsx                    ← Dashboard
    └── places/
        ├── new/page.tsx
        └── [id]/
            ├── page.tsx            ← detail + ReviewCard
            ├── edit/page.tsx
            └── reviews/
                ├── new/page.tsx
                └── edit/page.tsx

### Komponen

PlaceCard
  nama, badge kategori (merah=Food/hijau=TouristSpot/biru=Hotel), bintang, thumbnail

CategoryFilter
  pill tabs: All / Makanan / Wisata / Hotel
  state via URL ?category= (SSR-friendly)

StarRatingPicker
  mode interaktif (click 1-5) + read-only

PhotoUploader
  1 slot upload
  jika > 500KB → auto-compress via browser-image-compression
  flow: presigned-url → PUT S3 → confirm backend
  preview + progress indicator

ReviewCard
  bintang, deskripsi, tanggal, foto, tombol Edit, CopyToGMapsButton

CopyToGMapsButton
  format: "{description}\n\nRating: ⭐{rating}/5\nDikunjungi: {visited_at}"
  navigator.clipboard.writeText(formattedReview)
  window.open(gmaps_url, '_blank')
  toast: "Review disalin! Tinggal paste di Google Maps 📋"

### TanStack Query Hooks (frontend/hooks/)
usePlaces, usePlace, useReview, usePhotos
semua mutation dengan optimistic updates

---

## Phase 4 — Deployment

21. backend/Dockerfile multi-stage: sdk:10.0 build → aspnet:10.0 runtime
22. EC2: Docker + Nginx reverse proxy port 5000 + SSL Certbot
23. S3 CORS policy: allow PUT dari Vercel domain
24. Vercel env vars:
    NEXTAUTH_URL, NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_API_URL

---

## Verification Checklist

- [ ] Login Google → user di DB → JWT cookie → dashboard
- [ ] Tambah place tiap kategori → filter ?category= bekerja
- [ ] Upload foto > 500KB → auto-compress → S3 → tampil
- [ ] Upload foto kedua → backend 400
- [ ] Review kedua untuk tempat sama → backend 409
- [ ] Copy & Buka GMaps → clipboard terisi → GMaps terbuka
- [ ] Edit review → tersimpan
- [ ] Delete place → cascade delete S3 + DB
- [ ] Tanpa login → redirect /login
- [ ] Rate limit auth > 10x/mnt → 429

---

## Decisions

| Item              | Keputusan                                          |
|-------------------|----------------------------------------------------|
| Nama app          | Singgah                                            |
| Project path      | D:\Code\singgah\                                   |
| Review per tempat | 1 per user, editable, unique(place_id, user_id)    |
| Foto per review   | 1 saat ini, schema siap multi via order_index      |
| Ukuran foto       | Max 500KB, auto-compress di client                 |
| Auth              | JWT httpOnly cookie via NextAuth                   |
| Copy-to-GMaps     | Clipboard + window.open() saja                     |
| Infra             | Full AWS 12 bulan free tier                        |

## Migration Path (setelah 12 bulan free tier)
- RDS → Neon/Supabase : pg_dump + pg_restore + update connection string
- EC2 → Hostinger VPS : copy Docker + Nginx config
- Frontend Vercel     : tetap (gratis permanen)