export interface SlotRecord {
  id: number;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  recurring_start_date: string; // YYYY-MM-DD
  recurring_end_date?: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export interface SlotExceptionRecord {
  id: number;
  slot_id: number;
  date: string; // YYYY-MM-DD
  start_time?: string; // HH:MM:SS
  end_time?: string; // HH:MM:SS
  is_deleted: boolean;
}
