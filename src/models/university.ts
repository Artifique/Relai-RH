export interface University {
  id: number;
  nom: string;
  adresse?: string;
  email_contact?: string;
  representant_id?: number; // ID of the user who is the representative
}

export interface CreateUniversityDto {
  nom: string;
  adresse?: string;
  email_contact?: string;
  representant_id?: number;
}

export interface UpdateUniversityDto {
  nom?: string;
  adresse?: string;
  email_contact?: string;
  representant_id?: number;
}
