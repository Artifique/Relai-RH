import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Grid, Button, Chip, Avatar } from '@mui/material';

interface JobDetail {
  id: number;
  title: string;
  company: string;
  location: string;
  logoUrl: string;
  contractType: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
}

const jobDetailsData: { [key: string]: JobDetail } = {
  "1": {
    id: 1,
    title: 'Développeur Frontend',
    company: 'Orange Mali',
    location: 'Bamako, Mali',
    logoUrl: 'https://picsum.photos/seed/orangemali/200',
    contractType: 'CDI',
    description: 'Nous recherchons un développeur Frontend passionné pour rejoindre notre équipe chez Orange Mali et travailler sur des projets innovants.',
    responsibilities: [
      'Développer de nouvelles fonctionnalités pour nos applications web.',
      'Collaborer avec les équipes de design et de backend.',
      'Maintenir et améliorer la base de code existante.',
    ],
    qualifications: [
      'Maîtrise de React, HTML, CSS.',
      'Expérience avec TypeScript.',
      'Bonne connaissance des API REST.',
      'Résider au Mali.',
    ],
  },
  "2": {
    id: 2,
    title: 'Chef de Projet Digital',
    company: 'Malitel',
    location: 'Bamako, Mali',
    logoUrl: 'https://picsum.photos/seed/malitel/200',
    contractType: 'CDD',
    description: 'Malitel recherche un Chef de Projet Digital dynamique pour piloter des initiatives innovantes.',
    responsibilities: [
      'Gérer le cycle de vie complet des projets digitaux.',
      'Coordonner les équipes techniques et marketing.',
      'Assurer le suivi budgétaire et la planification.',
    ],
    qualifications: [
      'Expérience en gestion de projet digital.',
      'Connaissance des méthodologies Agile.',
      'Excellentes compétences en communication.',
      'Résider au Mali.',
    ],
  },
  "3": {
    id: 3,
    title: 'Data Analyst',
    company: 'Banque de Développement du Mali (BDM)',
    location: 'Bamako, Mali',
    logoUrl: 'https://picsum.photos/seed/bdm/200',
    contractType: 'Stage',
    description: 'La BDM recherche un Data Analyst stagiaire pour analyser des données financières et aider à la prise de décision.',
    responsibilities: [
      'Collecter et analyser des données financières.',
      'Créer des rapports et des tableaux de bord.',
      'Identifier des tendances et des opportunités.',
    ],
    qualifications: [
      'Étudiant en statistiques, mathématiques ou informatique.',
      'Maîtrise d\'Excel et SQL.',
      'Connaissance de Python ou R est un plus.',
      'Résider au Mali.',
    ],
  },
  "4": {
    id: 4,
    title: 'UI/UX Designer',
    company: 'Jumia Mali',
    location: 'Bamako, Mali',
    logoUrl: 'https://picsum.photos/seed/jumiamali/200',
    contractType: 'CDI',
    description: 'Jumia Mali recherche un UI/UX Designer créatif pour améliorer l\'expérience utilisateur de notre plateforme e-commerce.',
    responsibilities: [
      'Concevoir des interfaces utilisateur intuitives et attrayantes.',
      'Réaliser des wireframes, prototypes et maquettes.',
      'Effectuer des tests utilisateurs.',
    ],
    qualifications: [
      'Maîtrise des outils de design (Figma, Sketch, Adobe XD).',
      'Expérience en conception d\'interfaces mobiles et web.',
      'Portfolio solide.',
      'Résider au Mali.',
    ],
  },
  "5": {
    id: 5,
    title: 'Développeur Backend',
    company: 'Société Malienne de Transports (SMT)',
    location: 'Bamako, Mali',
    logoUrl: 'https://picsum.photos/seed/smt/200',
    contractType: 'CDI',
    description: 'La SMT recherche un Développeur Backend expérimenté pour renforcer son équipe technique.',
    responsibilities: [
      'Concevoir et développer des API robustes.',
      'Assurer la maintenance et l\'optimisation des bases de données.',
      'Collaborer avec les équipes frontend.',
    ],
    qualifications: [
      'Maîtrise de Node.js, Python ou Java.',
      'Expérience avec les bases de données SQL et NoSQL.',
      'Connaissance des services cloud (AWS, Azure).',
      'Résider au Mali.',
    ],
  },
};

const PostulerPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const job = jobId ? jobDetailsData[jobId] : undefined;

  if (!job) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Annonce non trouvée
        </Typography>
        <Typography variant="body1">
          L'annonce que vous recherchez n'existe pas.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Chip label={job.contractType} color="primary" size="small" sx={{ mb: 1 }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {job.title}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {job.company} - {job.location}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Avatar src={job.logoUrl} alt={`${job.company} logo`} sx={{ width: 80, height: 80 }} />
          </Grid>
        </Grid>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Description du poste
          </Typography>
          <Typography variant="body1" paragraph>
            {job.description}
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Responsabilités
          </Typography>
          <ul>
            {job.responsibilities.map((resp, index) => (
              <li key={index}><Typography variant="body1">{resp}</Typography></li>
            ))}
          </ul>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Qualifications requises
          </Typography>
          <ul>
            {job.qualifications.map((qual, index) => (
              <li key={index}><Typography variant="body1">{qual}</Typography></li>
            ))}
          </ul>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="contained" color="primary" size="large">
            Postuler maintenant
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PostulerPage;
