import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Paper, Grid, TextField } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EditProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateUser({ name, email, phone, address });
    navigate('/profile');
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
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Modifier le profil
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nom complet"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Adresse e-mail"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Téléphone"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Adresse"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" sx={{ mr: 1 }} onClick={() => navigate('/profile')}>
              Annuler
            </Button>
            <Button type="submit" variant="contained">
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditProfilePage;
