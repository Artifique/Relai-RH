export enum TypeRessource {
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO',
  GUIDE = 'GUIDE',
  BAARA_KO_KENEYA_SO = 'BAARA_KO_KENEYA_SO',
  BAARA_GUNDO_BARO = 'BAARA_GUNDO_BARO',
}

export interface RessourceLaboCompetences {
  id: number;
  titre: string;
  url_contenu: string;
  type_ressource: TypeRessource;
  cree_le: string; // ISO date string
}

export interface CreateRessourceLaboCompetencesDto {
  titre: string;
  url_contenu: string;
  type_ressource: TypeRessource;
}

export interface UpdateRessourceLaboCompetencesDto {
  titre?: string;
  url_contenu?: string;
  type_ressource?: TypeRessource;
}
