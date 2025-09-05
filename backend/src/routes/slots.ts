import express from 'express';
import { SlotService } from '../services/slotService';

const router = express.Router();

// Create a new recurring slot
router.post('/', async (req, res) => {
  try {
    const { dayOfWeek, startTime, endTime, recurringStartDate, recurringEndDate } = req.body;

    // Validation
    if (!dayOfWeek || !startTime || !endTime || !recurringStartDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return res.status(400).json({ error: 'Invalid day of week' });
    }

    if (startTime >= endTime) {
      return res.status(400).json({ error: 'Start time must be before end time' });
    }

    const slot = await SlotService.createSlot({
      dayOfWeek,
      startTime,
      endTime,
      recurringStartDate: new Date(recurringStartDate),
      recurringEndDate: recurringEndDate ? new Date(recurringEndDate) : undefined
    });

    res.status(201).json(slot);
  } catch (error: any) {
    if (error.message === 'Maximum 2 slots allowed per day') {
      return res.status(400).json({ error: error.message });
    }
     res.status(500).json({ error: 'Failed to create slot' });
  }
});

// Get slots for a specific week
router.get('/week', async (req, res) => {
  try {
    const { startDate } = req.query;
    
    if (!startDate) {
      return res.status(400).json({ error: 'Start date is required' });
    }

    const slots = await SlotService.getWeekSlots(new Date(startDate as string));
    res.json(slots);
  } catch (error) {
     res.status(500).json({ error: 'Failed to fetch week slots' });
  }
});

// Update a slot (creates an exception)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, date } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    if (startTime && endTime && startTime >= endTime) {
      return res.status(400).json({ error: 'Start time must be before end time' });
    }

    const slot = await SlotService.updateSlot(id, {
      startTime,
      endTime,
      date: new Date(date)
    });

    res.json(slot);
  } catch (error: any) {
    if (error.message === 'Slot not found') {
      return res.status(404).json({ error: error.message });
    }
     res.status(500).json({ error: 'Failed to update slot' });
  }
});

// Delete a slot (creates a deletion exception)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const slot = await SlotService.deleteSlot(id, new Date(date));
    res.json(slot);
  } catch (error: any) {
    if (error.message === 'Slot not found') {
      return res.status(404).json({ error: error.message });
    }
     res.status(500).json({ error: 'Failed to delete slot' });
  }
});

// Get all slots (for admin purposes)
router.get('/', async (req, res) => {
  try {
    const slots = await SlotService.getAllSlots();
    res.json(slots);
  } catch (error) {
     res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

// Delete a recurring slot completely
router.delete('/recurring/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await SlotService.deleteRecurringSlot(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Slot not found') {
      return res.status(404).json({ error: error.message });
    }
     res.status(500).json({ error: 'Failed to delete recurring slot' });
  }
});

export default router;
