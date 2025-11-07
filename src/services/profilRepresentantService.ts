// src/services/profilRepresentantService.ts

import { callApi } from './api';
import { ProfilRepresentant } from '../models/profilRepresentant';

const BASE_URL = '/profils-representants'; // Assurez-vous que c'est le bon endpoint API

export const profilRepresentantService = {
  getProfilRepresentantById: async (utilisateur_id: number): Promise<ProfilRepresentant> => {
    const response = await callApi<ProfilRepresentant>(`${BASE_URL}/${utilisateur_id}`, 'GET');
    return response;
  },

  createProfilRepresentant: async (profil: ProfilRepresentant, token: string): Promise<ProfilRepresentant> => {
    const response = await callApi<ProfilRepresentant>(BASE_URL, 'POST', profil, token);
    return response;
  },

  updateProfilRepresentant: async (utilisateur_id: number, profil: Partial<ProfilRepresentant>, token: string): Promise<ProfilRepresentant> => {
    const response = await callApi<ProfilRepresentant>(`${BASE_URL}/${utilisateur_id}`, 'PUT', profil, token);
    return response;
  },

  deleteProfilRepresentant: async (utilisateur_id: number, token: string): Promise<void> => {
    await callApi<void>(`${BASE_URL}/${utilisateur_id}`, 'DELETE', undefined, token);
  },

  getAllProfilsRepresentants: async (token?: string): Promise<ProfilRepresentant[]> => {
    return callApi<ProfilRepresentant[]>(BASE_URL, 'GET', undefined, token);
  },
};
