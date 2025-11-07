// src/services/offreEmploiService.ts

import { callApi } from './api';
import { OffreEmploi } from '../models/offreEmploi';

const BASE_URL = '/offres-emploi'; // Assurez-vous que c'est le bon endpoint API

export const offreEmploiService = {
  getAllOffresEmploi: async (): Promise<OffreEmploi[]> => {
    const response = await callApi<OffreEmploi[]>(BASE_URL, 'GET');
    return response;
  },

  getOffreEmploiById: async (id: number): Promise<OffreEmploi> => {
    const response = await callApi<OffreEmploi>(`${BASE_URL}/${id}`, 'GET');
    return response;
  },

  createOffreEmploi: async (offre: Omit<OffreEmploi, 'id' | 'cree_le'>, token: string): Promise<OffreEmploi> => {
    const response = await callApi<OffreEmploi>(BASE_URL, 'POST', offre, token);
    return response;
  },

  updateOffreEmploi: async (id: number, offre: Partial<OffreEmploi>, token: string): Promise<OffreEmploi> => {
    const response = await callApi<OffreEmploi>(`${BASE_URL}/${id}`, 'PUT', offre, token);
    return response;
  },

  deleteOffreEmploi: async (id: number, token: string): Promise<void> => {
    await callApi<void>(`${BASE_URL}/${id}`, 'DELETE', undefined, token);
  },
};
