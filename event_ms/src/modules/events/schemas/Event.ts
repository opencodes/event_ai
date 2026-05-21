import mongoose, { Schema, Model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export interface IEventDoc {
  _id: string;
  id?: string;
  organizer_user_id: string;
  host_user_id?: string | null;
  title: string;
  description?: string;
  ceremony_type: string;
  status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled' | 'archived';
  visibility: 'private' | 'invite_only' | 'unlisted_public';
  region_code?: string;
  tradition?: string;
  primary_locale: string;
  timezone: string;
  start_at?: Date;
  end_at?: Date;
  cover_image_url?: string;
  venue_master?: any;
  muhurat?: any;
  creation_source: string;
  template_snapshot?: any;
  template_source?: any;
  overlay_diff?: any;
  preparation_pct: number;
  published_at?: Date;
  completed_at?: Date;
  cancelled_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

const eventSchema = new Schema<IEventDoc>(
  {
    _id: { type: String, required: true },
    organizer_user_id: { type: String, required: true, ref: 'User' },
    host_user_id: { type: String, default: null, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String },
    ceremony_type: { type: String, required: true },
    status: {
      type: String,
      default: 'draft',
      enum: ['draft', 'published', 'in_progress', 'completed', 'cancelled', 'archived']
    },
    visibility: {
      type: String,
      default: 'invite_only',
      enum: ['private', 'invite_only', 'unlisted_public']
    },
    region_code: { type: String },
    tradition: { type: String },
    primary_locale: { type: String, default: 'hi' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    start_at: { type: Date },
    end_at: { type: Date },
    cover_image_url: { type: String },
    venue_master: { type: Schema.Types.Mixed },
    muhurat: { type: Schema.Types.Mixed },
    creation_source: { type: String, default: 'scratch' },
    template_snapshot: { type: Schema.Types.Mixed },
    template_source: { type: Schema.Types.Mixed },
    overlay_diff: { type: Schema.Types.Mixed },
    preparation_pct: { type: Number, default: 0 },
    published_at: { type: Date },
    completed_at: { type: Date },
    cancelled_at: { type: Date }
  },
  { timestamps: true, id: false, collection: 'events' }
);

eventSchema.virtual('id').get(function () {
  return this._id;
});

eventSchema.index({ organizer_user_id: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ ceremony_type: 1 });

eventSchema.plugin(mongooseLeanVirtuals);

export const EventModel: Model<IEventDoc> = mongoose.model<IEventDoc>('Event', eventSchema);
