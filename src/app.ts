import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Basic route for testing
app.get('/', (_req: Request, res: Response) => {
  res.send('Server is running!');
});

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler - Keep this last
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Use port 3001 instead of 5000
const PORT = process.env.PORT || 3001;

// // Start server
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`⚡️ Server is running at http://localhost:${PORT}`);
//   console.log('Available routes:');
//   console.log('GET  / - Basic server test');
//   console.log('GET  /health - Server health check');
//   console.log('POST /api/auth/register - User registration');
// });

export default app;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 