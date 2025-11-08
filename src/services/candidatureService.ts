// src/services/candidatureService.ts

import { callApi } from './api';
import { CandidatureBourse } from '../models/bourse'; // Updated import

const BASE_URL = '/candidatures'; // Assurez-vous que c'est le bon endpoint API

export const candidatureService = {
  getAllCandidatures: async (token?: string): Promise<CandidatureBourse[]> => {
    const response = await callApi<CandidatureBourse[]>(BASE_URL, 'GET', undefined, token);
    return response;
  },

  getCandidatureById: async (id: number, token?: string): Promise<CandidatureBourse> => {
    const response = await callApi<CandidatureBourse>(`${BASE_URL}/${id}`, 'GET', undefined, token);
    return response;
  },

  deleteCandidature: async (id: number, token: string): Promise<void> => {
    await callApi<void>(`${BASE_URL}/${id}`, 'DELETE', undefined, token);
  },
};
