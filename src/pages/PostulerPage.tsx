import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Grid, Button, Chip, Avatar, CircularProgress, Alert } from '@mui/material';
import { offreEmploiService } from '../services/offreEmploiService';
import { OffreEmploi } from '../models/activity'; // Assuming OffreEmploi is defined here
import { useAuth } from '../context/AuthContext';

const PostulerPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { token } = useAuth();
  const [jobOffer, setJobOffer] = useState<OffreEmploi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobOffer = async () => {
      if (!jobId) {
        setError("ID de l'offre d'emploi manquant.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await offreEmploiService.getOffreEmploiById(Number(jobId));
        setJobOffer(data);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'offre d'emploi:", err);
        setError("Impossible de charger l'offre d'emploi. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobOffer();
  }, [jobId, token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Chargement de l'offre d'emploi...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!jobOffer) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Offre d'emploi non trouvée
        </Typography>
        <Typography variant="body1">
          L'offre d'emploi que vous recherchez n'existe pas.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Chip label={jobOffer.typeContrat || 'N/A'} color="primary" size="small" sx={{ mb: 1 }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {jobOffer.titre}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {jobOffer.entreprise || 'N/A'} - {jobOffer.lieu || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Avatar src={jobOffer.imageUrl ? `http://localhost:8080/uploads/${jobOffer.imageUrl}` : 'https://placehold.co/80x80'} alt={`${jobOffer.entreprise} logo`} sx={{ width: 80, height: 80 }} />
          </Grid>
        </Grid>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Description du poste
          </Typography>
          <Typography variant="body1" paragraph>
            {jobOffer.description}
          </Typography>
        </Box>

        {/* Responsibilities and Qualifications are not directly available in OffreEmploi model */}
        {/* If needed, these would have to be added to the OffreEmploi model */}

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