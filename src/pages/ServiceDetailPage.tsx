import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

interface ServiceDetail {
  title: string;
  description: string;
}

const servicesData: { [key: string]: ServiceDetail } = {
  "lcm": {
    title: "Laboratoire des Compétences Métiers (LCM)",
    description: "Le volet “Laboratoire des Compétences Métiers” est une composante stratégique du Réseau Relais RH, conçue pour renforcer l’employabilité pratique et l’adéquation formation–emploi chez les étudiants, jeunes diplômés et demandeurs d’emploi. Le Laboratoire des Compétences Métiers (LCM) vise à développer les aptitudes techniques, comportementales et professionnelles des jeunes en vue de faciliter leur insertion socioprofessionnelle durable dans un marché du travail en mutation. Il constitue un espace d’apprentissage expérimental, d’innovation et de mise en pratique des compétences adaptées aux exigences du monde de l’emploi et de l’entrepreneuriat.",
  },
  "psp": {
    title: "Prévoyances Socioprofessionnelles (PSP)",
    description: "Le volet “Prévoyances Socioprofessionnelles” du Réseau Relais RH – Mali est un pilier stratégique d’accompagnement préventif, social et d’anticipation de carrière destiné à soutenir les jeunes dans leur transition vers la vie active. Le volet Prévoyances Socioprofessionnelles (PSP) a pour but de préparer, accompagner et sécuriser les parcours des étudiants, jeunes diplômés et demandeurs d’emploi à chaque étape de leur transition académique et professionnelle.",
  },
  "reseau-universitaire": {
    title: "Réseau Universitaire Relais RH",
    description: "Le volet Réseau Universitaire vise à ancrer la mission du Relais RH dans le milieu académique en créant, au sein de chaque université et grande école, une antenne universitaire Relais RH chargée de faciliter la liaison entre les étudiants, les établissements d’enseignement et le monde du travail. Il constitue un espace de coordination, de sensibilisation et d’accompagnement de proximité, orienté vers l’employabilité, l’entrepreneuriat et la transition études–emploi.",
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
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {service.title}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" paragraph>
          {service.description}
        </Typography>
      </Box>
    </Container>
  );
};

export default ServiceDetailPage;
