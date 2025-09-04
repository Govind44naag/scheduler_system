export interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  isException: boolean;
}

export interface WeekSlots {
  date: Date;
  slots: Slot[];
}

export interface CreateSlotData {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  recurringStartDate: Date;
  recurringEndDate?: Date;
}

export interface UpdateSlotData {
  startTime?: string;
  endTime?: string;
  date: Date;
}

export interface DayOfWeek {
  value: number;
  label: string;
}
