import { ITask } from '../models/Task';
import Task from '../models/Task';
import { Types } from 'mongoose';

export interface ITaskRepository {
  create(taskData: Partial<ITask>): Promise<ITask>;
  findById(id: string): Promise<ITask | null>;
  findByToken(token: string): Promise<ITask | null>;
  findByCreator(userId: string): Promise<ITask[]>;
  update(id: string, updateData: Partial<ITask>): Promise<ITask | null>;
  delete(id: string): Promise<boolean>;
}

export class TaskRepository implements ITaskRepository {
  async create(taskData: Partial<ITask>): Promise<ITask> {
    const task = new Task(taskData);
    return task.save();
  }

  async findById(id: string): Promise<ITask | null> {
    return Task.findById(id);
  }

  async findByToken(token: string): Promise<ITask | null> {
    return Task.findOne({ token });
  }

  async findByCreator(userId: string): Promise<ITask[]> {
    return Task.find({ createdBy: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 });
  }

  async update(id: string, updateData: Partial<ITask>): Promise<ITask | null> {
    return Task.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Task.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}