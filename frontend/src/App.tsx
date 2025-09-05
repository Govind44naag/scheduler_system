import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import Scheduler from './components/Scheduler';
import CreateSlotModal from './components/CreateSlotModal';
import { SlotService } from './services/slotService';
import { WeekSlots } from './types';

function App() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weekSlots, setWeekSlots] = useState<WeekSlots[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeekSlots = async (weekStart: Date) => {
    setIsLoading(true);
    try {
      const slots = await SlotService.getWeekSlots(weekStart);
      setWeekSlots(slots);
    } catch (error) {
     } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekSlots(currentWeekStart);
  }, [currentWeekStart]);

  const handlePreviousWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  const handleSlotCreated = () => {
    fetchWeekSlots(currentWeekStart);
    setIsCreateModalOpen(false);
  };

  const handleSlotUpdated = () => {
    fetchWeekSlots(currentWeekStart);
  };

  const handleSlotDeleted = () => {
    fetchWeekSlots(currentWeekStart);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Scheduler System</h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Create New Slot
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePreviousWeek}
            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md border transition-colors"
          >
            Previous Week
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            Week of {format(currentWeekStart, 'MMM d, yyyy')}
          </h2>
          
          <button
            onClick={handleNextWeek}
            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md border transition-colors"
          >
            Next Week
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <Scheduler
            weekSlots={weekSlots}
            onSlotUpdated={handleSlotUpdated}
            onSlotDeleted={handleSlotDeleted}
          />
        )}
      </div>

      <CreateSlotModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSlotCreated={handleSlotCreated}
      />
    </div>
  );
}

export default App;
