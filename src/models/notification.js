import { model, Schema } from 'mongoose';

const NotificationSchema = new Schema({
  type: { type: String, enum: ['mail', 'push'], required: [true, 'type is required'] },
  title: { type: String },
  body: { type: String },
  origin: { type: Schema.Types.ObjectId, ref: 'User' },
  destination: { type: Schema.Types.ObjectId, ref: 'User' },
  question: { type: Schema.Types.ObjectId, ref: 'Question' },
  status: { type: String, enum: ['pending', 'sent', 'errored'], default: 'pending' },
});
export const Notification = model('Notification', NotificationSchema);
