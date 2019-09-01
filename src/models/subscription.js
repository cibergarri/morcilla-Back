import { model, Schema } from 'mongoose';

const SubscriptionSchema = new Schema({
  endpoint: { type: String, required: [true, 'endpoint is required'] },
  expirationTime: { type: String},
  keys: {
    p256dh: { type: String },
    auth: { type: String },
  }
});
export const Subscription = model('Subscription', SubscriptionSchema);
