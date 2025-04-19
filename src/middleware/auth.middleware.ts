import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';
import { ApiError } from './errorHandler';
import { UserRepository } from '../repositories/user.repository';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const userRepository = new UserRepository();
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(new ApiError(401, 'Please authenticate'));
  }
};

export const requireManager = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user.isManager) {
      throw new ApiError(403, 'Access denied. Manager role required.');
    }
    next();
  } catch (error) {
    next(error);
  }
};