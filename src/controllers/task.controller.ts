import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';

export class TaskController {
  constructor(private taskService: TaskService) {}

  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await this.taskService.createTask(req.body, req.user.id);
      res.status(201).json(task);
    } catch (error) {
      throw error;
    }
  };

  getUserTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const tasks = await this.taskService.getUserTasks(req.user.id);
      res.json(tasks);
    } catch (error) {
      throw error;
    }
  };

  handleTaskResponse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.params;
      const { approve } = req.body;
      const task = await this.taskService.handleTaskResponse(token, approve);
      res.json(task);
    } catch (error) {
      throw error;
    }
  };

  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.taskService.deleteTask(req.params.id, req.user.id);
      res.status(204).send();
    } catch (error) {
      throw error;
    }
  };

  getTaskByToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.params;
      const task = await this.taskService.getTaskByToken(token);
      
      
      res.json({
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        isExpired: task.tokenExpiry < new Date(),
        canRespond: task.status === 'PENDING' && task.tokenExpiry > new Date()
      });
    } catch (error) {
      throw error;
    }
  };
}