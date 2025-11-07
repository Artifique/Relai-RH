// src/models/offreEmploi.ts

export interface OffreEmploi {
  id: number;
  titre: string;
  description: string;
  entreprise?: string;
  lieu?: string;
  type_contrat?: string; // VARCHAR(50)
  date_limite_candidature?: string; // DATE (ISO string)
  image_url?: string;
  publie_par_id?: number;
  cree_le?: string; // TIMESTAMP WITHOUT TIME ZONE (ISO string)
  lien?: string;
}
