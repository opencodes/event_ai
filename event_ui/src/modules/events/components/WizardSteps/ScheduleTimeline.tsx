import React from 'react';
import { Phase1Event, Phase1SubEvent } from '../../api/eventApi';
import { Plus, Trash2, Clock } from 'lucide-react';

interface Props {
  eventData: Partial<Phase1Event>;
  updateEventData: (data: Partial<Phase1Event>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ScheduleTimeline: React.FC<Props> = ({ eventData, updateEventData, onNext, onBack }) => {
  const subEvents = eventData.sub_events || [];
  const hasInvalidSubEvents = subEvents.some((se) => !se.name.trim());

  const addSubEvent = () => {
    const newSubEvent: Phase1SubEvent = {
      id: `temp_${Date.now()}`,
      event_id: 'temp',
      name: '',
      sort_order: subEvents.length,
      phase: 'main',
    };
    updateEventData({ sub_events: [...subEvents, newSubEvent] });
  };

  const updateSubEvent = (index: number, updates: Partial<Phase1SubEvent>) => {
    const updated = [...subEvents];
    updated[index] = { ...updated[index], ...updates };
    updateEventData({ sub_events: updated });
  };

  const removeSubEvent = (index: number) => {
    const updated = [...subEvents];
    updated.splice(index, 1);
    // Reorder
    updated.forEach((se, i) => se.sort_order = i);
    updateEventData({ sub_events: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Schedule & Sub-events</h2>
        <button onClick={addSubEvent} className="flex items-center space-x-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
          <Plus size={16} />
          <span>Add Sub-event</span>
        </button>
      </div>

      {subEvents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
          <Clock size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No sub-events planned</h3>
          <p className="text-gray-400 mt-1">Add sub-events like 'Haldi', 'Mehendi', or 'Pheras'.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {subEvents.map((se, index) => (
            <div key={se.id} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Sub-event Name</label>
                  <input
                    type="text"
                    value={se.name}
                    onChange={(e) => updateSubEvent(index, { name: e.target.value })}
                    placeholder="e.g. Haldi Ceremony"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Starts At</label>
                    <input
                      type="datetime-local"
                      value={se.starts_at ? new Date(se.starts_at).toISOString().slice(0, 16) : ''}
                      onChange={(e) => updateSubEvent(index, { starts_at: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Phase</label>
                    <select
                      value={se.phase || 'main'}
                      onChange={(e) => updateSubEvent(index, { phase: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      <option value="pre_ceremony">Pre-ceremony</option>
                      <option value="main">Main Ceremony</option>
                      <option value="post_ceremony">Post-ceremony</option>
                    </select>
                  </div>
                </div>
              </div>
              <button onClick={() => removeSubEvent(index)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg self-start mt-4 md:mt-0" title="Remove">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {hasInvalidSubEvents && (
        <p className="text-sm text-red-600">Name each sub-event before continuing.</p>
      )}

      <div className="flex justify-between pt-6">
        <button onClick={onBack} className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={hasInvalidSubEvents}
          className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};
