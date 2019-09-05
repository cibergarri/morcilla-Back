import { model, Schema } from 'mongoose';
import { NOTIFICATION_STATUS } from '../utils/constants';

const NotificationSchema = new Schema({
  type: { type: String, enum: ['mail', 'push'], required: [true, 'type is required'] },
  title: { type: String },
  body: { type: String },
  origin: { type: Schema.Types.ObjectId, ref: 'User' },
  destination: { type: Schema.Types.ObjectId, ref: 'User' },
  question: { type: Schema.Types.ObjectId, ref: 'Question' },
  status: { type: String, enum: Object.values(NOTIFICATION_STATUS), default: NOTIFICATION_STATUS.PENDING },
});
export const Notification = model('Notification', NotificationSchema);
