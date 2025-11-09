import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Grid, Paper, Link as MuiLink, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserRole } from '../models/user';
import SuccessMessageDialog from '../components/common/SuccessMessageDialog';
import s1Image from '../assets/s1.jpg';

const InscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successDialogTitle, setSuccessDialogTitle] = useState('');
  const [successDialogMessage, setSuccessDialogMessage] = useState('');

  // Account Information
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.DEMANDEUR_EMPLOI); // Default role

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    navigate('/connexion');
  };

  const validateForm = () => {
    let errors: { [key: string]: string } = {};
    let isValid = true;

    if (!email) { errors.email = 'L\'email est requis.'; isValid = false; }
    if (!password) { errors.password = 'Le mot de passe est requis.'; isValid = false; }
    if (password !== confirmPassword) { errors.confirmPassword = 'Les mots de passe ne correspondent pas.'; isValid = false; }
    if (!role) { errors.role = 'Le rôle est requis.'; isValid = false; }

    setFormErrors(errors);
    return isValid;
  };

  const handleSignupSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Veuillez corriger les erreurs du formulaire.');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      await authService.signup({ email, password, role });
      setSuccessDialogTitle('Inscription Réussie !');
      setSuccessDialogMessage('Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.');
      setSuccessDialogOpen(true);
    } catch (err: any) {
      console.error("Erreur lors de l'inscription:", err);
      setSnackbarSeverity('error');
      setSnackbarMessage(err.response?.data?.message || 'Erreur lors de la création du compte.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
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
            maxWidth: 600,
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
            Créer un compte
          </Typography>
          <Typography component="p" variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Rejoignez notre communauté dès aujourd'hui.
          </Typography>

          <Box component="form" onSubmit={handleSignupSubmit} sx={{ mt: 1, width: '100%' }}>
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
              error={!!formErrors.email}
              helperText={formErrors.email}
              variant="outlined"
              sx={{ mb: 2 }}
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
              error={!!formErrors.password}
              helperText={formErrors.password}
              variant="outlined"
              sx={{ mb: 2 }}
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
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <FormControl component="fieldset" fullWidth margin="normal" error={!!formErrors.role}>
              <FormLabel component="legend">Je suis un(e)</FormLabel>
              <RadioGroup row name="role" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                <FormControlLabel value={UserRole.ETUDIANT} control={<Radio />} label="Étudiant(e)" />
                <FormControlLabel value={UserRole.DIPLOME} control={<Radio />} label="Diplômé(e)" />
                <FormControlLabel value={UserRole.DEMANDEUR_EMPLOI} control={<Radio />} label="Demandeur(se) d'emploi" />
              </RadioGroup>
              {formErrors.role && <Typography color="error" variant="caption">{formErrors.role}</Typography>}
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              S'inscrire
            </Button>
          </Box>

          <Grid container justifyContent="flex-end" sx={{ mt: 2, mb: 4 }}>
            <Grid item>
              <MuiLink href="/connexion" variant="body2">
                {"Déjà un compte ? Se connecter"}
              </MuiLink>
            </Grid>
          </Grid>
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
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <SuccessMessageDialog
        open={successDialogOpen}
        title={successDialogTitle}
        message={successDialogMessage}
        onClose={handleSuccessDialogClose}
      />
    </Grid>
  );
};

export default InscriptionPage;
