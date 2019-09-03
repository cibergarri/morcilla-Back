import { model, Schema } from 'mongoose';
import { CLOCK_OPS } from '../utils/constants';

const ClockSchema = new Schema({
  type: {type: String, enum: Object.values(CLOCK_OPS), required: [true, 'type is required']},
  hour: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});
export const Clock = model('Clock', ClockSchema);