import React from 'react';
import { Phase1Event } from '../../api/eventApi';

interface Props {
  eventData: Partial<Phase1Event>;
  updateEventData: (data: Partial<Phase1Event>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const EventBasics: React.FC<Props> = ({ eventData, updateEventData, onNext, onBack }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateEventData({ [name]: value });
  };

  const handleNext = () => {
    if (!eventData.title || !eventData.start_at) {
      alert("Title and Start Date are required.");
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Event Details</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
          <input
            type="text"
            name="title"
            value={eventData.title || ''}
            onChange={handleChange}
            placeholder="e.g. Rahul & Priya's Wedding"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={eventData.description || ''}
            onChange={handleChange}
            placeholder="Add some details about the event..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
            <input
              type="datetime-local"
              name="start_at"
              value={eventData.start_at ? new Date(eventData.start_at).toISOString().slice(0, 16) : ''}
              onChange={(e) => updateEventData({ start_at: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="datetime-local"
              name="end_at"
              value={eventData.end_at ? new Date(eventData.end_at).toISOString().slice(0, 16) : ''}
              onChange={(e) => updateEventData({ end_at: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Locale</label>
            <select
              name="primary_locale"
              value={eventData.primary_locale || 'hi'}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              name="timezone"
              value={eventData.timezone || 'Asia/Kolkata'}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
              <option value="America/New_York">EST (America/New_York)</option>
              <option value="Europe/London">GMT (Europe/London)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button onClick={onBack} className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors">
          Back
        </button>
        <button onClick={handleNext} className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition-colors shadow-sm">
          Next Step
        </button>
      </div>
    </div>
  );
};
