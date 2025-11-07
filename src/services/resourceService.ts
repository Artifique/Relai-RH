import { RessourceLaboCompetences, CreateRessourceLaboCompetencesDto, UpdateRessourceLaboCompetencesDto } from '../models/resource';
import { callApi } from './api';

// --- Resource Service Functions ---

export const resourceService = {
  // Get all resources
  getAllResources: async (token?: string): Promise<RessourceLaboCompetences[]> => {
    return callApi<RessourceLaboCompetences[]>('/resources', 'GET', undefined, token);
  },

  // Get resource by ID
  getResourceById: async (id: number, token?: string): Promise<RessourceLaboCompetences> => {
    return callApi<RessourceLaboCompetences>(`/resources/${id}`, 'GET', undefined, token);
  },

  // Create a new resource
  createResource: async (resourceData: CreateRessourceLaboCompetencesDto, token?: string): Promise<RessourceLaboCompetences> => {
    return callApi<RessourceLaboCompetences>('/resources', 'POST', resourceData, token);
  },

  // Update an existing resource
  updateResource: async (id: number, resourceData: UpdateRessourceLaboCompetencesDto, token?: string): Promise<RessourceLaboCompetences> => {
    return callApi<RessourceLaboCompetences>(`/resources/${id}`, 'PUT', resourceData, token);
  },

  // Delete a resource
  deleteResource: async (id: number, token?: string): Promise<void> => {
    return callApi<void>(`/resources/${id}`, 'DELETE', undefined, token);
  },
};
