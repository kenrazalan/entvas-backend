import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from './User';

export interface ITask extends Document {
  title: string;
  description: string;
  assigneeEmail: string;
  createdBy: mongoose.Types.ObjectId | IUser;
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
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    assigneeEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    token: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4()
    },
    tokenExpiry: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
  },
  { timestamps: true }
);

// Index for token lookups
taskSchema.index({ token: 1 });

// Index for user's tasks
taskSchema.index({ createdBy: 1, createdAt: -1 });

export default mongoose.model<ITask>('Task', taskSchema);