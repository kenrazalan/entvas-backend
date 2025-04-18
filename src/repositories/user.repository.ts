import { IUser, IUserInput } from '../types/user.types';
import User from '../models/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(userData: IUserInput): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
}

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async create(userData: IUserInput): Promise<IUser> {
    const user = new User(userData);
    // @ts-ignore - Ignoring type error as we know the model has timestamps
    return user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }
} 