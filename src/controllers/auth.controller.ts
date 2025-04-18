import { Request, Response } from 'express';
import { IAuthService } from '../services/auth.service';
import { ILoginInput, IUserInput } from '../types/user.types';

export class AuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: IUserInput = req.body;
      const result = await this.authService.register(userData);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData: ILoginInput = req.body;
      const result = await this.authService.login(loginData);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  };
} 