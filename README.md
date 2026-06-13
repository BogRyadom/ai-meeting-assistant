# AI Meeting Assistant

A full-stack portfolio project that turns raw meeting transcripts into structured intelligence — automatic summaries, extracted action items, and a Q&A interface powered by a large language model.

![Stack](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Stack](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)
![Stack](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase)
![Stack](https://img.shields.io/badge/LLM-Groq%20llama--3.3--70b-F55036?style=flat-square)

---

## What it does

Upload a meeting transcript — paste it as text or upload a `.txt` file. The app sends it to a Groq-hosted LLaMA 3.3 70B model which:

- Writes a concise **summary** of what was discussed
- Extracts **action items** with optional assignee and due date
- Answers **follow-up questions** about the meeting in a chat-style interface

All meetings are stored in a PostgreSQL database (Supabase) and are searchable by title and content.

---

## Tech stack

### Backend
| Layer | Technology |
|---|---|
| Framework | FastAPI (Python) |
| Database | PostgreSQL via Supabase + asyncpg |
| AI / LLM | Groq API — `llama-3.3-70b-versatile` |
| Search | PostgreSQL full-text search |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (no UI library dependencies) |

---

## Project structure

```
.
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── routers/
│   │   └── meetings.py         # GET/POST /api/meetings, GET/DELETE/ASK /api/meetings/{id}
│   ├── services/
│   │   ├── ai_service.py       # Groq integration: summary, action items, Q&A
│   │   └── meeting_service.py  # CRUD + full-text search via asyncpg
│   └── models/                 # Pydantic schemas
│
└── frontend/
    └── src/
        ├── app/
        │   ├── page.tsx                  # Home: meeting list + search
        │   ├── new/page.tsx              # New meeting form
        │   └── meetings/[id]/page.tsx    # Meeting detail + Q&A
        ├── components/
        │   ├── MeetingCard.tsx
        │   ├── MeetingDetail.tsx
        │   ├── ActionItemCard.tsx
        │   ├── QABlock.tsx               # Chat-style Q&A interface
        │   ├── NewMeetingForm.tsx
        │   ├── SearchBar.tsx
        │   ├── EmptyState.tsx
        │   ├── LoadingSpinner.tsx
        │   └── ErrorMessage.tsx
        ├── lib/api.ts                    # Typed API client
        └── types/meeting.ts             # Shared TypeScript interfaces
```

---

## API reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/meetings` | List all meetings. Accepts `?search=` query param |
| `POST` | `/api/meetings` | Create a meeting. Multipart form: `title` + `transcript` or `file` |
| `GET` | `/api/meetings/{id}` | Retrieve a single meeting with full data |
| `DELETE` | `/api/meetings/{id}` | Delete a meeting |
| `POST` | `/api/meetings/{id}/ask` | Ask a question. Body: `{ "question": "..." }` → `{ "answer": "..." }` |

Interactive docs available at `http://localhost:8000/docs` when running locally.

---

## Running locally

### Prerequisites

- Python 3.11+
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Groq](https://console.groq.com) API key (free tier works)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env
cp .env.example .env
# Fill in: DATABASE_URL, GROQ_API_KEY

# Run database migration
python migrate.py

# Start server
uvicorn main:app --reload
# → http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

npm run dev
# → http://localhost:3000
```

---

## Deployment

The project is structured for a split deployment:

- **Backend → Railway** — connects to the Supabase PostgreSQL instance, exposes the FastAPI app
- **Frontend → Vercel** — set `NEXT_PUBLIC_API_URL` to the Railway backend URL in the project environment variables

No extra configuration is required beyond environment variables.

---

## Key implementation details

**AI pipeline** — each transcript goes through two sequential Groq calls on creation: one for the summary, one for action item extraction (structured JSON output). Q&A is a single call with the full transcript injected as context.

**Async throughout** — the backend uses `asyncpg` directly (no ORM) for non-blocking database access, keeping the FastAPI app fully async from request to database.

**Full-text search** — implemented with PostgreSQL's native `tsvector` / `tsquery`, indexed on title and transcript columns. No external search service needed.

**Frontend data flow** — all pages are client components with explicit loading, error, and empty states. The Q&A block maintains conversation history in local React state. Deletes are optimistic — the card disappears immediately and the API call happens in the background.

---

## License

MIT
