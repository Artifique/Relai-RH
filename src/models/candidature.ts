// src/models/candidature.ts

export enum StatutCandidature {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTEE = 'ACCEPTEE',
  REFUSEE = 'REFUSEE',
  RETENUE = 'RETENUE',
}

export interface Candidature {
  id: number;
  offre_emploi_id: number;
  utilisateur_id: number;
  date_candidature: string; // ISO date string
  statut: StatutCandidature;
  cv_url?: string;
  lettre_motivation_url?: string;
  // Potentiellement d'autres champs comme le nom de l'offre, l'email de l'utilisateur, etc.
  // qui seraient populés par le backend ou récupérés via des jointures.
}

export interface CreateCandidatureDto {
  offre_emploi_id: number;
  utilisateur_id: number;
  statut: StatutCandidature;
  cv_file?: File; // For file upload
  lettre_motivation_file?: File; // For file upload
}

export interface UpdateCandidatureDto {
  offre_emploi_id?: number;
  utilisateur_id?: number;
  statut?: StatutCandidature;
  cv_file?: File; // For file upload
  lettre_motivation_file?: File; // For file upload
}
