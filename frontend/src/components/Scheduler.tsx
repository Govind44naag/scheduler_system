import { WeekSlots } from '../types';
import DayColumn from './DayColumn';

interface SchedulerProps {
  weekSlots: WeekSlots[];
  onSlotUpdated: () => void;
  onSlotDeleted: () => void;
}

const Scheduler: React.FC<SchedulerProps> = ({ weekSlots, onSlotUpdated, onSlotDeleted }) => {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {dayNames.map((dayName) => (
          <div key={dayName} className="bg-gray-50 p-4 text-center">
            <h3 className="font-semibold text-gray-900">{dayName}</h3>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {weekSlots.map((dayData, index) => (
          <DayColumn
            key={dayData.date.toISOString()}
            dayData={dayData}
            dayName={dayNames[index]}
            onSlotUpdated={onSlotUpdated}
            onSlotDeleted={onSlotDeleted}
          />
        ))}
      </div>
    </div>
  );
};

export default Scheduler;
