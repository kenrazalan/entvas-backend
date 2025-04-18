import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { IAuthService } from '../services/auth.service';
import { registerValidation, loginValidation } from '../validations/auth.validation';

export const createAuthRoutes = (authService: IAuthService): Router => {
  const router = Router();
  const authController = new AuthController(authService);

  // User registration route 
  router.post('/register', registerValidation, authController.register);

  // User login route 
  router.post('/login', loginValidation, authController.login);

  return router;
}; 