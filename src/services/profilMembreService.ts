// src/services/profilMembreService.ts

import { callApi } from './api';
import { UserProfile } from '../models/user'; // Utilise l'interface UserProfile existante

const BASE_URL = '/profils'; // Endpoint pour les profils membres

export const profilMembreService = {
  getProfilMembreById: async (utilisateurId: number): Promise<UserProfile> => {
    const response = await callApi<UserProfile>(`${BASE_URL}/${utilisateurId}`, 'GET');
    return response;
  },

  createProfilMembre: async (profil: Omit<UserProfile, 'utilisateurId'> & { utilisateurId: number }, token: string): Promise<UserProfile> => {
    const response = await callApi<UserProfile>(`${BASE_URL}/admin`, 'POST', profil, token); // Utilise /admin endpoint
    return response;
  },

  updateProfilMembre: async (utilisateurId: number, profil: Partial<UserProfile>, token: string): Promise<UserProfile> => {
    const response = await callApi<UserProfile>(`${BASE_URL}/${utilisateurId}`, 'PUT', profil, token);
    return response;
  },

  deleteProfilMembre: async (utilisateurId: number, token: string): Promise<void> => {
    await callApi<void>(`${BASE_URL}/${utilisateurId}`, 'DELETE', undefined, token);
  },

  getAllProfilsMembres: async (token?: string): Promise<UserProfile[]> => {
    return callApi<UserProfile[]>(BASE_URL, 'GET', undefined, token);
  },
};
