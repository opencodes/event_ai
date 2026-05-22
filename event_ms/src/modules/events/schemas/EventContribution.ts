import mongoose, { Schema, Model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export interface IEventContributionDoc {
  _id: string;
  id?: string;
  event_id: string;
  contributor_name: string;
  amount_paise: number;
  type: 'cash' | 'physical';
  status: 'pending' | 'received';
  guest_id?: string | null;
  notes?: string | null;
  sort_order: number;
  created_at?: Date;
  updated_at?: Date;
}

const eventContributionSchema = new Schema<IEventContributionDoc>(
  {
    _id: { type: String, required: true },
    event_id: { type: String, required: true, ref: 'Event' },
    contributor_name: { type: String, required: true },
    amount_paise: { type: Number, default: 0, min: 0 },
    type: { type: String, enum: ['cash', 'physical'], default: 'cash' },
    status: { type: String, enum: ['pending', 'received'], default: 'received' },
    guest_id: { type: String, default: null },
    notes: { type: String, default: null },
    sort_order: { type: Number, default: 0 }
  },
  { timestamps: true, id: false, collection: 'event_contributions' }
);

eventContributionSchema.virtual('id').get(function () {
  return this._id;
});

eventContributionSchema.index({ event_id: 1, sort_order: 1 });
eventContributionSchema.plugin(mongooseLeanVirtuals);

export const EventContributionModel: Model<IEventContributionDoc> = mongoose.model<IEventContributionDoc>(
  'EventContribution',
  eventContributionSchema
);
