import mongoose, { Schema, Model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export interface ISamagriItemDoc {
  _id: string;
  id?: string;
  event_ritual_id: string;
  name: string;
  quantity?: string;
  unit?: string;
  category?: string;
  procured: boolean;
  vendor_note?: string;
  sort_order: number;
}

const samagriItemSchema = new Schema<ISamagriItemDoc>(
  {
    _id: { type: String, required: true },
    event_ritual_id: { type: String, required: true, ref: 'EventRitual' },
    name: { type: String, required: true },
    quantity: { type: String },
    unit: { type: String },
    category: { type: String },
    procured: { type: Boolean, default: false },
    vendor_note: { type: String },
    sort_order: { type: Number, default: 0 }
  },
  { timestamps: false, id: false, collection: 'samagri_items' }
);

samagriItemSchema.virtual('id').get(function () {
  return this._id;
});

samagriItemSchema.index({ event_ritual_id: 1, sort_order: 1 });

samagriItemSchema.plugin(mongooseLeanVirtuals);

export const SamagriItemModel: Model<ISamagriItemDoc> = mongoose.model<ISamagriItemDoc>('SamagriItem', samagriItemSchema);
