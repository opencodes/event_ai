import mongoose, { Schema, Model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export interface IClothingItemLine {
  item: string;
  required: number;
  purchased: number;
}

export interface IClothingDistributionLine {
  family: string;
  saris: number;
  kurtas: number;
  dhotis: number;
  sherwanis: number;
}

export interface IEventClothingDoc {
  _id: string;
  id?: string;
  event_id: string;
  items: IClothingItemLine[];
  distributions: IClothingDistributionLine[];
  created_at?: Date;
  updated_at?: Date;
}

const eventClothingSchema = new Schema<IEventClothingDoc>(
  {
    _id: { type: String, required: true },
    event_id: { type: String, required: true, ref: 'Event', unique: true },
    items: {
      type: [
        {
          item: { type: String, required: true },
          required: { type: Number, default: 0, min: 0 },
          purchased: { type: Number, default: 0, min: 0 }
        }
      ],
      default: []
    },
    distributions: {
      type: [
        {
          family: { type: String, required: true },
          saris: { type: Number, default: 0, min: 0 },
          kurtas: { type: Number, default: 0, min: 0 },
          dhotis: { type: Number, default: 0, min: 0 },
          sherwanis: { type: Number, default: 0, min: 0 }
        }
      ],
      default: []
    }
  },
  { timestamps: true, id: false, collection: 'event_clothing' }
);

eventClothingSchema.virtual('id').get(function () {
  return this._id;
});

eventClothingSchema.plugin(mongooseLeanVirtuals);

export const EventClothingModel: Model<IEventClothingDoc> = mongoose.model<IEventClothingDoc>(
  'EventClothing',
  eventClothingSchema
);
