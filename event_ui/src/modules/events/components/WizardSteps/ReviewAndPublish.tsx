import React from 'react';
import { Phase1Event } from '../../api/eventApi';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface Props {
  eventData: Partial<Phase1Event>;
  onBack: () => void;
  onPublish: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export const ReviewAndPublish: React.FC<Props> = ({ eventData, onBack, onPublish, isSubmitting, error }) => {
  const isTitleMissing = !eventData.title;
  const isDateMissing = !eventData.start_at;

  const canPublish = !isTitleMissing && !isDateMissing;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Review & Publish</h2>
        <p className="text-gray-500 mt-2">Almost there! Review your event plan before publishing.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="mt-0.5 shrink-0" size={20} />
          <div>
            <h4 className="font-medium">Failed to publish</h4>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Event Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 block mb-1">Title</span>
              <span className={`font-medium ${isTitleMissing ? 'text-red-500' : 'text-gray-900'}`}>
                {eventData.title || 'Missing Title'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Ceremony Type</span>
              <span className="font-medium text-gray-900 capitalize">{eventData.ceremony_type || 'Other'}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Start Date</span>
              <span className={`font-medium ${isDateMissing ? 'text-red-500' : 'text-gray-900'}`}>
                {eventData.start_at ? new Date(eventData.start_at).toLocaleDateString() : 'Missing Date'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Timezone</span>
              <span className="font-medium text-gray-900">{eventData.timezone}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Content Overview</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sub-events Planned</span>
              <span className="font-medium bg-gray-200 px-2 py-0.5 rounded-full text-xs">{eventData.sub_events?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rituals</span>
              <span className="font-medium bg-gray-200 px-2 py-0.5 rounded-full text-xs">Add on Rituals page</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
        <Info className="text-blue-600 mt-0.5 shrink-0" size={20} />
        <p className="text-sm text-blue-800">
          After publishing, open the <strong>Rituals</strong> page to add ceremonies, checklists, and samagri for this event.
        </p>
      </div>

      {!canPublish && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
          <Info className="text-amber-600 mt-0.5 shrink-0" size={20} />
          <div className="text-sm text-amber-800">
            <strong className="font-semibold block mb-1">Cannot Publish Yet</strong>
            You must provide a title and start date before publishing.
          </div>
        </div>
      )}

      <div className="flex justify-between pt-6 border-t border-gray-100 mt-8">
        <button onClick={onBack} disabled={isSubmitting} className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors disabled:opacity-50">
          Back to Edit
        </button>
        <button
          onClick={onPublish}
          disabled={!canPublish || isSubmitting}
          className="px-8 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-md flex items-center space-x-2"
        >
          {isSubmitting ? (
             <span>Publishing...</span>
          ) : (
            <>
              <span>Publish Event</span>
              <CheckCircle2 size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
