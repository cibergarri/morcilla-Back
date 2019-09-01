import { model, Schema } from 'mongoose';

const schema = new Schema({
  name: { type: String, required: [true, 'name is required'] },
  githubId: { type: String, required: [true, 'github id is required'] },
  subscriptions: { type : [
    { type: Schema.Types.ObjectId, ref: 'Subscription' },
  ] },
  // geolocation: {
  //   type: {
  //     type: String,
  //     enum: ['Point'],
  //   },
  //   coordinates: {
  //     type: [Number],
  //   },
  // },
});
// schema.index({ location: '2dsphere' });
export const User = model('User', schema);
