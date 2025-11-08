// src/services/candidatureService.ts

import { callApi } from './api';
import { Candidature } from '../models/candidature';

const BASE_URL = '/candidatures'; // Assurez-vous que c'est le bon endpoint API

export const candidatureService = {
  getAllCandidatures: async (token?: string): Promise<Candidature[]> => {
    const response = await callApi<Candidature[]>(BASE_URL, 'GET', undefined, token);
    return response;
  },

  getCandidatureById: async (id: number, token?: string): Promise<Candidature> => {
    const response = await callApi<Candidature>(`${BASE_URL}/${id}`, 'GET', undefined, token);
    return response;
  },

  createCandidature: async (formData: FormData, token: string): Promise<Candidature> => {
    const response = await callApi<Candidature>(BASE_URL, 'POST', formData, token);
    return response;
  },

  updateCandidature: async (id: number, formData: FormData, token: string): Promise<Candidature> => {
    const response = await callApi<Candidature>(`${BASE_URL}/${id}`, 'PUT', formData, token);
    return response;
  },

  deleteCandidature: async (id: number, token: string): Promise<void> => {
    await callApi<void>(`${BASE_URL}/${id}`, 'DELETE', undefined, token);
  },
};
