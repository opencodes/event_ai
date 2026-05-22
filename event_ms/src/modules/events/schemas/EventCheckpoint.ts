import mongoose, { Schema, Model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export interface IEventCheckpointDoc {
  _id: string;
  id?: string;
  event_id: string;
  title: string;
  status: 'not-started' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  sort_order: number;
  created_at?: Date;
  updated_at?: Date;
}

const eventCheckpointSchema = new Schema<IEventCheckpointDoc>(
  {
    _id: { type: String, required: true },
    event_id: { type: String, required: true, ref: 'Event' },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    sort_order: { type: Number, default: 0 }
  },
  { timestamps: true, id: false, collection: 'event_checkpoints' }
);

eventCheckpointSchema.virtual('id').get(function () {
  return this._id;
});

eventCheckpointSchema.index({ event_id: 1, sort_order: 1 });
eventCheckpointSchema.plugin(mongooseLeanVirtuals);

export const EventCheckpointModel: Model<IEventCheckpointDoc> = mongoose.model<IEventCheckpointDoc>(
  'EventCheckpoint',
  eventCheckpointSchema
);
