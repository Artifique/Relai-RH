import { BourseEmployabilite, CreateBourseEmployabiliteDto, UpdateBourseEmployabiliteDto, CandidatureBourse, CreateCandidatureBourseDto, UpdateCandidatureBourseDto } from '../models/bourse';
import { callApi } from './api';

// --- Bourse Service Functions ---

export const bourseService = {
  // Get all bourses
  getAllBourses: async (token?: string): Promise<BourseEmployabilite[]> => {
    return callApi<BourseEmployabilite[]>('/bourses', 'GET', undefined, token);
  },

  // Get bourse by ID
  getBourseById: async (id: number, token?: string): Promise<BourseEmployabilite> => {
    return callApi<BourseEmployabilite>(`/bourses/${id}`, 'GET', undefined, token);
  },

  // Create a new bourse
  createBourse: async (bourseData: CreateBourseEmployabiliteDto, token?: string): Promise<BourseEmployabilite> => {
    return callApi<BourseEmployabilite>('/bourses', 'POST', bourseData, token);
  },

  // Update an existing bourse
  updateBourse: async (id: number, bourseData: UpdateBourseEmployabiliteDto, token?: string): Promise<BourseEmployabilite> => {
    return callApi<BourseEmployabilite>(`/bourses/${id}`, 'PUT', bourseData, token);
  },

  // Delete a bourse
  deleteBourse: async (id: number, token?: string): Promise<void> => {
    return callApi<void>(`/bourses/${id}`, 'DELETE', undefined, token);
  },

  // --- Candidature Bourse Functions ---

  // Get all candidatures for a specific bourse
  getCandidaturesByBourseId: async (bourseId: number, token?: string): Promise<CandidatureBourse[]> => {
    return callApi<CandidatureBourse[]>(`/bourses/${bourseId}/candidatures`, 'GET', undefined, token);
  },

  // Get a specific candidature
  getCandidatureById: async (id: number, token?: string): Promise<CandidatureBourse> => {
    return callApi<CandidatureBourse>(`/candidatures/${id}`, 'GET', undefined, token);
  },

  // Create a new candidature
  createCandidature: async (candidatureData: CreateCandidatureBourseDto, token?: string): Promise<CandidatureBourse> => {
    return callApi<CandidatureBourse>('/candidatures', 'POST', candidatureData, token);
  },

  // Update an existing candidature
  updateCandidature: async (id: number, candidatureData: UpdateCandidatureBourseDto, token?: string): Promise<CandidatureBourse> => {
    return callApi<CandidatureBourse>(`/candidatures/${id}`, 'PUT', candidatureData, token);
  },

  // Delete a candidature
  deleteCandidature: async (id: number, token?: string): Promise<void> => {
    return callApi<void>(`/candidatures/${id}`, 'DELETE', undefined, token);
  },
};
