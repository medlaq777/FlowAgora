import { api } from './api';

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export const authService = {
  login: async (credentials: LoginDto): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/login', credentials);
  },
};
