import { User, UserProfile, FullUser, UserRole } from '../models/user';
import { callApi } from './api';

// --- User Service Functions ---

export const userService = {
  // Get all users
  getAllUsers: async (token?: string): Promise<FullUser[]> => {
    return callApi<FullUser[]>('/users', 'GET', undefined, token);
  },

  // Get user by ID
  getUserById: async (id: number, token?: string): Promise<FullUser> => {
    return callApi<FullUser>(`/users/${id}`, 'GET', undefined, token);
  },

  // Create a new user
  createUser: async (userData: { email: string; password: string; role: UserRole }, token?: string): Promise<User> => {
    return callApi<User>('/users', 'POST', userData, token);
  },

  // Update an existing user
  updateUser: async (id: number, userData: Partial<User>, token?: string): Promise<User> => {
    return callApi<User>(`/users/${id}`, 'PUT', userData, token);
  },

  // Delete a user
  deleteUser: async (id: number, token?: string): Promise<void> => {
    return callApi<void>(`/users/${id}`, 'DELETE', undefined, token);
  },

  // Get user profile by user ID
  getUserProfile: async (userId: number, token?: string): Promise<UserProfile> => {
    return callApi<UserProfile>(`/users/${userId}/profile`, 'GET', undefined, token);
  },

  // Update user profile
  updateUserProfile: async (userId: number, profileData: Partial<UserProfile>, token?: string): Promise<UserProfile> => {
    return callApi<UserProfile>(`/users/${userId}/profile`, 'PUT', profileData, token);
  },

  // Create a new member profile (profil_membre)
  createProfilMembre: async (profileData: Omit<UserProfile, 'utilisateurId'> & { utilisateurId: number }, token: string): Promise<UserProfile> => {
    return callApi<UserProfile>('/profils/admin', 'POST', profileData, token);
  },

  // Create a user profile for a newly registered user (public endpoint)
  createProfile: async (profileData: UserProfile): Promise<UserProfile> => {
    return callApi<UserProfile>('/profils', 'POST', profileData);
  },
};
