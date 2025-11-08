import { FullUser } from './user'; // Import FullUser

export enum CandidatureStatut {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTEE = 'ACCEPTEE',
  REFUSEE = 'REFUSEE',
}

export interface BourseEmployabilite {
  id: number;
  titre: string;
  description: string;
  criteresEligibilite?: string; // Changed to camelCase
  dateLimiteCandidature?: string; // Changed to camelCase
  creePar: FullUser; // Changed from cree_par_id to nested object
  creeLe: string | null; // Changed to camelCase and nullable
}

export interface CreateBourseEmployabiliteDto {
  titre: string;
  description: string;
  criteresEligibilite?: string; // Changed to camelCase
  dateLimiteCandidature?: string; // Changed to camelCase
  creePar: { id: number }; // Nested object for creation
}

export interface UpdateBourseEmployabiliteDto {
  titre?: string;
  description?: string;
  criteresEligibilite?: string; // Changed to camelCase
  dateLimiteCandidature?: string; // Changed to camelCase
}

export interface CandidatureBourse {
  id: number;
  bourse: BourseEmployabilite; // Changed from bourse_id to nested object
  utilisateur: FullUser; // Changed from utilisateur_id to nested object
  dateCandidature: string | null; // Changed to camelCase and nullable
  statut: CandidatureStatut;
  lettreMotivation?: string; // Changed to camelCase
}

export interface CreateCandidatureBourseDto {
  bourseId: number; // Changed to camelCase
  utilisateurId: number; // Changed to camelCase
  lettreMotivation?: string; // Changed to camelCase
}

export interface UpdateCandidatureBourseDto {
  statut?: CandidatureStatut;
  lettreMotivation?: string; // Changed to camelCase
}
