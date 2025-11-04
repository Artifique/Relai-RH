import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Grid, Paper, Link as MuiLink } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import s4Image from '../assets/s4.jpg';

const ConnexionPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Simulate a login process - accept any credentials for now
    login('1', 'Guest User', 'guest@example.com', 'user'); // Dummy user data
    navigate('/'); // Redirect to home page
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={12}
        sm={6}
        md={6}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 400,
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
            Bienvenue !
          </Typography>
          <Typography component="p" variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Connectez-vous pour accéder à votre espace.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse e-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
            />
            <MuiLink href="/mot-de-passe-oublie" variant="body2" sx={{ display: 'block', textAlign: 'right', my: 1 }}>
              Mot de passe oublié ?
            </MuiLink>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
            >
              Se connecter
            </Button>
            <Grid container>
              <Grid item>
                <MuiLink href="/inscription" variant="body2">
                  {"Vous n'avez pas de compte ? S'inscrire"}
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={false}
        sm={6}
        md={6}
        sx={{
          backgroundImage: `url(${s4Image})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </Grid>
  );
};

export default ConnexionPage;
