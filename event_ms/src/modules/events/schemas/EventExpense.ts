import mongoose, { Schema, Model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export interface IEventExpenseDoc {
  _id: string;
  id?: string;
  event_id: string;
  category: string;
  amount_paise: number;
  status: 'pending' | 'in-progress' | 'confirmed';
  sort_order: number;
  created_at?: Date;
  updated_at?: Date;
}

const eventExpenseSchema = new Schema<IEventExpenseDoc>(
  {
    _id: { type: String, required: true },
    event_id: { type: String, required: true, ref: 'Event' },
    category: { type: String, required: true },
    amount_paise: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'confirmed'],
      default: 'pending'
    },
    sort_order: { type: Number, default: 0 }
  },
  { timestamps: true, id: false, collection: 'event_expenses' }
);

eventExpenseSchema.virtual('id').get(function () {
  return this._id;
});

eventExpenseSchema.index({ event_id: 1, sort_order: 1 });
eventExpenseSchema.plugin(mongooseLeanVirtuals);

export const EventExpenseModel: Model<IEventExpenseDoc> = mongoose.model<IEventExpenseDoc>(
  'EventExpense',
  eventExpenseSchema
);
