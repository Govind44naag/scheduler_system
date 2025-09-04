import { query } from './config/database';

const migrate = async () => {
  await query(`CREATE TABLE IF NOT EXISTS slots (
    id SERIAL PRIMARY KEY,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    recurring_start_date DATE NOT NULL,
    recurring_end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`);

  await query(`CREATE TABLE IF NOT EXISTS slot_exceptions (
    id SERIAL PRIMARY KEY,
    slot_id INTEGER NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(slot_id, date)
  );`);

  // helpful indexes
  await query(`CREATE INDEX IF NOT EXISTS idx_slots_dow_start ON slots(day_of_week, recurring_start_date);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_slot_exceptions_date ON slot_exceptions(date);`);

  console.log('Migration completed');
  process.exit(0);
};

migrate().catch((e) => {
  console.error('Migration failed', e);
  process.exit(1);
});


