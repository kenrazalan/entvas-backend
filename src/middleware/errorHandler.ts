import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ValidationError } from '../errors/ValidationError';
import { logger } from '../utils/logger';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ValidationError) {
    logger.warn('Validation error:', { errors: err.errors });
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      errors: err.errors
    });
    return;
  }

  if (err instanceof ApiError) {
    if (err.isOperational) {
      logger.warn('Operational error:', { error: err.message });
      res.status(err.statusCode).json({
        status: 'error',
        message: err.message
      });
      return;
    }
  }

  // Unexpected errors
  logger.error('Unexpected error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};

// Not found handler
export const notFoundHandler = (req: Request, res: Response) => {
  logger.warn(`Route not found: ${req.originalUrl}`);
  
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
};