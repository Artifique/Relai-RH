import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import s1Image from '../assets/s1.jpg'; // Using s1 as a default hero image

interface ServiceDetail {
  title: string;
  description: string;
  heroImage: string;
  keyPoints: string[];
}

const servicesData: { [key: string]: ServiceDetail } = {
  "lcm": {
    title: "Laboratoire des Compétences Métiers (LCM)",
    description: "Le volet “Laboratoire des Compétences Métiers” est une composante stratégique du Réseau Relais RH, conçue pour renforcer l’employabilité pratique et l’adéquation formation–emploi chez les étudiants, jeunes diplômés et demandeurs d’emploi. Le Laboratoire des Compétences Métiers (LCM) vise à développer les aptitudes techniques, comportementales et professionnelles des jeunes en vue de faciliter leur insertion socioprofessionnelle durable dans un marché du travail en mutation. Il constitue un espace d’apprentissage expérimental, d’innovation et de mise en pratique des compétences adaptées aux exigences du monde de l’emploi et de l’entrepreneuriat.",
    heroImage: s1Image,
    keyPoints: [
      "Développement des aptitudes techniques et comportementales.",
      "Apprentissage expérimental et innovation.",
      "Adéquation formation-emploi.",
      "Insertion socioprofessionnelle durable.",
    ],
  },
  "psp": {
    title: "Prévoyances Socioprofessionnelles (PSP)",
    description: "Le volet “Prévoyances Socioprofessionnelles” du Réseau Relais RH – Mali est un pilier stratégique d’accompagnement préventif, social et d’anticipation de carrière destiné à soutenir les jeunes dans leur transition vers la vie active. Le volet Prévoyances Socioprofessionnelles (PSP) a pour but de préparer, accompagner et sécuriser les parcours des étudiants, jeunes diplômés et demandeurs d’emploi à chaque étape de leur transition académique et professionnelle.",
    heroImage: s1Image, // You can change this to another image
    keyPoints: [
      "Accompagnement préventif et social.",
      "Anticipation de carrière.",
      "Sécurisation des parcours académiques et professionnels.",
      "Soutien à la transition vers la vie active.",
    ],
  },
  "reseau-universitaire": {
    title: "Réseau Universitaire Relais RH",
    description: "Le volet Réseau Universitaire vise à ancrer la mission du Relais RH dans le milieu académique en créant, au sein de chaque université et grande école, une antenne universitaire Relais RH chargée de faciliter la liaison entre les étudiants, les établissements d’enseignement et le monde du travail. Il constitue un espace de coordination, de sensibilisation et d’accompagnement de proximité, orienté vers l’employabilité, l’entrepreneuriat et la transition études–emploi.",
    heroImage: s1Image, // You can change this to another image
    keyPoints: [
      "Création d'antennes universitaires Relais RH.",
      "Liaison entre étudiants, établissements et monde du travail.",
      "Accompagnement de proximité.",
      "Orientation vers l’employabilité et l’entrepreneuriat.",
    ],
  },
};

const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = serviceId ? servicesData[serviceId] : undefined;

  if (!service) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Service non trouvé
        </Typography>
        <Typography variant="body1">
          Le service que vous recherchez n'existe pas.
        </Typography>
      </Container>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          height: '40vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${service.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(40%)',
            zIndex: -1,
          },
        }}
      >
        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold' }}>
          {service.title}
        </Typography>
      </Box>
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Description du Service
              </Typography>
              <Typography variant="body1" paragraph>
                {service.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 4, backgroundColor: 'primary.main', color: 'white' }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Objectifs Clés
              </Typography>
              <List>
                {service.keyPoints.map((point, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary={point} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ServiceDetailPage;
