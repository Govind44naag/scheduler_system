import { db } from '../config/database';

export interface CreateSlotData {
  dayOfWeek: number;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  recurringStartDate: Date;
  recurringEndDate?: Date;
}

export interface UpdateSlotData {
  startTime?: string; // HH:MM
  endTime?: string;   // HH:MM
  date: Date;
}

export interface WeekSlots {
  date: Date;
  slots: Array<{
    id: string;
    startTime: string;
    endTime: string;
    isException: boolean;
  }>;
}

export class SlotService {
  static async createSlot(data: CreateSlotData) {
    const { dayOfWeek, startTime, endTime, recurringStartDate, recurringEndDate } = data;

    const existing = await db('slots').where({ day_of_week: dayOfWeek });
    if (existing.length >= 2) {
      throw new Error('Maximum 2 slots allowed per day');
    }

    const [slot] = await db('slots')
      .insert({
        day_of_week: dayOfWeek,
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`,
        recurring_start_date: recurringStartDate.toISOString().slice(0, 10),
        recurring_end_date: recurringEndDate ? recurringEndDate.toISOString().slice(0, 10) : null
      })
      .returning('*');

    return slot;
  }

  static async getWeekSlots(startDate: Date): Promise<WeekSlots[]> {
    const weekSlots: WeekSlots[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dayOfWeek = currentDate.getDay();
      const dateStr = currentDate.toISOString().slice(0, 10);

      const recurring = await db('slots')
        .where('day_of_week', dayOfWeek)
        .andWhere('recurring_start_date', '<=', dateStr)
        .andWhere((qb) => {
          qb.whereNull('recurring_end_date').orWhere('recurring_end_date', '>=', dateStr);
        })
        .orderBy('start_time', 'asc');

      const slotsForDay: WeekSlots['slots'] = [];

      for (const slot of recurring) {
        const exc = await db('slot_exceptions')
          .where({ slot_id: slot.id, date: dateStr })
          .first();

        if (exc && exc.is_deleted) continue;

        if (exc) {
          slotsForDay.push({
            id: String(slot.id),
            startTime: (exc.start_time || slot.start_time).slice(0, 5),
            endTime: (exc.end_time || slot.end_time).slice(0, 5),
            isException: true
          });
        } else {
          slotsForDay.push({
            id: String(slot.id),
            startTime: slot.start_time.slice(0, 5),
            endTime: slot.end_time.slice(0, 5),
            isException: false
          });
        }
      }

      weekSlots.push({ date: currentDate, slots: slotsForDay.slice(0, 2) });
    }

    return weekSlots;
  }

  static async updateSlot(slotId: string, data: UpdateSlotData) {
    const dateStr = data.date.toISOString().slice(0, 10);

    const existing = await db('slot_exceptions').where({ slot_id: slotId, date: dateStr }).first();

    if (existing) {
      await db('slot_exceptions')
        .update({
          start_time: data.startTime ? `${data.startTime}:00` : existing.start_time,
          end_time: data.endTime ? `${data.endTime}:00` : existing.end_time
        })
        .where({ slot_id: slotId, date: dateStr });
    } else {
      await db('slot_exceptions').insert({
        slot_id: slotId,
        date: dateStr,
        start_time: data.startTime ? `${data.startTime}:00` : null,
        end_time: data.endTime ? `${data.endTime}:00` : null,
        is_deleted: false
      });
    }

    return await db('slot_exceptions').where({ slot_id: slotId, date: dateStr }).first();
  }

  static async deleteSlot(slotId: string, date: Date) {
    const dateStr = date.toISOString().slice(0, 10);

    const existing = await db('slot_exceptions').where({ slot_id: slotId, date: dateStr }).first();

    if (existing) {
      await db('slot_exceptions').update({ is_deleted: true }).where({ slot_id: slotId, date: dateStr });
    } else {
      await db('slot_exceptions').insert({ slot_id: slotId, date: dateStr, is_deleted: true });
    }

    return { success: true };
  }

  static async getAllSlots() {
    return await db('slots').select('*').orderBy([{ column: 'day_of_week', order: 'asc' }, { column: 'start_time', order: 'asc' }]);
  }

  static async deleteRecurringSlot(slotId: string): Promise<void> {
    const affected = await db('slots').where({ id: slotId }).delete();
    if (!affected) throw new Error('Slot not found');
  }
}
