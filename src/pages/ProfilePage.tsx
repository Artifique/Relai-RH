import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Paper, Avatar, Grid, CircularProgress, Alert, Divider, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService'; // Import userService
import { UserProfile } from '../models/user'; // Import UserProfile

const ProfilePage: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && token) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const profile = await userService.getUserProfile(user.id, token);
          setUserProfile(profile);
        } catch (err: any) {
          setError(err.message || 'Erreur lors du chargement du profil.');
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else if (!user) {
      navigate('/connexion'); // Redirect if not logged in
    }
  }, [user, token, navigate]);

  if (loading) {
    return (
      <Container component="main" maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container component="main" maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>

      </Container>
    );
  }

  if (!userProfile) {
    return (
      <Container component="main" maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Alert severity="info">Aucune donnée de profil trouvée.</Alert>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}>
            {userProfile.prenom.charAt(0)}{userProfile.nom.charAt(0)}
          </Avatar>
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {userProfile.prenom} {userProfile.nom}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user?.email} ({user?.role})
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/edit-profile"
            sx={{ mt: 2 }}
          >
            Modifier le profil
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Informations Personnelles
            </Typography>
            <Typography variant="body1"><strong>Sexe:</strong> {userProfile.sexe || 'Non spécifié'}</Typography>
            <Typography variant="body1"><strong>Date de Naissance:</strong> {userProfile.dateNaissance ? new Date(userProfile.dateNaissance).toLocaleDateString() : 'Non spécifié'}</Typography>
            <Typography variant="body1"><strong>Lieu de Naissance:</strong> {userProfile.lieuNaissance || 'Non spécifié'}</Typography>
            <Typography variant="body1"><strong>Téléphone:</strong> {userProfile.telephone || 'Non spécifié'}</Typography>
            <Typography variant="body1"><strong>Adresse:</strong> {userProfile.adresseActuelle || 'Non spécifiée'}</Typography>
            <Typography variant="body1"><strong>Région/Commune:</strong> {userProfile.regionCommune || 'Non spécifiée'}</Typography>
            <Typography variant="body1"><strong>URL CV:</strong> {userProfile.cvUrl ? <MuiLink href={userProfile.cvUrl} target="_blank">Voir le CV</MuiLink> : 'Non spécifié'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Informations Professionnelles
            </Typography>
            <Typography variant="body1"><strong>Statut Actuel:</strong> {userProfile.statutActuel || 'Non spécifié'}</Typography>
            <Typography variant="body1"><strong>Université/Institut:</strong> {userProfile.universiteInstitut || 'Non spécifié'}</Typography>
            <Typography variant="body1"><strong>Faculté/Département:</strong> {userProfile.faculteDepartement || 'Non spécifié'}</Typography>
            <Typography variant="body1"><strong>Niveau d'Études:</strong> {userProfile.niveauEtudes || 'Non spécifié'}</Typography>
            <Typography variant="body1"><strong>Domaine de Formation:</strong> {userProfile.domaineFormation || 'Non spécifié'}</Typography>
            <Typography variant="body1"><strong>Année Diplôme:</strong> {userProfile.anneeObtentionDiplome || 'Non spécifié'}</Typography>
            <Typography variant="body1"><strong>Secteur Visé:</strong> {userProfile.secteurProfessionnelVise || 'Non spécifié'}</Typography>
            <Typography variant="body1"><strong>Type Emploi Recherché:</strong> {userProfile.typeEmploiRecherche || 'Non spécifié'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
              Attentes
            </Typography>
            <Typography variant="body1"><strong>Orientation:</strong> {userProfile.attentesOrientation ? 'Oui' : 'Non'}</Typography>
            <Typography variant="body1"><strong>Formation:</strong> {userProfile.attentesFormation ? 'Oui' : 'Non'}</Typography>
            <Typography variant="body1"><strong>Accompagnement Recherche:</strong> {userProfile.attentesAccompagnementRecherche ? 'Oui' : 'Non'}</Typography>
            <Typography variant="body1"><strong>Mise en Relation:</strong> {userProfile.attentesMiseEnRelation ? 'Oui' : 'Non'}</Typography>
            <Typography variant="body1"><strong>Stage:</strong> {userProfile.attentesStage ? 'Oui' : 'Non'}</Typography>
            <Typography variant="body1"><strong>Entrepreneuriat:</strong> {userProfile.attentesEntrepreneuriat ? 'Oui' : 'Non'}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
