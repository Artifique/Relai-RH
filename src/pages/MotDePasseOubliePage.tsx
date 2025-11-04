import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Grid, Paper, Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import s3Image from '../assets/s3.jpg';

const MotDePasseOubliePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle password reset logic here
    console.log({ email });
    // Show a confirmation message to the user
    alert('Si un compte est associé à cet e-mail, un lien de réinitialisation a été envoyé.');
    navigate('/connexion');
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
            Mot de passe oublié
          </Typography>
          <Typography component="p" variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Entrez votre e-mail pour recevoir un lien de réinitialisation.
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
            >
              Envoyer le lien
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <MuiLink href="/connexion" variant="body2">
                  {"Retour à la connexion"}
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
          backgroundImage: `url(${s3Image})`,
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

export default MotDePasseOubliePage;
