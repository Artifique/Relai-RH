import { callApi } from './api';
import { UserRole } from '../models/user';

export interface AuthResponse {
  token: string;
  type: string; // "Bearer"
  id: number;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const authService = {
  signin: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return callApi<AuthResponse>('/auth/signin', 'POST', credentials);
  },

  // Potentially add other auth methods like signup, refresh token, etc.
};
