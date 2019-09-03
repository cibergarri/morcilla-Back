import { model, Schema } from 'mongoose';
import { USER_STATUS } from '../utils/constants';

const schema = new Schema({
  name: { type: String, required: [true, 'name is required'] },
  email: { type: String },
  photo: { type: String },
  githubId: { type: String, required: [true, 'github id is required'] },
  status: {type: String, enum: Object.values(USER_STATUS), default: USER_STATUS.INACTIVE},
});

export const User = model('User', schema);
