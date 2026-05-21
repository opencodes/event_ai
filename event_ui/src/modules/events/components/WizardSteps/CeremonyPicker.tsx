import React from 'react';
import { Phase1Event } from '../../api/eventApi';
import { Sparkles, Calendar, BookOpen, PartyPopper } from 'lucide-react';

interface Props {
  eventData: Partial<Phase1Event>;
  updateEventData: (data: Partial<Phase1Event>) => void;
  onNext: () => void;
}

const CEREMONY_TYPES = [
  { id: 'vivah', label: 'Vivah (Wedding)', icon: Sparkles, color: 'bg-pink-100 text-pink-600' },
  { id: 'mundan', label: 'Mundan', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
  { id: 'griha_pravesh', label: 'Griha Pravesh', icon: BookOpen, color: 'bg-green-100 text-green-600' },
  { id: 'other', label: 'Other', icon: PartyPopper, color: 'bg-purple-100 text-purple-600' },
];

export const CeremonyPicker: React.FC<Props> = ({ eventData, updateEventData, onNext }) => {
  const handleSelect = (id: string) => {
    updateEventData({ ceremony_type: id });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">What type of ceremony are you planning?</h2>
        <p className="text-gray-500 mt-2">Select a ceremony type to get started.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CEREMONY_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = eventData.ceremony_type === type.id;
          return (
            <button
              key={type.id}
              onClick={() => handleSelect(type.id)}
              className={`p-6 rounded-2xl border-2 transition-all flex items-center space-x-4 ${
                isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
              }`}
            >
              <div className={`p-4 rounded-xl ${type.color}`}>
                <Icon size={24} />
              </div>
              <span className="text-lg font-medium text-gray-800">{type.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
