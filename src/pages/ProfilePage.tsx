import React from 'react';
import { Container, Typography, Box, Button, Paper, Grid, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Accès refusé
        </Typography>
        <Typography variant="body1">
          Veuillez vous connecter pour accéder à cette page.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar sx={{ width: 100, height: 100, margin: 'auto', mb: 2 }}>
              {user.name.charAt(0)}
            </Avatar>
            <Typography variant="h5" component="h1" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/edit-profile')}>
              Modifier le profil
            </Button>
            <Button variant="outlined" color="secondary" sx={{ mt: 1 }} onClick={handleLogout}>
              Déconnexion
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Informations Personnelles
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1"><strong>Nom:</strong> {user.name}</Typography>
              <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
              <Typography variant="body1"><strong>Téléphone:</strong> {user.phone || 'Non spécifié'}</Typography>
              <Typography variant="body1"><strong>Adresse:</strong> {user.address || 'Non spécifiée'}</Typography>
            </Box>
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
              Mes Candidatures
            </Typography>
            <Typography variant="body1">
              Vous n'avez postulé à aucune offre pour le moment.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
