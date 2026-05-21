import mongoose, { Schema, Model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export interface IGuestDoc {
  _id: string;
  id?: string;
  event_id: string;
  contact_id?: string | null;
  name: string;
  phone?: string | null;
  email?: string | null;
  relationship?: string | null;
  rsvp_status: 'pending' | 'yes' | 'no' | 'maybe';
  meal_preference: 'veg' | 'non_veg' | 'jain' | 'unknown';
  accommodation: boolean;
  plus_ones: number;
  plus_members?: Array<{
    id?: string;
    name: string;
    gender?: 'female' | 'male' | 'other' | 'undisclosed' | null;
    age?: number | null;
  }>;
  age?: number | null;
  gender?: 'female' | 'male' | 'other' | 'undisclosed' | null;
  dependent_group_id?: string | null;
  return_gift?: {
    gift_type?: string | null;
    quantity: number;
    notes?: string | null;
  };
  notes?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

const guestSchema = new Schema<IGuestDoc>(
  {
    _id: { type: String, required: true },
    event_id: { type: String, required: true, ref: 'Event' },
    contact_id: { type: String, default: null, ref: 'Contact' },
    name: { type: String, required: true },
    phone: { type: String, default: null },
    email: { type: String, default: null },
    relationship: { type: String, default: null },
    rsvp_status: {
      type: String,
      enum: ['pending', 'yes', 'no', 'maybe'],
      default: 'pending'
    },
    meal_preference: {
      type: String,
      enum: ['veg', 'non_veg', 'jain', 'unknown'],
      default: 'unknown'
    },
    accommodation: { type: Boolean, default: false },
    plus_ones: { type: Number, default: 0, min: 0 },
    plus_members: {
      type: [
        {
          id: { type: String },
          name: { type: String, required: true },
          gender: {
            type: String,
            enum: ['female', 'male', 'other', 'undisclosed', null],
            default: null
          },
          age: { type: Number, default: null }
        }
      ],
      default: []
    },
    age: { type: Number, default: null },
    gender: {
      type: String,
      enum: ['female', 'male', 'other', 'undisclosed', null],
      default: null
    },
    dependent_group_id: { type: String, default: null },
    return_gift: {
      gift_type: { type: String, default: null },
      quantity: { type: Number, default: 0, min: 0 },
      notes: { type: String, default: null }
    },
    notes: { type: String, default: null }
  },
  { timestamps: true, id: false, collection: 'guests' }
);

guestSchema.virtual('id').get(function () {
  return this._id;
});

guestSchema.index({ event_id: 1 });
guestSchema.index({ event_id: 1, rsvp_status: 1 });
guestSchema.index({ event_id: 1, dependent_group_id: 1 });

guestSchema.plugin(mongooseLeanVirtuals);

export const GuestModel: Model<IGuestDoc> = mongoose.model<IGuestDoc>('Guest', guestSchema);
