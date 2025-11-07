-- Script SQL DDL mis à jour (v3) pour le projet Relais RH
-- Base de données : PostgreSQL (ou compatible)

-- Table des Utilisateurs
CREATE TABLE utilisateur (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe_hache VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ETUDIANT', 'DIPLOME', 'DEMANDEUR_EMPLOI', 'REPRESENTANT_UNIVERSITE', 'ADMINISTRATEUR')),
    date_inscription TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    est_actif BOOLEAN DEFAULT TRUE
);

-- Table des Profils Membres (pour les rôles ETUDIANT, DIPLOME, DEMANDEUR_EMPLOI)
CREATE TABLE profil_membre (
    utilisateur_id INTEGER PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    sexe CHAR(1) CHECK (sexe IN ('M', 'F')),
    date_naissance DATE,
    lieu_naissance VARCHAR(100),
    telephone VARCHAR(50),
    adresse_actuelle VARCHAR(255),
    region_commune VARCHAR(100),
    cv_url TEXT, -- NOUVEAU CHAMP : URL vers le CV du membre
    -- Situation Universitaire ou Professionnelle
    statut_actuel VARCHAR(50) NOT NULL CHECK (statut_actuel IN ('ETUDIANT', 'DIPLOME_SANS_EMPLOI', 'DEMANDEUR_EMPLOI', 'JEUNE_RECONVERSION')),
    universite_institut VARCHAR(255),
    faculte_departement VARCHAR(255),
    niveau_etudes VARCHAR(50), -- Licence, Master, Doctorat, Autre
    domaine_formation VARCHAR(255),
    annee_obtention_diplome INTEGER,
    -- Objectifs et Attentes (stockés comme des chaînes de caractères ou JSONB pour la flexibilité)
    secteur_professionnel_vise VARCHAR(255),
    type_emploi_recherche VARCHAR(50) CHECK (type_emploi_recherche IN ('PUBLIC', 'PRIVE', 'ONG', 'AUTO_EMPLOI')),
    attentes_orientation BOOLEAN DEFAULT FALSE,
    attentes_formation BOOLEAN DEFAULT FALSE,
    attentes_accompagnement_recherche BOOLEAN DEFAULT FALSE,
    attentes_mise_en_relation BOOLEAN DEFAULT FALSE,
    attentes_stage BOOLEAN DEFAULT FALSE,
    attentes_entrepreneuriat BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE
);

-- Table des Universités
CREATE TABLE universite (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) UNIQUE NOT NULL,
    adresse TEXT,
    email_contact VARCHAR(255),
    image_url VARCHAR(255), -- NOUVEAU CHAMP
    representant_id INTEGER UNIQUE, -- Un représentant par université
    FOREIGN KEY (representant_id) REFERENCES utilisateur(id) ON DELETE SET NULL
);

-- Table des Activités (publiées par les représentants d'université)
CREATE TABLE activite (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type_activite VARCHAR(50) NOT NULL, -- Ex: 'EVENEMENT', 'ATELIER', 'OFFRE_EMPLOI'
    date_activite TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    lieu VARCHAR(255),
    image_url VARCHAR(255), -- NOUVEAU CHAMP
    universite_id INTEGER NOT NULL,
    publie_par_id INTEGER NOT NULL,
    cree_le TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (universite_id) REFERENCES universite(id) ON DELETE CASCADE,
    FOREIGN KEY (publie_par_id) REFERENCES utilisateur(id) ON DELETE CASCADE
);

-- Table des Offres d'Emploi (nouvelle entité)
CREATE TABLE offre_emploi (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    entreprise VARCHAR(255),
    lieu VARCHAR(255),
    type_contrat VARCHAR(50),
    date_limite_candidature DATE,
    image_url VARCHAR(255), -- NOUVEAU CHAMP
    publie_par_id INTEGER, -- Peut être un représentant ou un admin
    cree_le TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    lien TEXT, -- Nouveau champ pour le lien de l'offre
    FOREIGN KEY (publie_par_id) REFERENCES utilisateur(id) ON DELETE SET NULL
);

-- Table des Tests d'Employabilité
CREATE TABLE test_employabilite (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    duree_minutes INTEGER,
    cree_par_id INTEGER NOT NULL,
    cree_le TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cree_par_id) REFERENCES utilisateur(id) ON DELETE RESTRICT
);

-- Table des Résultats de Tests (pour les Diplômés)
CREATE TABLE resultat_test (
    id SERIAL PRIMARY KEY,
    test_id INTEGER NOT NULL,
    utilisateur_id INTEGER NOT NULL, -- Doit être un utilisateur avec le rôle 'DIPLOME'
    score NUMERIC(5, 2) NOT NULL,
    details_rapport TEXT,
    complete_le TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES test_employabilite(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    UNIQUE (test_id, utilisateur_id)
);

-- Table des Bourses d'Employabilité
CREATE TABLE bourse_employabilite (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    criteres_eligibilite TEXT,
    date_limite_candidature DATE,
    cree_par_id INTEGER NOT NULL,
    cree_le TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cree_par_id) REFERENCES utilisateur(id) ON DELETE RESTRICT
);

-- Table des Candidatures aux Bourses (pour les Demandeurs d'Emploi)
CREATE TABLE candidature_bourse (
    id SERIAL PRIMARY KEY,
    bourse_id INTEGER NOT NULL,
    utilisateur_id INTEGER NOT NULL, -- Doit être un utilisateur avec le rôle 'DEMANDEUR_EMPLOI'
    date_candidature TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(50) NOT NULL CHECK (statut IN ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE')),
    lettre_motivation TEXT,
    FOREIGN KEY (bourse_id) REFERENCES bourse_employabilite(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    UNIQUE (bourse_id, utilisateur_id)
);

-- Table des Profils des Représentants d'Université
CREATE TABLE profil_representant (
    utilisateur_id INTEGER PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(50),
    adresse VARCHAR(255),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE
);

-- Table des Ressources du Laboratoire des Compétences Métiers
CREATE TABLE ressource_labo_competences (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    url_contenu TEXT NOT NULL,
    type_ressource VARCHAR(50) NOT NULL, -- Ex: 'ARTICLE', 'VIDEO', 'GUIDE', 'BAARA_KO_KENEYA_SO', 'BAARA_GUNDO_BARO'
    cree_le TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances de recherche
CREATE INDEX idx_activite_universite_id ON activite (universite_id);
CREATE INDEX idx_resultat_test_utilisateur_id ON resultat_test (utilisateur_id);
CREATE INDEX idx_candidature_bourse_utilisateur_id ON candidature_bourse (utilisateur_id);
CREATE INDEX idx_offre_emploi_publie_par_id ON offre_emploi (publie_par_id);
