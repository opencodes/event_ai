import mongoose, { Schema, Model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export interface IBhojMealLine {
  day: string;
  type: string;
  items: string[];
}

export interface IBhojIngredientLine {
  category: string;
  quantity: number;
  unit: string;
}

export interface IEventBhojDoc {
  _id: string;
  id?: string;
  event_id: string;
  meals: IBhojMealLine[];
  ingredients: IBhojIngredientLine[];
  created_at?: Date;
  updated_at?: Date;
}

const eventBhojSchema = new Schema<IEventBhojDoc>(
  {
    _id: { type: String, required: true },
    event_id: { type: String, required: true, ref: 'Event', unique: true },
    meals: {
      type: [
        {
          day: { type: String, required: true },
          type: { type: String, required: true },
          items: { type: [String], default: [] }
        }
      ],
      default: []
    },
    ingredients: {
      type: [
        {
          category: { type: String, required: true },
          quantity: { type: Number, default: 0, min: 0 },
          unit: { type: String, default: 'kg' }
        }
      ],
      default: []
    }
  },
  { timestamps: true, id: false, collection: 'event_bhoj_plans' }
);

eventBhojSchema.virtual('id').get(function () {
  return this._id;
});

eventBhojSchema.plugin(mongooseLeanVirtuals);

export const EventBhojModel: Model<IEventBhojDoc> = mongoose.model<IEventBhojDoc>(
  'EventBhoj',
  eventBhojSchema
);
