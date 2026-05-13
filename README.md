# Singgah

Web app untuk mendokumentasikan tempat dan makanan yang dikunjungi.

## Features

- 📍 Simpan tempat yang dikunjungi (Makanan, Wisata, Hotel)
- ⭐ Review dengan rating 1-5 dan deskripsi
- 📸 Upload foto (auto-compress ke 500KB)
- 🗂️ Filter berdasarkan kategori
- 📋 Copy review ke Google Maps dengan satu klik
- 🔐 Login dengan Google OAuth

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- NextAuth.js
- TanStack Query
- shadcn/ui

**Backend:**
- .NET 10 Web API
- Entity Framework Core
- PostgreSQL
- AWS S3 (photo storage)

**Infrastructure:**
- Frontend: Vercel
- Backend: AWS EC2 (t2.micro)
- Database: AWS RDS PostgreSQL (db.t3.micro)
- Storage: AWS S3

## Project Structure

```
singgah/
├── frontend/          # Next.js 14 app
├── backend/           # .NET 8 Web API
└── README.md
```

## Development

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
dotnet restore
dotnet run
```

## Environment Variables

### Frontend (.env.local)
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (appsettings.Development.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your-postgresql-connection-string"
  },
  "AWS": {
    "Region": "ap-southeast-1",
    "S3BucketName": "singgah-photos"
  },
  "JWT": {
    "Secret": "your-jwt-secret",
    "Issuer": "Singgah.API",
    "Audience": "Singgah.Client"
  }
}
```

## License

MIT
