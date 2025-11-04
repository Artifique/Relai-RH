import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
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
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profil de {user.name}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">ID: {user.id}</Typography>
        <Typography variant="h6">Nom: {user.name}</Typography>
        <Typography variant="h6">Rôle: {user.role}</Typography>
      </Box>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Déconnexion
      </Button>
      {/* Placeholder for profile management features */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Gérer votre profil
        </Typography>
        <Typography variant="body1">
          Ici, vous pourrez modifier vos informations personnelles, changer votre mot de passe, etc.
        </Typography>
      </Box>
    </Container>
  );
};

export default ProfilePage;
