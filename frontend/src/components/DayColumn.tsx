import React, { useState } from 'react';
import { format } from 'date-fns';
import { WeekSlots, Slot } from '../types';
import SlotCard from './SlotCard';
import EditSlotModal from './EditSlotModal';

interface DayColumnProps {
  dayData: WeekSlots;
  dayName: string;
  onSlotUpdated: () => void;
  onSlotDeleted: () => void;
}

const DayColumn: React.FC<DayColumnProps> = ({ 
  dayData, 
  dayName, 
  onSlotUpdated, 
  onSlotDeleted 
}) => {
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditSlot = (slot: Slot) => {
    setEditingSlot(slot);
    setIsEditModalOpen(true);
  };

  const handleSlotUpdated = () => {
    onSlotUpdated();
    setIsEditModalOpen(false);
    setEditingSlot(null);
  };

  const handleSlotDeleted = () => {
    onSlotDeleted();
    setIsEditModalOpen(false);
    setEditingSlot(null);
  };

  return (
    <div className="bg-white min-h-[400px] p-2">
      {/* Date Header */}
      <div className="text-center mb-3">
        <div className="text-sm text-gray-500">{dayName}</div>
        <div className="text-lg font-semibold text-gray-900">
          {format(dayData.date, 'd')}
        </div>
      </div>

      {/* Slots */}
      <div className="space-y-2">
        {dayData.slots.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            date={dayData.date}
            onEdit={() => handleEditSlot(slot)}
            onDelete={handleSlotDeleted}
          />
        ))}
        
        {/* Empty state if no slots */}
        {dayData.slots.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            No slots
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingSlot && (
        <EditSlotModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          slot={editingSlot}
          date={dayData.date}
          onSlotUpdated={handleSlotUpdated}
          onSlotDeleted={handleSlotDeleted}
        />
      )}
    </div>
  );
};

export default DayColumn;
