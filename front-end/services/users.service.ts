import { api } from './api';

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'PARTICIPANT' | 'ADMIN';
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'PARTICIPANT' | 'ADMIN';
  createdAt: string;
}

export const usersService = {
  create: async (data: CreateUserDto): Promise<User> => {
    return api.post<User>('/users', data);
  },

  findAll: async (): Promise<User[]> => {
    return api.get<User[]>('/users');
  },

  getProfile: async (): Promise<User> => {
    return api.get<User>('/users/profile');
  },
};
