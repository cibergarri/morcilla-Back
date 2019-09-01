import { model, Schema } from 'mongoose';

const SubscriptionSchema = new Schema({
  endpoint: { type: String, required: [true, 'endpoint is required'] },
  expirationTime: { type: String},
  keys: {
    p256dh: { type: String },
    auth: { type: String },
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});
export const Subscription = model('Subscription', SubscriptionSchema);
