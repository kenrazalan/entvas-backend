import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  assigneeEmail: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  token: string;
  tokenExpiry: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    assigneeEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    tokenExpiry: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', taskSchema); 