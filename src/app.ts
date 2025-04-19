import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/database';
import { createAuthRoutes } from './routes/auth.routes';
import { AuthService } from './services/auth.service';
import { UserRepository } from './repositories/user.repository';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { PORT, NODE_ENV } from './config/config';
import { TaskRepository } from './repositories/task.repository';
import { EmailService } from './services/email.service';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';
import { createTaskRoutes } from './routes/task.routes';


// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize dependencies
let userRepository: UserRepository;
let authService: AuthService;

// Initialize task-related dependencies
const taskRepository = new TaskRepository();
const emailService = new EmailService();
const taskService = new TaskService(taskRepository, emailService);
const taskController = new TaskController(taskService);

// Initialize app
const initializeApp = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Initialize repositories and services after DB connection
    userRepository = new UserRepository();
    authService = new AuthService(userRepository);
    
    // Routes
    app.get('/', (_req: Request, res: Response) => {
      res.json({ message: 'Welcome to the API' });
    });

    // Health check route
    app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({
        status: 'ok',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
      });
    });

    // API routes
    app.use('/api/auth', createAuthRoutes(authService));
    app.use('/api/tasks', createTaskRoutes(taskController));


    // 404 handler - Keep this last
    app.use(notFoundHandler);

    // Error handling middleware
    app.use(errorHandler);

    // Start server
    if (NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        logger.info(`Server is running at http://localhost:${PORT}`);
        logger.info('Available routes:');
        logger.info('GET  / - Basic server test');
        logger.info('GET  /health - Server health check');
        logger.info('POST /api/auth/register - User registration');
        logger.info('POST /api/auth/login - User login');
      });
    }
  } catch (error) {
    logger.error('Failed to initialize application', error as Error);
    process.exit(1);
  }
};

// Start the application
initializeApp();

export default app;