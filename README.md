# Scheduler System

A comprehensive scheduler system with recurring weekly slots that supports creating, updating, deleting, and managing slots while handling modifications as exceptions to the recurring pattern.

## Features

- **Recurring Slots**: Create slots that automatically replicate for all upcoming weeks
- **Exception Handling**: Edit or delete specific dates without affecting the recurring pattern
- **Weekly View**: Navigate between weeks with infinite scroll capability
- **Slot Management**: Maximum 2 slots per day with full CRUD operations
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + TypeScript + Express
- **Database**: PostgreSQL (via node-postgres `pg`) with Knex
- **API**: RESTful API with proper error handling

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL 13+  
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Environment Setup

Copy the environment file and configure your PostgreSQL connection:

```bash
cd backend
cp env.example .env
```

Edit `.env` with your Postgres connection string:
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/scheduler
PORT=5000
NODE_ENV=development
```

### 3. Start Development Servers

```bash
npm run dev
```

This will start both frontend (port 3000) and backend (port 5000) servers concurrently.

## API Endpoints

### Slots

- `POST /api/slots` - Create a new recurring slot
- `GET /api/slots/week?startDate=...` - Get slots for a specific week
- `PUT /api/slots/:id` - Update a slot (creates exception)
- `DELETE /api/slots/:id` - Delete a slot for a specific date (creates exception)
- `GET /api/slots` - Get all slots
- `DELETE /api/slots/recurring/:id` - Delete a recurring slot completely

## Database Schema

The scheduler uses two tables:

```sql
-- Recurring slots definition
CREATE TABLE IF NOT EXISTS slots (
  id SERIAL PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  recurring_start_date DATE NOT NULL,
  recurring_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Date-specific overrides and deletions
CREATE TABLE IF NOT EXISTS slot_exceptions (
  id SERIAL PRIMARY KEY,
  slot_id INTEGER NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_deleted BOOLEAN DEFAULT FALSE,
  UNIQUE(slot_id, date)
);
```

## Key Features Explained

### Recurring Logic
- Slots are created for a specific day of the week
- The system automatically generates instances for all future dates
- Each day can have up to 2 slots maximum

### Exception Handling
- **Updates**: Modify start/end times for specific dates
- **Deletions**: Hide slots for specific dates without affecting the pattern
- **Pattern Preservation**: The original recurring schedule remains intact

### Week Navigation
- Navigate between weeks using Previous/Next buttons
- Each week shows 7 days with their respective slots
- Exception slots are visually distinguished from regular slots

## Development

### Backend Development

```bash
cd backend
npm run migrate
npm run dev          # Start with hot reload
npm run build        # Build for production
npm start           # Start production build
```

### Frontend Development

```bash
cd frontend
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

## Production Deployment

Deploy the backend to any Node hosting and provision a PostgreSQL database (e.g., Render, Railway, Fly.io, Supabase, Neon). Set `DATABASE_URL` accordingly. Deploy the frontend to Netlify/Vercel and point it to your backend URL.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request