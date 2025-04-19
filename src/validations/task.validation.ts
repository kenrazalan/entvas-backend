import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

export const taskValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 100 })
      .withMessage('Title must be at most 100 characters'),

    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required'),

    body('assigneeEmail')
      .trim()
      .isEmail()
      .withMessage('Valid email address is required')
      .normalizeEmail(),

    validateRequest
  ]
};