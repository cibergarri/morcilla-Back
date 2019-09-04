import { model, Schema } from 'mongoose';

const ProjectSchema = new Schema({
  name: { type: String, required: true },
});
export const Project = model('Project', ProjectSchema);
