export interface TestEmployabilite {
  id: number;
  titre: string;
  description?: string;
  duree_minutes?: number;
  cree_par_id: number; // ID of the user who created the test
  cree_le: string; // ISO date string
}

export interface CreateTestEmployabiliteDto {
  titre: string;
  description?: string;
  duree_minutes?: number;
  cree_par_id: number;
}

export interface UpdateTestEmployabiliteDto {
  titre?: string;
  description?: string;
  duree_minutes?: number;
}

export interface ResultatTest {
  id: number;
  test_id: number;
  utilisateur_id: number;
  score: number;
  details_rapport?: string;
  complete_le: string; // ISO date string
}

export interface CreateResultatTestDto {
  test_id: number;
  utilisateur_id: number;
  score: number;
  details_rapport?: string;
}
