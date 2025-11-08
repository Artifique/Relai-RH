// src/services/offreEmploiService.ts

import { callApi } from './api';
import { OffreEmploi } from '../models/activity'; // Updated import path

const BASE_URL = '/offres'; // Assurez-vous que c'est le bon endpoint API

export const offreEmploiService = {
  getAllOffresEmploi: async (token?: string): Promise<OffreEmploi[]> => {
    const response = await callApi<OffreEmploi[]>(BASE_URL, 'GET', undefined, token);
    return response;
  },

  getOffreEmploiById: async (id: number): Promise<OffreEmploi> => {
    const response = await callApi<OffreEmploi>(`${BASE_URL}/${id}`, 'GET');
    return response;
  },

  createOffreEmploiWithImage: async (formData: FormData, token: string): Promise<OffreEmploi> => {
    const response = await callApi<OffreEmploi>(BASE_URL, 'POST', formData, token);
    return response;
  },

  updateOffreEmploiWithImage: async (id: number, formData: FormData, token: string): Promise<OffreEmploi> => {
    const response = await callApi<OffreEmploi>(`${BASE_URL}/${id}`, 'PUT', formData, token);
    return response;
  },

  deleteOffreEmploi: async (id: number, token: string): Promise<void> => {
    await callApi<void>(`${BASE_URL}/${id}`, 'DELETE', undefined, token);
  },
};
