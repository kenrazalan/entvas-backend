import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from '../errors/ValidationError';

/**
 * Middleware to validate request using express-validator
 * @param req Express request object
 * @param _res Express response object
 * @param next Express next function
 */
export const validateRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg
    }));
    throw new ValidationError('Validation failed', validationErrors);
  }
  next();
}; 