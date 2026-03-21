<<<<<<< HEAD
# AI Customer Support Agent - RAG System

A complete AI-powered customer support agent with Retrieval-Augmented Generation (RAG) capabilities.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Express.js (Node.js)
- **Database**: PostgreSQL
- **Vector DB**: pgvector
- **Auth**: Google OAuth 2.0 (Phase 2)
- **AI API**: OpenRouter (Phase 6+)

## Project Structure

ai-customer-agent/
├── frontend/                # React + Vite application
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components (phases 2+)
│   │   ├── hooks/          # Custom React hooks (phases 2+)
│   │   ├── context/        # Context providers (phases 2+)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/                 # Express API
│   ├── config/             # Configuration files
│   │   └── database.js
│   ├── routes/             # API routes
│   ├── db/                 # Database schemas and migrations
│   │   └── schema.sql
│   ├── utils/              # Utility functions
│   ├── server.js
│   └── package.json
├── .env.example            # Environment variables template
├── .gitignore
├── package.json            # Root package for managing both apps
└── README.md
```

## Prerequisites

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 12
- **npm** or **yarn**

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd ai-customer-agent
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 2. Setup PostgreSQL Database

#### Option A: Using PostgreSQL GUI (pgAdmin)

1. Open pgAdmin and connect to your PostgreSQL server
2. Create a new database named `ai_customer_agent_db`
3. Open the Query Tool and paste the contents of `backend/db/schema.sql`
4. Execute the SQL script

#### Option B: Using Command Line

```bash
# Create database
createdb -U postgres ai_customer_agent_db

# Load schema
psql -U postgres -d ai_customer_agent_db -f backend/db/schema.sql
```

### 3. Configure Environment Variables

# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_customer_agent_db
```

### 4. Start Development Servers

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately:
npm run frontend    # Terminal 1
npm run backend     # Terminal 2
```

## Testing Phase 1 (Project Setup)

### ✅ Success Checklist

- [ ] Frontend loads at `http://localhost:5173`
- [ ] Backend API responds at `http://localhost:5000`
- [ ] Database connection verified
- [ ] System Status page shows all green ✅

### 📋 Testing Steps

1. **Start the development servers:**
   ```bash
   npm run dev
   ```

2. **Open browser and navigate to:**
   ```
   http://localhost:5173
   ```
   - All three statuses should show green checkmarks:
     - ✅ Frontend (React + Vite) running
     - ✅ Backend (Express) setup
     - ✅ PostgreSQL connection configured

4. **Test API Directly:**
   ```bash
   # In another terminal
   curl http://localhost:5000/health
   # Expected output: {"status":"Backend API is running"}
   
   curl http://localhost:5000/health/db
   # Expected output: {"status":"Database connected","type":"PostgreSQL"}
   ```

## Available Scripts

### Root Level
```bash
npm run dev           # Run frontend + backend concurrently
npm run frontend      # Run frontend only
npm run backend       # Run backend only
npm run build         # Build both frontend and backend
npm start             # Start production backend
```

### Frontend Only
```bash
cd frontend
npm run dev           # Start Vite dev server
npm run build         # Build for production
npm run preview       # Preview production build
```

### Backend Only
```bash
cd backend
npm run dev           # Start with auto-reload
npm run start         # Start production server
```

## Environment Variables Reference

```env
# PostgreSQL Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/ai_customer_agent_db
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ai_customer_agent_db

# Backend Configuration
BACKEND_PORT=5000
NODE_ENV=development

# Frontend Configuration
VITE_API_URL=http://localhost:5000

# Phase 2: Google OAuth (coming soon)
# GOOGLE_CLIENT_ID=your-client-id-here
# GOOGLE_CLIENT_SECRET=your-client-secret-here

# Phase 6: OpenRouter API (coming soon)
# OPENROUTER_API_KEY=your-api-key-here

# Phase 7: OpenAI Embeddings (coming soon)
# OPENAI_API_KEY=your-api-key-here
```

## Troubleshooting

### PostgreSQL Connection Error

**Error:** `ECONNREFUSED 127.0.0.1:5432`

**Solution:**
1. Ensure PostgreSQL is running:
   - Windows: Check Services or StartUp folder
   - Mac: `brew services start postgresql`
   - Linux: `sudo systemctl start postgresql`
2. Verify credentials in `.env` file
3. Ensure database `ai_customer_agent_db` exists

### Port Already in Use

**Frontend (5173):**
```bash
# Kill process or use different port in vite.config.js
lsof -ti:5173 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :5173   # Windows (find PID and kill it)
```

**Backend (5000):**
```bash
# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
```

### Hot Reload Not Working

- Restart the development server
- Clear node_modules and reinstall: `npm ci`
- Check firewall settings

## Next Phase: Phase 2 - Google Authentication

Once Phase 1 is confirmed working, the next phase will implement:
- Google OAuth 2.0 login/logout
- User authentication
- Protected API routes
- Session management

---

**Status**: ✅ Phase 1 Complete (Ready for Phase 2)

**Last Updated**: March 20, 2026
=======
# Ai-customer-support-agent
>>>>>>> f6cf17d19b78756fa04d7dcddd46d6220645b5b1
