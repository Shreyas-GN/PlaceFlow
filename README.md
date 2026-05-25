# PlaceFlow

> Streamlining Campus Placements — A modern placement coordination platform.

PlaceFlow replaces fragmented recruitment workflows (spreadsheets, WhatsApp groups, manual eligibility checks) with a unified, production-grade SaaS platform. Built for students and placement coordinators.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | Next.js | 16.2.6 |
| **UI** | React / TypeScript | 19.2.4 / ^5 |
| **Styling** | Tailwind CSS | v4 |
| **Components** | shadcn/ui (Radix) | latest |
| **Animation** | Framer Motion | 12.40.0 |
| **State** | Zustand | 5.0.13 |
| **Icons** | Lucide | 1.16.0 |
| **Backend** | FastAPI (Python 3.11) | 0.111.0 |
| **Server** | Uvicorn | 0.30.1 |
| **Database** | PostgreSQL | via SQLAlchemy 2.0 |
| **Migrations** | Alembic | 1.18.4 |
| **Auth** | JWT (python-jose) + Supabase Auth | — |
| **Task Queue** | Celery + Redis | 5.4.0 |
| **Infra** | Docker + Nginx | — |

---

## Features

### Student
- JWT-authenticated dashboard
- Automatic eligibility filtering (CGPA, department)
- One-click application submission
- Real-time application tracking with status badges
- Notification feed for status changes
- Profile & settings management

### Admin / Placement Coordinator
- Placement drive creation & management
- Applicant pipeline with inline status updates
- Dashboard analytics (total applicants, placements, pending reviews)
- Operational directives checklist
- Full CRUD for companies & drives

### Platform
- Dark-mode-first UI with consistent design system
- Responsive layout (mobile sidebar, adaptive grids)
- Framer Motion animations (page transitions, skeleton loaders, hover states)
- Sonner toast notifications
- Shimmer skeleton loading states

---

## Architecture

```
Internet
   ↓
Nginx Reverse Proxy
   ↓
Next.js Frontend (Port 3000)
   ↓
FastAPI Backend (Port 8000)
   ↓
PostgreSQL Database
```

All services are containerized with Docker Compose for production deployment.

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL
- Docker (optional, for production)

### Local Development

**1. Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate   # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
# Ensure PostgreSQL is running and DATABASE_URL is set
uvicorn app.main:app --reload --port 8000
```

**2. Frontend**
```bash
cd frontend
cp .env.local.example .env.local   # or set NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev
```

**3. Open** [http://localhost:3000](http://localhost:3000)

### Docker (Production)
```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

---

## Project Structure

```
PlaceFlow/
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   ├── db/           # Database session & config
│   │   └── main.py       # FastAPI entry
│   ├── alembic/          # Migrations
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js App Router
│   │   ├── components/   # Shared components
│   │   ├── lib/          # Utilities
│   │   ├── services/     # API service layer
│   │   ├── store/        # Zustand stores
│   │   └── middleware.ts
│   └── package.json
├── nginx/
│   └── nginx.conf
├── docs/                 # Documentation
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## API Overview

| Endpoint | Description |
|---|---|
| `POST /auth/login` | Student login |
| `POST /auth/register` | Student registration |
| `GET /auth/me` | Current student profile |
| `GET /companies/eligible` | Eligible companies for student |
| `POST /applications/apply/{company_id}` | Apply to a company |
| `GET /applications` | Student's applications |
| `GET /notifications` | Student notifications |
| `POST /admin/login` | Admin login |
| `POST /admin/companies` | Create a placement drive |
| `GET /admin/applications` | All applications (admin) |
| `PATCH /admin/applications/{id}/status` | Update application status |

---

## Deployment

- **Frontend**: Next.js standalone (Docker)
- **Backend**: FastAPI + Uvicorn (Docker)
- **Database**: Supabase PostgreSQL (hosted)
- **Proxy**: Nginx (SSL, gzip, reverse proxy)
- **Hosting**: AWS EC2

---

## Screenshots

<!-- Add screenshots here once captured -->
| Student Dashboard | Admin Dashboard |
|---|---|

---

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for component primitives
- [Framer Motion](https://www.framer.com/motion/) for animation library
- [Lucide](https://lucide.dev/) for icons
- [Sonner](https://sonner.emilkowal.ski/) for toasts
