import mongoose, { Schema, Model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export interface IContactDoc {
  _id: string;
  id?: string;
  user_id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  relation?: string | null;
  source: 'manual' | 'csv' | 'mobile';
  metadata?: Record<string, unknown>;
  created_at?: Date;
  updated_at?: Date;
}

const contactSchema = new Schema<IContactDoc>(
  {
    _id: { type: String, required: true },
    user_id: { type: String, required: true, ref: 'User' },
    name: { type: String, required: true },
    phone: { type: String, default: null },
    email: { type: String, default: null },
    relation: { type: String, default: null },
    source: { type: String, enum: ['manual', 'csv', 'mobile'], default: 'manual' },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true, id: false, collection: 'contacts' }
);

contactSchema.virtual('id').get(function () {
  return this._id;
});

contactSchema.index({ user_id: 1 });
contactSchema.index({ user_id: 1, phone: 1 });
contactSchema.index({ user_id: 1, email: 1 });

contactSchema.plugin(mongooseLeanVirtuals);

export const ContactModel: Model<IContactDoc> = mongoose.model<IContactDoc>('Contact', contactSchema);
