import { University } from './university'; // Assuming University interface is defined here
import { FullUser } from './user'; // Assuming FullUser interface is defined here

export enum TypeActivite {
  EVENEMENT = 'EVENEMENT',
  ATELIER = 'ATELIER',
  OFFRE_EMPLOI = 'OFFRE_EMPLOI', // Note: This is also a separate table now
}

export enum TypeContrat {
  CDI = 'CDI',
  CDD = 'CDD',
  STAGE = 'STAGE',
  ALTERNANCE = 'ALTERNANCE',
  FREELANCE = 'FREELANCE',
  AUTRE = 'AUTRE',
}

export interface Activite {
  id: number;
  titre: string;
  description: string;
  type_activite: TypeActivite;
  date_activite: string; // ISO date string
  lieu?: string;
  imageUrl?: string; // Added imageUrl
  universite: University; // Changed from universite_id to nested object
  publiePar: FullUser; // Changed from publie_par_id to nested object
  cree_le: string; // ISO date string
}

export interface CreateActiviteDto {
  titre: string;
  description: string;
  type_activite: TypeActivite;
  date_activite: string;
  lieu?: string;
  imageUrl?: string; // Added imageUrl
  universite_id: number;
  publie_par_id: number;
}

export interface UpdateActiviteDto {
  titre?: string;
  description?: string;
  type_activite?: TypeActivite;
  date_activite?: string;
  lieu?: string;
  imageUrl?: string; // Added imageUrl
  universite_id?: number;
  publie_par_id?: number;
}

export interface OffreEmploi {
  id: number;
  titre: string;
  description: string;
  entreprise?: string;
  lieu?: string;
  type_contrat?: TypeContrat;
  date_limite_candidature?: string; // ISO date string
  publie_par_id?: number;
  cree_le: string; // ISO date string
  lien?: string;
}

export interface CreateOffreEmploiDto {
  titre: string;
  description: string;
  entreprise?: string;
  lieu?: string;
  type_contrat?: TypeContrat;
  date_limite_candidature?: string;
  publie_par_id?: number;
  lien?: string;
}

export interface UpdateOffreEmploiDto {
  titre?: string;
  description?: string;
  entreprise?: string;
  lieu?: string;
  type_contrat?: TypeContrat;
  date_limite_candidature?: string;
  publie_par_id?: number;
  lien?: string;
}
