import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { auth, requireManager } from '../middleware/auth.middleware';
import { taskValidation } from '../validations/task.validation';


export const createTaskRoutes = (taskController: TaskController): Router => {
  const router = Router();
  // Public route for handling task responses
  router.post('/respond/:token', taskController.handleTaskResponse);
  router.get('/view/:token', taskController.getTaskByToken);
  
  // Protected routes (require authentication)
  router.use(auth);

  // Manager-only routes
  router.post('/', requireManager, taskValidation.create, taskController.createTask);
  router.get('/', requireManager, taskController.getUserTasks);
  router.delete('/:id', requireManager, taskController.deleteTask);




  return router;
};