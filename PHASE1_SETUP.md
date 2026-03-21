# PHASE 1: Project Setup - Quick Start Guide

## 📋 Overview

Phase 1 sets up the complete project structure with:
- React + Vite frontend
- Express.js backend
- PostgreSQL database
- Development environment

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies

```powershell
cd o:\ai-customer-agent
npm install
```

This installs the root dependencies needed to run both frontend and backend concurrently.

### Step 2: Setup PostgreSQL

**Option A: Already have PostgreSQL installed?**

```powershell
# Create the database
createdb -U postgres ai_customer_agent_db

# Load the schema
psql -U postgres -d ai_customer_agent_db -f backend/db/schema.sql
```

**Option B: Need to install PostgreSQL first?**
- Download from: https://www.postgresql.org/download/
- Install with default settings (user: postgres, password: postgres)
- Then run the commands in Option A

### Step 3: Configure Environment

```powershell
# Copy example to .env
Copy-Item .env.example .env

# The defaults should work if PostgreSQL is running locally
```

### Step 4: Start Development Servers

```powershell
npm run dev
```

You should see:
```
✅ Backend server running on http://localhost:5000
✅ Frontend running on http://localhost:5173
```

## ✅ Verify Everything Works

### 1. Open Browser to Frontend

```
http://localhost:5173
```

You should see:
- "AI Customer Support Agent" heading
- "System Status" section with three items

### 2. Check Status Indicators

All three should show ✅ and green color:
- Frontend: ✅ Running
- Backend API: ✅ Connected
- PostgreSQL Database: ✅ Connected

### 3. Test Backend API (optional)

Open a new PowerShell terminal:

```powershell
# Test health endpoint
curl http://localhost:5000/health

# Test database connection
curl http://localhost:5000/health/db
```

Both should return JSON responses with no errors.

## 🧪 Success Criteria

Phase 1 is complete when:

- ✅ `npm run dev` starts without errors
- ✅ Frontend loads at http://localhost:5173
- ✅ Backend responds at http://localhost:5000
- ✅ Database connection verified (green indicator)
- ✅ No console errors

## 📂 What Was Created

```
frontend/
  ├── src/pages/Home.jsx          # Status page
  ├── src/App.jsx                 # Main app component
  ├── vite.config.js              # Vite configuration
  └── package.json                # Dependencies

backend/
  ├── server.js                   # Express server
  ├── config/database.js          # PostgreSQL connection
  ├── routes/auth.js              # Auth routes (placeholder)
  ├── utils/logger.js             # Logging utilities
  └── db/schema.sql               # Database schema

.env                              # Environment variables
README.md                         # Full documentation
```

## 🔧 Troubleshooting

### "Cannot find module" errors

```powershell
# Clear and reinstall
rm -r node_modules
rm -r frontend/node_modules
rm -r backend/node_modules
npm install
```

### PostgreSQL connection failed

Check these:
1. PostgreSQL is running:
   ```powershell
   psql -U postgres -c "SELECT version();"
   ```

2. Database exists:
   ```powershell
   psql -U postgres -lqt | findstr ai_customer_agent_db
   ```

3. Credentials in .env match your PostgreSQL setup

### Port already in use

Kill the process:
```powershell
# Kill process on port 5000 (backend)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Kill process on port 5173 (frontend)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

## 🎯 Next Phase

Once you confirm Phase 1 is working, say:

```
START PHASE 2
```

Phase 2 will add:
- Google OAuth authentication
- Login/logout functionality
- Protected routes
- User session management

---

**Time to complete**: ~10 minutes including PostgreSQL setup

**Status**: Ready for development ✅
