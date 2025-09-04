import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SlotService } from '../services/slotService';
import { Slot, UpdateSlotData } from '../types';

interface EditSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: Slot;
  date: Date;
  onSlotUpdated: () => void;
  onSlotDeleted: () => void;
}

const EditSlotModal: React.FC<EditSlotModalProps> = ({ 
  isOpen, 
  onClose, 
  slot, 
  date, 
  onSlotUpdated, 
  onSlotDeleted 
}) => {
  const [formData, setFormData] = useState<UpdateSlotData>({
    startTime: slot.startTime,
    endTime: slot.endTime,
    date
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await SlotService.updateSlot(slot.id, formData);
      onSlotUpdated();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to update slot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this slot for this specific date?')) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await SlotService.deleteSlot(slot.id, date);
      onSlotDeleted();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to delete slot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof UpdateSlotData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Edit Slot</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Editing this slot will create an exception for this specific date only. 
            The recurring pattern will remain unchanged.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {/* Date Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date.toISOString().split('T')[0]}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              Delete for this date
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Updating...' : 'Update Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSlotModal;
