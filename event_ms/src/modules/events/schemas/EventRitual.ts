import mongoose, { Schema, Model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export interface IEventRitualDoc {
  _id: string;
  id?: string;
  event_id: string;
  sub_event_id?: string | null;
  ritual_def_id?: string;
  ritual_def_version?: string;
  ritual_key: string;
  name: string;
  name_i18n?: any;
  sort_order: number;
  scheduled_at?: Date;
  duration_minutes?: number;
  status: string;
  snapshot?: any;
  priest_booking_id?: string;
  skipped: boolean;
  skip_reason?: string;
  created_at?: Date;
  updated_at?: Date;
}

const eventRitualSchema = new Schema<IEventRitualDoc>(
  {
    _id: { type: String, required: true },
    event_id: { type: String, required: true, ref: 'Event' },
    sub_event_id: { type: String, default: null, ref: 'SubEvent' },
    ritual_def_id: { type: String },
    ritual_def_version: { type: String },
    ritual_key: { type: String, required: true },
    name: { type: String, required: true },
    name_i18n: { type: Schema.Types.Mixed },
    sort_order: { type: Number, default: 0 },
    scheduled_at: { type: Date },
    duration_minutes: { type: Number },
    status: { type: String, default: 'planned' },
    snapshot: { type: Schema.Types.Mixed },
    priest_booking_id: { type: String },
    skipped: { type: Boolean, default: false },
    skip_reason: { type: String }
  },
  { timestamps: true, id: false, collection: 'event_rituals' }
);

eventRitualSchema.virtual('id').get(function () {
  return this._id;
});

eventRitualSchema.index({ event_id: 1, sort_order: 1 });

eventRitualSchema.plugin(mongooseLeanVirtuals);

export const EventRitualModel: Model<IEventRitualDoc> = mongoose.model<IEventRitualDoc>('EventRitual', eventRitualSchema);
