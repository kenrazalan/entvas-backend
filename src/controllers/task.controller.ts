import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { IUser } from '../models/User';

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
      
      // Check if createdBy is populated
      const creator = task.createdBy as IUser;
      
      res.json({
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        isExpired: task.tokenExpiry < new Date(),
        canRespond: task.status === 'PENDING' && task.tokenExpiry > new Date(),
        creator: {
          name: creator.name || 'Unknown',
          email: creator.email || 'Unknown'
        }
      });
    } catch (error) {
      throw error;
    }
  };

  getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await this.taskService.getTaskById(req.params.id, req.user.id);
      res.json(task);
    } catch (error) {
      throw error;
    }
  };

  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await this.taskService.updateTask(req.params.id, req.body, req.user.id);
      res.json(task);
    } catch (error) {
      throw error;
    }
  };

  sendTaskApprovalEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.taskService.sendTaskApprovalEmail(req.params.id, req.user.id);
      res.status(200).json({ message: 'Approval email sent successfully' });
    } catch (error) {
      throw error;
    }
  };
}