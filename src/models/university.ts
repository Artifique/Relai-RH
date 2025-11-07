export interface Representant {
  id: number;
  email: string;
  motDePasseHache: string;
  role: string;
  dateInscription: string | null;
  estActif: boolean;
}

export interface University {
  id: number;
  nom: string;
  adresse?: string;
  emailContact: string;
  imageUrl: string | null;
  representant: Representant;
}

export interface CreateUniversityDto {
  nom: string;
  adresse?: string;
  emailContact?: string;
  representant_id?: number;
}

export interface UpdateUniversityDto {
  nom?: string;
  adresse?: string;
  emailContact?: string;
  representant_id?: number;
}
