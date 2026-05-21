import mongoose, { Schema, Model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export interface IChecklistItemDoc {
  _id: string;
  id?: string;
  event_ritual_id: string;
  title: string;
  title_i18n?: any;
  sort_order: number;
  is_done: boolean;
  assigned_to?: string;
  due_at?: Date;
  completed_at?: Date;
  completed_by?: string;
}

const checklistItemSchema = new Schema<IChecklistItemDoc>(
  {
    _id: { type: String, required: true },
    event_ritual_id: { type: String, required: true, ref: 'EventRitual' },
    title: { type: String, required: true },
    title_i18n: { type: Schema.Types.Mixed },
    sort_order: { type: Number, default: 0 },
    is_done: { type: Boolean, default: false },
    assigned_to: { type: String, ref: 'User' },
    due_at: { type: Date },
    completed_at: { type: Date },
    completed_by: { type: String, ref: 'User' }
  },
  { timestamps: false, id: false, collection: 'ritual_checklist_items' }
);

checklistItemSchema.virtual('id').get(function () {
  return this._id;
});

checklistItemSchema.index({ event_ritual_id: 1, sort_order: 1 });

checklistItemSchema.plugin(mongooseLeanVirtuals);

export const ChecklistItemModel: Model<IChecklistItemDoc> = mongoose.model<IChecklistItemDoc>('ChecklistItem', checklistItemSchema);
