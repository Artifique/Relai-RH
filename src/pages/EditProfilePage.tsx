import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Card, CardContent, Alert, CircularProgress, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService'; // Import userService
import { UserProfile, Sexe, StatutActuel, TypeEmploiRecherche } from '../models/user'; // Import UserProfile and enums

const EditProfilePage: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [sexe, setSexe] = useState<Sexe | undefined>(undefined);
  const [dateNaissance, setDateNaissance] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresseActuelle, setAdresseActuelle] = useState('');
  const [regionCommune, setRegionCommune] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [statutActuel, setStatutActuel] = useState<StatutActuel | undefined>(undefined);
  const [universiteInstitut, setUniversiteInstitut] = useState('');
  const [faculteDepartement, setFaculteDepartement] = useState('');
  const [niveauEtudes, setNiveauEtudes] = useState('');
  const [domaineFormation, setDomaineFormation] = useState('');
  const [anneeObtentionDiplome, setAnneeObtentionDiplome] = useState<number | undefined>(undefined);
  const [secteurProfessionnelVise, setSecteurProfessionnelVise] = useState('');
  const [typeEmploiRecherche, setTypeEmploiRecherche] = useState<TypeEmploiRecherche | undefined>(undefined);
  const [attentesOrientation, setAttentesOrientation] = useState(false);
  const [attentesFormation, setAttentesFormation] = useState(false);
  const [attentesAccompagnementRecherche, setAttentesAccompagnementRecherche] = useState(false);
  const [attentesMiseEnRelation, setAttentesMiseEnRelation] = useState(false);
  const [attentesStage, setAttentesStage] = useState(false);
  const [attentesEntrepreneuriat, setAttentesEntrepreneuriat] = useState(false);


  useEffect(() => {
    if (user && token) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const profile = await userService.getUserProfile(user.id, token);
          setUserProfile(profile);
          // Pre-fill form fields
          setNom(profile.nom || '');
          setPrenom(profile.prenom || '');
          setSexe(profile.sexe);
          setDateNaissance(profile.dateNaissance ? profile.dateNaissance.split('T')[0] : ''); // Format for input type="date"
          setTelephone(profile.telephone || '');
          setAdresseActuelle(profile.adresseActuelle || '');
          setRegionCommune(profile.regionCommune || '');
          setCvUrl(profile.cvUrl || '');
          setStatutActuel(profile.statutActuel);
          setUniversiteInstitut(profile.universiteInstitut || '');
          setFaculteDepartement(profile.faculteDepartement || '');
          setNiveauEtudes(profile.niveauEtudes || '');
          setDomaineFormation(profile.domaineFormation || '');
          setAnneeObtentionDiplome(profile.anneeObtentionDiplome);
          setSecteurProfessionnelVise(profile.secteurProfessionnelVise || '');
          setTypeEmploiRecherche(profile.typeEmploiRecherche);
          setAttentesOrientation(profile.attentesOrientation || false);
          setAttentesFormation(profile.attentesFormation || false);
          setAttentesAccompagnementRecherche(profile.attentesAccompagnementRecherche || false);
          setAttentesMiseEnRelation(profile.attentesMiseEnRelation || false);
          setAttentesStage(profile.attentesStage || false);
          setAttentesEntrepreneuriat(profile.attentesEntrepreneuriat || false);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user || !token) {
      setError('Utilisateur non authentifié.');
      return;
    }

    const updatedProfile: Partial<UserProfile> = {
      nom,
      prenom,
      sexe,
      dateNaissance: dateNaissance || undefined,
      telephone,
      adresseActuelle: adresseActuelle || undefined,
      regionCommune: regionCommune || undefined,
      cvUrl: cvUrl || undefined,
      statutActuel: statutActuel,
      universiteInstitut: universiteInstitut || undefined,
      faculteDepartement: faculteDepartement || undefined,
      niveauEtudes: niveauEtudes || undefined,
      domaineFormation: domaineFormation || undefined,
      anneeObtentionDiplome: anneeObtentionDiplome,
      secteurProfessionnelVise: secteurProfessionnelVise || undefined,
      typeEmploiRecherche: typeEmploiRecherche || undefined,
      attentesOrientation: attentesOrientation,
      attentesFormation: attentesFormation,
      attentesAccompagnementRecherche: attentesAccompagnementRecherche,
      attentesMiseEnRelation: attentesMiseEnRelation,
      attentesStage: attentesStage,
      attentesEntrepreneuriat: attentesEntrepreneuriat,
    };

    try {
      await userService.updateUserProfile(user.id, updatedProfile, token);
      setSuccess('Profil mis à jour avec succès !');
    } catch (err: any) {
      setError(err.message || 'Échec de la mise à jour du profil.');
    }
  };

  if (loading) {
    return (
      <Container component="main" maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!userProfile) {
    return (
      <Container component="main" maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Alert severity="error">Impossible de charger le profil utilisateur.</Alert>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ p: 4, borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
            Modifier mon Profil
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="prenom"
                  label="Prénom"
                  name="prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="nom"
                  label="Nom"
                  name="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </Grid>
              {/* Add other profile fields here based on UserProfile interface */}
              {/* For example: */}
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="telephone"
                  label="Téléphone"
                  name="telephone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="dateNaissance"
                  label="Date de Naissance"
                  name="dateNaissance"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={dateNaissance}
                  onChange={(e) => setDateNaissance(e.target.value)}
                />
              </Grid>
              {/* ... more fields ... */}
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="adresseActuelle"
                  label="Adresse Actuelle"
                  name="adresseActuelle"
                  value={adresseActuelle}
                  onChange={(e) => setAdresseActuelle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="regionCommune"
                  label="Région / Commune"
                  name="regionCommune"
                  value={regionCommune}
                  onChange={(e) => setRegionCommune(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="cvUrl"
                  label="URL du CV"
                  name="cvUrl"
                  value={cvUrl}
                  onChange={(e) => setCvUrl(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="sexe-label">Sexe</InputLabel>
                  <Select
                    labelId="sexe-label"
                    id="sexe"
                    value={sexe || ''}
                    label="Sexe"
                    onChange={(e) => setSexe(e.target.value as Sexe)}
                  >
                    <MenuItem value={Sexe.M}>Masculin</MenuItem>
                    <MenuItem value={Sexe.F}>Féminin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="statutActuel-label">Statut Actuel</InputLabel>
                  <Select
                    labelId="statutActuel-label"
                    id="statutActuel"
                    value={statutActuel || ''}
                    label="Statut Actuel"
                    onChange={(e) => setStatutActuel(e.target.value as StatutActuel)}
                  >
                    {Object.values(StatutActuel).map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="universiteInstitut"
                  label="Université / Institut"
                  name="universiteInstitut"
                  value={universiteInstitut}
                  onChange={(e) => setUniversiteInstitut(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="faculteDepartement"
                  label="Faculté / Département"
                  name="faculteDepartement"
                  value={faculteDepartement}
                  onChange={(e) => setFaculteDepartement(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="niveauEtudes"
                  label="Niveau d'Études"
                  name="niveauEtudes"
                  value={niveauEtudes}
                  onChange={(e) => setNiveauEtudes(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="domaineFormation"
                  label="Domaine de Formation"
                  name="domaineFormation"
                  value={domaineFormation}
                  onChange={(e) => setDomaineFormation(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="anneeObtentionDiplome"
                  label="Année d'obtention du diplôme"
                  name="anneeObtentionDiplome"
                  type="number"
                  value={anneeObtentionDiplome || ''}
                  onChange={(e) => setAnneeObtentionDiplome(parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="secteurProfessionnelVise"
                  label="Secteur Professionnel Visé"
                  name="secteurProfessionnelVise"
                  value={secteurProfessionnelVise}
                  onChange={(e) => setSecteurProfessionnelVise(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="typeEmploiRecherche-label">Type d'emploi recherché</InputLabel>
                  <Select
                    labelId="typeEmploiRecherche-label"
                    id="typeEmploiRecherche"
                    value={typeEmploiRecherche || ''}
                    label="Type d'emploi recherché"
                    onChange={(e) => setTypeEmploiRecherche(e.target.value as TypeEmploiRecherche)}
                  >
                    {Object.values(TypeEmploiRecherche).map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Attentes :</Typography>
                <FormControlLabel
                  control={<Checkbox checked={attentesOrientation} onChange={(e) => setAttentesOrientation(e.target.checked)} />}
                  label="Orientation"
                />
                <FormControlLabel
                  control={<Checkbox checked={attentesFormation} onChange={(e) => setAttentesFormation(e.target.checked)} />}
                  label="Formation"
                />
                <FormControlLabel
                  control={<Checkbox checked={attentesAccompagnementRecherche} onChange={(e) => setAttentesAccompagnementRecherche(e.target.checked)} />}
                  label="Accompagnement à la recherche d'emploi"
                />
                <FormControlLabel
                  control={<Checkbox checked={attentesMiseEnRelation} onChange={(e) => setAttentesMiseEnRelation(e.target.checked)} />}
                  label="Mise en relation"
                />
                <FormControlLabel
                  control={<Checkbox checked={attentesStage} onChange={(e) => setAttentesStage(e.target.checked)} />}
                  label="Stage"
                />
                <FormControlLabel
                  control={<Checkbox checked={attentesEntrepreneuriat} onChange={(e) => setAttentesEntrepreneuriat(e.target.checked)} />}
                  label="Entrepreneuriat"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: '8px' }}
            >
              Enregistrer les modifications
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EditProfilePage;
