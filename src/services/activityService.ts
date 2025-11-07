import { Activite, CreateActiviteDto, UpdateActiviteDto, OffreEmploi, CreateOffreEmploiDto, UpdateOffreEmploiDto } from '../models/activity';
import { callApi } from './api';

// --- Activity Service Functions ---

export const activityService = {
  // Get all activities
  getAllActivities: async (token?: string): Promise<Activite[]> => {
    return callApi<Activite[]>('/activities', 'GET', undefined, token);
  },

  // Get activity by ID
  getActivityById: async (id: number, token?: string): Promise<Activite> => {
    return callApi<Activite>(`/activities/${id}`, 'GET', undefined, token);
  },

  // Create a new activity
  createActivity: async (activityData: CreateActiviteDto, token?: string): Promise<Activite> => {
    return callApi<Activite>('/activities', 'POST', activityData, token);
  },

  // Update an existing activity
  updateActivity: async (id: number, activityData: UpdateActiviteDto, token?: string): Promise<Activite> => {
    return callApi<Activite>(`/activities/${id}`, 'PUT', activityData, token);
  },

  // Delete an activity
  deleteActivity: async (id: number, token?: string): Promise<void> => {
    return callApi<void>(`/activities/${id}`, 'DELETE', undefined, token);
  },

  // --- Job Offer Service Functions ---

  // Get all job offers
  getAllJobOffers: async (token?: string): Promise<OffreEmploi[]> => {
    return callApi<OffreEmploi[]>('/job-offers', 'GET', undefined, token);
  },

  // Get job offer by ID
  getJobOfferById: async (id: number, token?: string): Promise<OffreEmploi> => {
    return callApi<OffreEmploi>(`/job-offers/${id}`, 'GET', undefined, token);
  },

  // Create a new job offer
  createJobOffer: async (jobOfferData: CreateOffreEmploiDto, token?: string): Promise<OffreEmploi> => {
    return callApi<OffreEmploi>('/job-offers', 'POST', jobOfferData, token);
  },

  // Update an existing job offer
  updateJobOffer: async (id: number, jobOfferData: UpdateOffreEmploiDto, token?: string): Promise<OffreEmploi> => {
    return callApi<OffreEmploi>(`/job-offers/${id}`, 'PUT', jobOfferData, token);
  },

  // Delete a job offer
  deleteJobOffer: async (id: number, token?: string): Promise<void> => {
    return callApi<void>(`/job-offers/${id}`, 'DELETE', undefined, token);
  },
};
