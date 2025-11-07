import { callApi } from './api';
import { UserRole } from '../models/user';

export interface AuthSignInResponse {
  token: string;
  type: string; // "Bearer"
  id: number;
  email: string;
  role: UserRole;
}

export interface AuthSignUpResponse {
  message?: string;
  userId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const authService = {
  signin: async (credentials: LoginRequest): Promise<AuthSignInResponse> => {
    return callApi<AuthSignInResponse>('/auth/signin', 'POST', credentials);
  },

  signup: async (userData: { email: string; password: string; role: UserRole }): Promise<AuthSignUpResponse> => {
    return callApi<AuthSignUpResponse>('/auth/signup', 'POST', userData);
  },

  // Potentially add other auth methods like signup, refresh token, etc.
};
