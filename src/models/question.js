import { model, Schema } from 'mongoose';

const AnswerSchema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: 'Question' },
  text: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const QuestionSchema = new Schema({
  topic: { type: Schema.Types.ObjectId, ref: 'Topic' },
  text: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const TopicSchema = new Schema({
  title: {type: String, required: [true, 'title is required']},
  description: {type: String},
});

export const Answer = model('Answer', AnswerSchema);
export const Question = model('Question', QuestionSchema);
export const Topic = model('Topic', TopicSchema);

