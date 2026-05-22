import mongoose, { Schema, Model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export interface IEventVendorDoc {
  _id: string;
  id?: string;
  event_id: string;
  name: string;
  category: string;
  total_amount_paise: number;
  advance_paise: number;
  service_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  sort_order: number;
  created_at?: Date;
  updated_at?: Date;
}

const eventVendorSchema = new Schema<IEventVendorDoc>(
  {
    _id: { type: String, required: true },
    event_id: { type: String, required: true, ref: 'Event' },
    name: { type: String, required: true },
    category: { type: String, required: true },
    total_amount_paise: { type: Number, required: true, min: 0 },
    advance_paise: { type: Number, default: 0, min: 0 },
    service_date: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    sort_order: { type: Number, default: 0 }
  },
  { timestamps: true, id: false, collection: 'event_vendors' }
);

eventVendorSchema.virtual('id').get(function () {
  return this._id;
});

eventVendorSchema.index({ event_id: 1, sort_order: 1 });
eventVendorSchema.plugin(mongooseLeanVirtuals);

export const EventVendorModel: Model<IEventVendorDoc> = mongoose.model<IEventVendorDoc>(
  'EventVendor',
  eventVendorSchema
);
