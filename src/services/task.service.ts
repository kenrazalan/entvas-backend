import { ITaskRepository } from '../repositories/task.repository';
import { EmailService } from './email.service';
import { ApiError } from '../middleware/errorHandler';
import { ITask } from '../models/Task';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/User';

export class TaskService {
  constructor(
    private taskRepository: ITaskRepository,
    private emailService: EmailService
  ) {}

  async createTask(taskData: Partial<ITask>, userId: string): Promise<ITask> {
    try {
      const task = await this.taskRepository.create({
        ...taskData,
        createdBy: new mongoose.Types.ObjectId(userId)
      });

      return task;
    } catch (error) {
      logger.error('Error creating task', error as Error);
      throw error;
    }
  }

  async sendTaskApprovalEmail(taskId: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    this.checkTaskOwnership(task, userId, 'send approval email for');

    if (task.status !== 'PENDING') {
      throw new ApiError(400, 'Cannot send approval email for a task that is not pending');
    }

    try {
      await this.emailService.sendTaskApprovalEmail(
        task.assigneeEmail,
        task.title,
        task.token
      );
      
      logger.info(`Approval email sent for task: ${taskId}`);
    } catch (error) {
      logger.error('Error sending task approval email', error as Error);
      throw new ApiError(500, 'Failed to send approval email');
    }
  }

  async getUserTasks(userId: string): Promise<ITask[]> {
    return this.taskRepository.findByCreator(userId);
  }

  async handleTaskResponse(token: string, approve: boolean): Promise<ITask> {
    const task = await this.taskRepository.findByToken(token);

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    if (task.status !== 'PENDING') {
      throw new ApiError(400, 'Task has already been processed');
    }

    if (task.tokenExpiry < new Date()) {
      throw new ApiError(400, 'Task approval link has expired');
    }

    const status = approve ? 'APPROVED' : 'REJECTED';
    const updatedTask = await this.taskRepository.update(task.id, { status });
    if (!updatedTask) {
      throw new ApiError(500, 'Failed to update task');
    }
    return updatedTask;
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    this.checkTaskOwnership(task, userId, 'delete');

    const deleted = await this.taskRepository.delete(taskId);
    if (!deleted) {
      throw new ApiError(500, 'Failed to delete task');
    }
  }

  async getTaskByToken(token: string): Promise<ITask> {
    const task = await this.taskRepository.findByToken(token);

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    if (task.tokenExpiry < new Date()) {
      throw new ApiError(400, 'Task approval link has expired');
    }

    if (task.status !== 'PENDING') {
      throw new ApiError(400, 'This task has already been processed');
    }

    return task;
  }

  async getTaskById(taskId: string, userId: string): Promise<ITask> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    this.checkTaskOwnership(task, userId, 'view');

    return task;
  }

  async updateTask(taskId: string, updateData: Partial<ITask>, userId: string): Promise<ITask> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    this.checkTaskOwnership(task, userId, 'update');

    // If status is being updated to APPROVED or REJECTED, prevent it
    if (updateData.status && (updateData.status === 'APPROVED' || updateData.status === 'REJECTED')) {
      throw new ApiError(400, 'Cannot directly update task status. Use the response endpoint instead.');
    }

    const updatedTask = await this.taskRepository.update(taskId, updateData);
    if (!updatedTask) {
      throw new ApiError(500, 'Failed to update task');
    }

    return updatedTask;
  }

  private getCreatedById(task: ITask): string {
    return task.createdBy instanceof mongoose.Types.ObjectId
      ? task.createdBy.toString()
      : ((task.createdBy as unknown as IUser)._id as mongoose.Types.ObjectId).toString();
  }

  private checkTaskOwnership(task: ITask, userId: string, action: string): void {
    const createdById = this.getCreatedById(task);
    if (createdById !== userId) {
      throw new ApiError(403, `Not authorized to ${action} this task`);
    }
  }

}