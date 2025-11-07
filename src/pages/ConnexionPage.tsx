import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Link as MuiLink, Card, CardContent, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../models/user';

const ConnexionPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Clear previous errors

    try {
      await login({ email, password });
      // If login is successful, useAuth context will be updated
      // and the user object will contain the role.
      // We need to get the user from the context after successful login.
      const authState = JSON.parse(localStorage.getItem('user') || '{}'); // Directly read from localStorage for immediate check
      if (authState && authState.role === UserRole.ADMINISTRATEUR) {
        navigate('/dashboard');
      } else {
        navigate('/profile'); // Redirect non-admin users to their profile or homepage
      }
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
      <Card sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ width: '100%' }}>
          <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
            Connexion
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: '8px' }}
            >
              Se connecter
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <MuiLink component={RouterLink} to="/mot-de-passe-oublie" variant="body2">
                Mot de passe oublié ?
              </MuiLink>
              <MuiLink component={RouterLink} to="/inscription" variant="body2">
                {"Pas encore de compte ? S'inscrire"}
              </MuiLink>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ConnexionPage;
