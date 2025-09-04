import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Slot } from '../types';

interface SlotCardProps {
  slot: Slot;
  date: Date;
  onEdit: () => void;
  onDelete: () => void;
}

const SlotCard: React.FC<SlotCardProps> = ({ slot, onEdit, onDelete }) => {
  return (
    <div className={`p-3 rounded-lg border ${
      slot.isException 
        ? 'bg-yellow-50 border-yellow-200' 
        : 'bg-blue-50 border-blue-200'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm font-medium text-gray-900">
          {slot.startTime} - {slot.endTime}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={onEdit}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title="Edit slot"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
            title="Delete slot"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      {slot.isException && (
        <div className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
          Modified
        </div>
      )}
    </div>
  );
};

export default SlotCard;
