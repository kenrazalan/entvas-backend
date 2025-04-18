import jwt from 'jsonwebtoken';
import { IUserRepository } from '../repositories/user.repository';
import { IAuthResponse, ILoginInput, IUserInput, IUserResponse } from '../types/user.types';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/config';
import { ApiError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export interface IAuthService {
  register(userData: IUserInput): Promise<IAuthResponse>;
  login(loginData: ILoginInput): Promise<IAuthResponse>;
}

export class AuthService implements IAuthService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async register(userData: IUserInput): Promise<IAuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new ApiError(400, 'Email already registered');
      }

      // Create new user
      const user = await this.userRepository.create(userData);
      
      // Generate token
      const token = this.generateToken(user._id.toString());
      
      logger.info(`User registered: ${user.email}`);
      
      // Return user and token
      return {
        user: this.mapUserToResponse(user),
        token,
      };
    } catch (error) {
      logger.error('Error in register service', error as Error);
      throw error;
    }
  }

  async login(loginData: ILoginInput): Promise<IAuthResponse> {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(loginData.email);
      if (!user) {
        throw new ApiError(401, 'Invalid credentials');
      }

      // Verify password
      const isMatch = await user.comparePassword(loginData.password);
      if (!isMatch) {
        throw new ApiError(401, 'Invalid credentials');
      }

      // Generate token
      const token = this.generateToken(user._id.toString());
      
      logger.info(`User logged in: ${user.email}`);
      
      // Return user and token
      return {
        user: this.mapUserToResponse(user),
        token,
      };
    } catch (error) {
      logger.error('Error in login service', error as Error);
      throw error;
    }
  }


  private generateToken(userId: string): string {
    const payload = { id: userId };
    const options: jwt.SignOptions = { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] };
    return jwt.sign(payload, JWT_SECRET, options);
  }

  private mapUserToResponse(user: any): IUserResponse {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      isManager: user.isManager,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
} 