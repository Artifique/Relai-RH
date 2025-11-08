// src/services/offreEmploiService.ts

import { callApi } from './api';
import { OffreEmploi } from '../models/offreEmploi';

const BASE_URL = '/offres-emploi'; // Assurez-vous que c'est le bon endpoint API

export const offreEmploiService = {
  getAllOffresEmploi: async (token?: string): Promise<OffreEmploi[]> => {
    const response = await callApi<OffreEmploi[]>(BASE_URL, 'GET', undefined, token);
    return response;
  },

  getOffreEmploiById: async (id: number): Promise<OffreEmploi> => {
    const response = await callApi<OffreEmploi>(`${BASE_URL}/${id}`, 'GET');
    return response;
  },

  createOffreEmploi: async (formData: FormData, token: string): Promise<OffreEmploi> => {
    const response = await callApi<OffreEmploi>(BASE_URL, 'POST', formData, token);
    return response;
  },

  updateOffreEmploi: async (id: number, formData: FormData, token: string): Promise<OffreEmploi> => {
    const response = await callApi<OffreEmploi>(`${BASE_URL}/${id}`, 'PUT', formData, token);
    return response;
  },

  deleteOffreEmploi: async (id: number, token: string): Promise<void> => {
    await callApi<void>(`${BASE_URL}/${id}`, 'DELETE', undefined, token);
  },
};
