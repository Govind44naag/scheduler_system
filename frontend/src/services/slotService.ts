import axios from 'axios';
import { CreateSlotData, UpdateSlotData, WeekSlots } from '../types';

// Support both development and production environments
const API_BASE_URL =  'http://localhost:5000/api/slots'
   

export class SlotService {
  static async createSlot(data: CreateSlotData) {
    const response = await axios.post(API_BASE_URL, data);
    return response.data;
  }

  static async getWeekSlots(startDate: Date): Promise<WeekSlots[]> {
    const response = await axios.get(`${API_BASE_URL}/week`, {
      params: { startDate: startDate.toISOString() }
    });
    
    // Convert date strings back to Date objects
    return response.data.map((day: any) => ({
      ...day,
      date: new Date(day.date)
    }));
  }

  static async updateSlot(slotId: string, data: UpdateSlotData) {
    const response = await axios.put(`${API_BASE_URL}/${slotId}`, data);
    return response.data;
  }

  static async deleteSlot(slotId: string, date: Date) {
    const response = await axios.delete(`${API_BASE_URL}/${slotId}`, {
      data: { date: date.toISOString() }
    });
    return response.data;
  }

  static async getAllSlots() {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  }

  static async deleteRecurringSlot(slotId: string) {
    await axios.delete(`${API_BASE_URL}/recurring/${slotId}`);
  }
}
