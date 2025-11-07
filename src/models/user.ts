export enum UserRole {
  ETUDIANT = 'ETUDIANT',
  DIPLOME = 'DIPLOME',
  DEMANDEUR_EMPLOI = 'DEMANDEUR_EMPLOI',
  REPRESENTANT_UNIVERSITE = 'REPRESENTANT_UNIVERSITE',
  ADMINISTRATEUR = 'ADMINISTRATEUR',
}

export enum Sexe {
  M = 'M',
  F = 'F',
}

export enum StatutActuel {
  ETUDIANT = 'ETUDIANT',
  DIPLOME_SANS_EMPLOI = 'DIPLOME_SANS_EMPLOI',
  DEMANDEUR_EMPLOI = 'DEMANDEUR_EMPLOI',
  JEUNE_RECONVERSION = 'JEUNE_RECONVERSION',
}

export enum TypeEmploiRecherche {
  PUBLIC = 'PUBLIC',
  PRIVE = 'PRIVE',
  ONG = 'ONG',
  AUTO_EMPLOI = 'AUTO_EMPLOI',
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
  date_inscription: string; // ISO date string
  est_actif: boolean;
  // mot_de_passe_hache should not be exposed to frontend
}

export interface UserProfile {
  utilisateur_id: number;
  nom: string;
  prenom: string;
  sexe?: Sexe;
  date_naissance?: string; // ISO date string
  lieu_naissance?: string;
  telephone?: string;
  adresse_actuelle?: string;
  region_commune?: string;
  cv_url?: string;
  statut_actuel: StatutActuel;
  universite_institut?: string;
  faculte_departement?: string;
  niveau_etudes?: string;
  domaine_formation?: string;
  annee_obtention_diplome?: number;
  secteur_professionnel_vise?: string;
  type_emploi_recherche?: TypeEmploiRecherche;
  attentes_orientation?: boolean;
  attentes_formation?: boolean;
  attentes_accompagnement_recherche?: boolean;
  attentes_mise_en_relation?: boolean;
  attentes_stage?: boolean;
  attentes_entrepreneuriat?: boolean;
}

// Combined User with Profile for convenience
export interface FullUser extends User {
  profile?: UserProfile;
}
