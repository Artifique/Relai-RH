import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Grid, Paper, Link as MuiLink, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import s1Image from '../assets/s1.jpg';

const InscriptionPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // Add role state
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle registration logic here
    console.log({ name, email, password, role });
    navigate('/connexion'); // Redirect to login page after registration
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
            Créer un compte
          </Typography>
          <Typography component="p" variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Rejoignez notre communauté dès aujourd'hui.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Je suis un(e)</FormLabel>
              <RadioGroup row name="role" value={role} onChange={(e) => setRole(e.target.value)}>
                <FormControlLabel value="user" control={<Radio />} label="Étudiant / Demandeur d'emploi" />
                <FormControlLabel value="university" control={<Radio />} label="Représentant d'université" />
              </RadioGroup>
            </FormControl>

            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nom complet"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse e-mail"
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmer le mot de passe"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
            >
              S'inscrire
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <MuiLink href="/connexion" variant="body2">
                  {"Déjà un compte ? Se connecter"}
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
          backgroundImage: `url(${s1Image})`,
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

export default InscriptionPage;
