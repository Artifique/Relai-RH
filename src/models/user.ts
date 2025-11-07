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
  utilisateurId: number; // Changé en camelCase
  nom: string;
  prenom: string;
  sexe?: Sexe;
  dateNaissance?: string; // Changé en camelCase
  lieuNaissance?: string; // Changé en camelCase
  telephone?: string;
  adresseActuelle?: string; // Changé en camelCase
  regionCommune?: string; // Changé en camelCase
  cvUrl?: string; // Changé en camelCase
  statutActuel: StatutActuel; // Changé en camelCase
  universiteInstitut?: string; // Changé en camelCase
  faculteDepartement?: string; // Changé en camelCase
  niveauEtudes?: string; // Changé en camelCase
  domaineFormation?: string; // Changé en camelCase
  anneeObtentionDiplome?: number; // Changé en camelCase
  secteurProfessionnelVise?: string; // Changé en camelCase
  typeEmploiRecherche?: TypeEmploiRecherche; // Changé en camelCase
  attentesOrientation?: boolean; // Changé en camelCase
  attentesFormation?: boolean; // Changé en camelCase
  attentesAccompagnementRecherche?: boolean; // Changé en camelCase
  attentesMiseEnRelation?: boolean; // Changé en camelCase
  attentesStage?: boolean; // Changé en camelCase
  attentesEntrepreneuriat?: boolean; // Changé en camelCase
}

// Combined User with Profile for convenience
export interface FullUser extends User {
  profile?: UserProfile;
}
