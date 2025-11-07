// src/models/profilRepresentant.ts

export interface ProfilRepresentant {
  utilisateurId: number;
  nom: string;
  prenom: string;
  telephone?: string;
  adresse?: string;
}
