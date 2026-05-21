import mongoose, { Schema, Model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export interface ISubEventDoc {
  _id: string;
  id?: string;
  event_id: string;
  name: string;
  name_i18n?: any;
  sort_order: number;
  phase?: string;
  starts_at?: Date;
  ends_at?: Date;
  venue?: any;
  notes?: string;
  status: string;
  created_at?: Date;
  updated_at?: Date;
}

const subEventSchema = new Schema<ISubEventDoc>(
  {
    _id: { type: String, required: true },
    event_id: { type: String, required: true, ref: 'Event' },
    name: { type: String, required: true },
    name_i18n: { type: Schema.Types.Mixed },
    sort_order: { type: Number, default: 0 },
    phase: { type: String },
    starts_at: { type: Date },
    ends_at: { type: Date },
    venue: { type: Schema.Types.Mixed },
    notes: { type: String },
    status: { type: String, default: 'planned' }
  },
  { timestamps: true, id: false, collection: 'sub_events' }
);

subEventSchema.virtual('id').get(function () {
  return this._id;
});

subEventSchema.index({ event_id: 1, sort_order: 1 });

subEventSchema.plugin(mongooseLeanVirtuals);

export const SubEventModel: Model<ISubEventDoc> = mongoose.model<ISubEventDoc>('SubEvent', subEventSchema);
