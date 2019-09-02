import { model, Schema } from 'mongoose';

const schema = new Schema({
  name: { type: String, required: [true, 'name is required'] },
  email: { type: String },
  photo: { type: String },
  githubId: { type: String, required: [true, 'github id is required'] },
  status: {type: String, enum: ['active', 'inactive'], default: 'active'},
});

export const User = model('User', schema);
