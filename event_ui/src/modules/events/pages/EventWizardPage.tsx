import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Phase1Event, eventModuleApi } from '../api/eventApi';
import { CeremonyPicker } from '../components/WizardSteps/CeremonyPicker';
import { EventBasics } from '../components/WizardSteps/EventBasics';
import { ScheduleTimeline } from '../components/WizardSteps/ScheduleTimeline';
import { RitualsBuilder } from '../components/WizardSteps/RitualsBuilder';
import { ReviewAndPublish } from '../components/WizardSteps/ReviewAndPublish';
import { Sidebar, Header } from '@/layout';
import { useEventWorkspace } from '../context';

const STEPS = ['Ceremony Type', 'Basics', 'Schedule', 'Rituals', 'Review'];

export const EventWizardPage = () => {
  const navigate = useNavigate();
  const { refreshEvents, setSelectedEventId } = useEventWorkspace();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wizard State
  const [eventData, setEventData] = useState<Partial<Phase1Event>>({
    status: 'draft',
    visibility: 'invite_only',
    primary_locale: 'hi',
    timezone: 'Asia/Kolkata',
    sub_events: [],
    rituals: [],
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const updateEventData = (updates: Partial<Phase1Event>) => {
    setEventData((prev) => ({ ...prev, ...updates }));
  };

  const goToNextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // 1. Create Event
      const createdEvent = await eventModuleApi.createEvent({
        title: eventData.title,
        description: eventData.description,
        ceremony_type: eventData.ceremony_type,
        start_at: eventData.start_at,
        end_at: eventData.end_at,
        timezone: eventData.timezone,
        primary_locale: eventData.primary_locale,
      });
      const createdEventId = createdEvent.id || createdEvent._id;
      if (!createdEventId) {
        throw new Error('Event was created, but the API response did not include an event ID.');
      }

      // 2. Add Sub Events
      const validSubEvents = (eventData.sub_events || []).filter((se) => se.name.trim());
      if (validSubEvents.length > 0) {
        for (const se of validSubEvents) {
          await eventModuleApi.addSubEvent(createdEventId, {
            name: se.name.trim(),
            starts_at: se.starts_at,
            ends_at: se.ends_at,
            sort_order: se.sort_order,
            phase: se.phase,
          });
        }
      }

      // 3. Add Rituals
      if (eventData.rituals && eventData.rituals.length > 0) {
        for (const r of eventData.rituals) {
          const createdRitual = await eventModuleApi.addRitual(createdEventId, {
            ritual_key: r.ritual_key || 'custom_ritual',
            name: r.name,
            sort_order: r.sort_order,
            skipped: r.skipped,
          });
          const createdRitualId = createdRitual.id || createdRitual._id;
          if (!createdRitualId) {
            throw new Error('Ritual was created, but the API response did not include a ritual ID.');
          }

          // Add Checklists
          if (r.checklists) {
            for (const c of r.checklists) {
              await eventModuleApi.addChecklistItem(createdRitualId, {
                title: c.title,
                is_done: c.is_done,
                sort_order: c.sort_order,
              });
            }
          }

          // Add Samagri
          if (r.samagri) {
            for (const s of r.samagri) {
              await eventModuleApi.addSamagriItem(createdRitualId, {
                name: s.name,
                quantity: s.quantity,
                unit: s.unit,
                procured: s.procured,
              });
            }
          }
        }
      }

      // 4. Publish Event
      await eventModuleApi.publishEvent(createdEventId);
      await refreshEvents();
      setSelectedEventId(createdEventId);
      navigate('/events');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to publish event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStepIndex) {
      case 0:
        return <CeremonyPicker eventData={eventData} updateEventData={updateEventData} onNext={goToNextStep} />;
      case 1:
        return <EventBasics eventData={eventData} updateEventData={updateEventData} onNext={goToNextStep} onBack={goToPrevStep} />;
      case 2:
        return <ScheduleTimeline eventData={eventData} updateEventData={updateEventData} onNext={goToNextStep} onBack={goToPrevStep} />;
      case 3:
        return <RitualsBuilder eventData={eventData} updateEventData={updateEventData} onNext={goToNextStep} onBack={goToPrevStep} />;
      case 4:
        return <ReviewAndPublish eventData={eventData} onBack={goToPrevStep} onPublish={handlePublish} isSubmitting={isSubmitting} error={error} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden app-shell">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isCollapsed={sidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMobileMenuToggle={handleMenuToggle} />

        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate('/events')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--app-fg-muted)] hover:text-[var(--app-fg)] transition-colors self-start"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Events</span>
              </button>

              <div>
                <h1 className="text-2xl font-bold text-[var(--app-fg)]">Create New Event</h1>
                <p className="text-sm text-[var(--app-fg-muted)] mt-1">Build a ceremony plan from scratch with schedule, rituals, checklist, and samagri.</p>
              </div>

              <div className="flex items-center gap-2 text-sm overflow-x-auto pb-1">
                {STEPS.map((step, index) => (
                  <React.Fragment key={step}>
                    <span
                      className={`px-3 py-1 rounded-full whitespace-nowrap border text-xs font-semibold ${
                        index === currentStepIndex
                          ? 'bg-[var(--primary)] text-white border-transparent'
                          : index < currentStepIndex
                            ? 'bg-[var(--primary-light)] text-[var(--primary-text)] border-transparent'
                            : 'bg-[var(--surface-muted)] text-[var(--app-fg-muted)] border-[var(--panel-border)]'
                      }`}
                    >
                      {index + 1}. {step}
                    </span>
                    {index < STEPS.length - 1 && <span className="text-[var(--app-fg-muted)]">/</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="glass-black-surface border border-[var(--panel-border)] rounded-xl p-5 md:p-6">
              {renderStepContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
