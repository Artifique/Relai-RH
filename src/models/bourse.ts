export enum CandidatureStatut {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTEE = 'ACCEPTEE',
  REFUSEE = 'REFUSEE',
}

export interface BourseEmployabilite {
  id: number;
  titre: string;
  description: string;
  criteres_eligibilite?: string;
  date_limite_candidature?: string; // ISO date string
  cree_par_id: number;
  cree_le: string; // ISO date string
}

export interface CreateBourseEmployabiliteDto {
  titre: string;
  description: string;
  criteres_eligibilite?: string;
  date_limite_candidature?: string;
  cree_par_id: number;
}

export interface UpdateBourseEmployabiliteDto {
  titre?: string;
  description?: string;
  criteres_eligibilite?: string;
  date_limite_candidature?: string;
}

export interface CandidatureBourse {
  id: number;
  bourse_id: number;
  utilisateur_id: number;
  date_candidature: string; // ISO date string
  statut: CandidatureStatut;
  lettre_motivation?: string;
}

export interface CreateCandidatureBourseDto {
  bourse_id: number;
  utilisateur_id: number;
  lettre_motivation?: string;
}

export interface UpdateCandidatureBourseDto {
  statut?: CandidatureStatut;
  lettre_motivation?: string;
}
