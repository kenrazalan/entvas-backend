import { ITaskRepository } from '../repositories/task.repository';
import { EmailService } from './email.service';
import { ApiError } from '../middleware/errorHandler';
import { ITask } from '../models/Task';
import { logger } from '../utils/logger';

export class TaskService {
  constructor(
    private taskRepository: ITaskRepository,
    private emailService: EmailService
  ) {}

  async createTask(taskData: Partial<ITask>, userId: string): Promise<ITask> {
    try {
      const task = await this.taskRepository.create({
        ...taskData,
        createdBy: userId
      });

    //   await this.emailService.sendTaskApprovalEmail(
    //     task.assigneeEmail,
    //     task.title,
    //     task.token
    //   );

      return task;
    } catch (error) {
      logger.error('Error creating task', error as Error);
      throw error;
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
    return this.taskRepository.update(task.id, { status });
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    if (task.createdBy.toString() !== userId) {
      throw new ApiError(403, 'Not authorized to delete this task');
    }

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
}