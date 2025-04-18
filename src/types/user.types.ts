import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  isManager: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
  _id: any;
  __v: number;
}

export interface IUserInput {
  email: string;
  password: string;
  name: string;
  isManager?: boolean;
}

export interface IUserResponse {
  id: string;
  email: string;
  name: string;
  isManager: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthResponse {
  user: IUserResponse;
  token: string;
}

export interface ILoginInput {
  email: string;
  password: string;
} 