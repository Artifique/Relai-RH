import { University } from '../models/university';
import { callApi } from './api';

// --- University Service Functions ---

export const universityService = {
  // Get all universities
  getAllUniversities: async (token?: string): Promise<University[]> => {
    return callApi<University[]>('/universites', 'GET', undefined, token);
  },

  // Get university by ID
  getUniversityById: async (id: number, token?: string): Promise<University> => {
    return callApi<University>(`/universites/${id}`, 'GET', undefined, token);
  },

  // Create a new university
  createUniversity: async (formData: FormData, token?: string): Promise<University> => {
    return callApi<University>('/universites', 'POST', formData, token);
  },

  // Update an existing university
  updateUniversity: async (id: number, formData: FormData, token?: string): Promise<University> => {
    return callApi<University>(`/universites/${id}`, 'PUT', formData, token);
  },

  // Delete a university
  deleteUniversity: async (id: number, token?: string): Promise<void> => {
    return callApi<void>(`/universites/${id}`, 'DELETE', undefined, token);
  },
};
