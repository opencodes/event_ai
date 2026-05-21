import React, { useState } from 'react';
import { Phase1Event, Phase1EventRitual } from '../../api/eventApi';
import { Plus, Trash2, ListChecks, CheckCircle } from 'lucide-react';

interface Props {
  eventData: Partial<Phase1Event>;
  updateEventData: (data: Partial<Phase1Event>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const RitualsBuilder: React.FC<Props> = ({ eventData, updateEventData, onNext, onBack }) => {
  const rituals = eventData.rituals || [];
  const [activeRitualIndex, setActiveRitualIndex] = useState<number | null>(null);

  const addRitual = () => {
    const newRitual: Phase1EventRitual = {
      id: `temp_${Date.now()}`,
      event_id: 'temp',
      ritual_key: `custom_${Date.now()}`,
      name: 'New Ritual',
      sort_order: rituals.length,
      skipped: false,
      checklists: [],
      samagri: [],
    };
    updateEventData({ rituals: [...rituals, newRitual] });
    setActiveRitualIndex(rituals.length);
  };

  const updateRitual = (index: number, updates: Partial<Phase1EventRitual>) => {
    const updated = [...rituals];
    updated[index] = { ...updated[index], ...updates };
    updateEventData({ rituals: updated });
  };

  const removeRitual = (index: number) => {
    const updated = [...rituals];
    updated.splice(index, 1);
    updated.forEach((r, i) => r.sort_order = i);
    updateEventData({ rituals: updated });
    setActiveRitualIndex(null);
  };

  const addChecklistItem = (ritualIndex: number) => {
    const r = rituals[ritualIndex];
    const checklists = r.checklists || [];
    updateRitual(ritualIndex, {
      checklists: [...checklists, { id: `tc_${Date.now()}`, event_ritual_id: r.id, title: '', is_done: false, sort_order: checklists.length }]
    });
  };

  const addSamagriItem = (ritualIndex: number) => {
    const r = rituals[ritualIndex];
    const samagri = r.samagri || [];
    updateRitual(ritualIndex, {
      samagri: [...samagri, { id: `ts_${Date.now()}`, event_ritual_id: r.id, name: '', procured: false, quantity: '1', unit: 'item' }]
    });
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Plan Rituals</h2>
        <button onClick={addRitual} className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
          <Plus size={16} />
          <span>Add Ritual</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-[400px]">
        {/* Rituals List */}
        <div className="w-full md:w-1/3 bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <ListChecks size={18} className="text-indigo-600" />
            Event Rituals
          </h3>
          {rituals.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No rituals added yet.</p>
          ) : (
            <div className="space-y-2">
              {rituals.map((r, idx) => (
                <div
                  key={r.id}
                  onClick={() => setActiveRitualIndex(idx)}
                  className={`p-3 rounded-lg cursor-pointer flex justify-between items-center border ${
                    activeRitualIndex === idx ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-white border-transparent hover:border-gray-200 text-gray-700 shadow-sm'
                  }`}
                >
                  <span className="font-medium text-sm truncate">{r.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); removeRitual(idx); }} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Ritual Editor */}
        <div className="w-full md:w-2/3">
          {activeRitualIndex !== null && rituals[activeRitualIndex] ? (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ritual Name</label>
                <input
                  type="text"
                  value={rituals[activeRitualIndex].name}
                  onChange={(e) => updateRitual(activeRitualIndex, { name: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800 text-sm">Preparation Checklist</h4>
                  <button onClick={() => addChecklistItem(activeRitualIndex)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                    + Add Task
                  </button>
                </div>
                <div className="space-y-2">
                  {(rituals[activeRitualIndex].checklists || []).map((c, cIdx) => (
                    <div key={c.id} className="flex gap-2">
                      <input
                        type="text"
                        value={c.title}
                        onChange={(e) => {
                          const updatedChecklists = [...(rituals[activeRitualIndex].checklists || [])];
                          updatedChecklists[cIdx].title = e.target.value;
                          updateRitual(activeRitualIndex, { checklists: updatedChecklists });
                        }}
                        placeholder="e.g. Book Pandit"
                        className="flex-1 px-2 py-1 text-sm border-b border-gray-200 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  ))}
                  {(!rituals[activeRitualIndex].checklists || rituals[activeRitualIndex].checklists?.length === 0) && (
                     <p className="text-xs text-gray-400">No tasks added.</p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800 text-sm">Samagri List</h4>
                  <button onClick={() => addSamagriItem(activeRitualIndex)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                    + Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {(rituals[activeRitualIndex].samagri || []).map((s, sIdx) => (
                    <div key={s.id} className="flex gap-2">
                      <input
                        type="text"
                        value={s.name}
                        onChange={(e) => {
                          const updatedSamagri = [...(rituals[activeRitualIndex].samagri || [])];
                          updatedSamagri[sIdx].name = e.target.value;
                          updateRitual(activeRitualIndex, { samagri: updatedSamagri });
                        }}
                        placeholder="Item name (e.g. Ghee, Flowers)"
                        className="flex-1 px-2 py-1 text-sm border-b border-gray-200 focus:border-indigo-500 outline-none"
                      />
                      <input
                        type="text"
                        value={s.quantity}
                        onChange={(e) => {
                          const updatedSamagri = [...(rituals[activeRitualIndex].samagri || [])];
                          updatedSamagri[sIdx].quantity = e.target.value;
                          updateRitual(activeRitualIndex, { samagri: updatedSamagri });
                        }}
                        placeholder="Qty"
                        className="w-16 px-2 py-1 text-sm border-b border-gray-200 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  ))}
                  {(!rituals[activeRitualIndex].samagri || rituals[activeRitualIndex].samagri?.length === 0) && (
                     <p className="text-xs text-gray-400">No samagri added.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <CheckCircle size={40} className="mb-2 text-gray-300" />
              <p>Select a ritual to edit details</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-100 mt-auto">
        <button onClick={onBack} className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors">
          Back
        </button>
        <button onClick={onNext} className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition-colors shadow-sm">
          Review Plan
        </button>
      </div>
    </div>
  );
};
