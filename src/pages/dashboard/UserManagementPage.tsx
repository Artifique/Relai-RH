
import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, Typography, Card, CardContent, TextField, InputAdornment, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, IconButton, Tooltip, Chip, Button, Dialog, DialogTitle, 
    DialogContent, DialogActions, Grid, Select, MenuItem, InputLabel, FormControl, ListItem, ListItemText, Checkbox, FormControlLabel, TablePagination
} from '@mui/material';
import { Search, Edit, Delete, Visibility } from '@mui/icons-material';
import { authService } from '../../services/authService';
import { profilRepresentantService } from '../../services/profilRepresentantService';
import { profilMembreService } from '../../services/profilMembreService'; // On suppose qu'il existe
import { userService } from '../../services/userService'; // Import userService
import { UserRole } from '../../models/user'; // Assuming UserRole is defined here
import { useAuth } from '../../context/AuthContext'; // Import useAuth

// Définir un type pour les objets utilisateur pour plus de sécurité
interface User {
  id: number;
  email: string;
  role: UserRole;
  estActif: boolean;
  // Champs communs aux deux types de profils
  nom?: string;
  prenom?: string;
  telephone?: string;
  adresse?: string; // Pour représentant
  adresseActuelle?: string; // Pour membre
  // Champs spécifiques aux profils membres
  sexe?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  regionCommune?: string;
  cvUrl?: string;
  statutActuel?: string;
  universiteInstitut?: string;
  faculteDepartement?: string;
  niveauEtudes?: string;
  domaineFormation?: string;
  anneeObtentionDiplome?: number;
  secteurProfessionnelVise?: string;
  typeEmploiRecherche?: string;
  attentesOrientation?: boolean;
  attentesFormation?: boolean;
  attentesAccompagnementRecherche?: boolean;
  attentesMiseEnRelation?: boolean;
  attentesStage?: boolean;
  attentesEntrepreneuriat?: boolean;
}

const initialUsers: User[] = []; // Les utilisateurs seront chargés dynamiquement

const userRoles = ['ETUDIANT', 'DIPLOME', 'DEMANDEUR_EMPLOI', 'REPRESENTANT_UNIVERSITE', 'ADMINISTRATEUR'];

const roleColors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
    ETUDIANT: 'primary', DIPLOME: 'secondary', DEMANDEUR_EMPLOI: 'warning', REPRESENTANT_UNIVERSITE: 'info', ADMINISTRATEUR: 'error',
};

const UserManagementPage: React.FC = () => {
  const { token } = useAuth(); // Récupérer le token de l'utilisateur connecté
  const [users, setUsers] = useState(initialUsers);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: infos de base, 2: infos de profil
  const [formData, setFormData] = useState<any>({}); // Pour stocker les données du formulaire
  const [createdUserId, setCreatedUserId] = useState<number | null>(null); // ID de l'utilisateur après signup
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter(user =>
    (user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pagedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const fetchUsers = async () => {
    if (!token) return; // Ne pas charger si pas de token

    try {
      const [representantsResponse, membresResponse] = await Promise.all([
        profilRepresentantService.getAllProfilsRepresentants(token),
        profilMembreService.getAllProfilsMembres(token) // Supposons que cette fonction existe
      ]);

      const loadedUsers: User[] = [];

      // Mapper les représentants
      representantsResponse.forEach((rep: any) => {
        loadedUsers.push({
          id: rep.utilisateur.id,
          email: rep.utilisateur.email,
          role: rep.utilisateur.role,
          estActif: rep.utilisateur.estActif,
          nom: rep.nom,
          prenom: rep.prenom,
          telephone: rep.telephone,
          adresse: rep.adresse,
        });
      });

      // Mapper les membres
      membresResponse.forEach((membre: any) => {
        loadedUsers.push({
          id: membre.utilisateur.id,
          email: membre.utilisateur.email,
          role: membre.utilisateur.role,
          estActif: membre.utilisateur.estActif,
          nom: membre.nom,
          prenom: membre.prenom,
          sexe: membre.sexe,
          dateNaissance: membre.dateNaissance,
          lieuNaissance: membre.lieuNaissance,
          telephone: membre.telephone,
          adresseActuelle: membre.adresseActuelle,
          regionCommune: membre.regionCommune,
          cvUrl: membre.cvUrl,
          statutActuel: membre.statutActuel,
          universiteInstitut: membre.universiteInstitut,
          faculteDepartement: membre.faculteDepartement,
          niveauEtudes: membre.niveauEtudes,
          domaineFormation: membre.domaineFormation,
          anneeObtentionDiplome: membre.anneeObtentionDiplome,
          secteurProfessionnelVise: membre.secteurProfessionnelVise,
          typeEmploiRecherche: membre.typeEmploiRecherche,
          attentesOrientation: membre.attentesOrientation,
          attentesFormation: membre.attentesFormation,
          attentesAccompagnementRecherche: membre.attentesAccompagnementRecherche,
          attentesMiseEnRelation: membre.attentesMiseEnRelation,
          attentesStage: membre.attentesStage,
          attentesEntrepreneuriat: membre.attentesEntrepreneuriat,
        });
      });

      setUsers(loadedUsers);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      // Gérer l'erreur, par exemple afficher un message à l'utilisateur
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]); // Recharger les utilisateurs si le token change

  const handleAddClick = () => {
    setSelectedUser(null);
    setFormData({});
    setCurrentStep(1);
    setCreatedUserId(null);
    setFormOpen(true);
  };
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      role: user.role,
      nom: user.nom || '',
      prenom: user.prenom || '',
      telephone: user.telephone || '',
      adresse: user.adresse || '',
      sexe: user.sexe || '',
      dateNaissance: user.dateNaissance || '',
      lieuNaissance: user.lieuNaissance || '',
      adresseActuelle: user.adresseActuelle || '',
      regionCommune: user.regionCommune || '',
      cvUrl: user.cvUrl || '',
      statutActuel: user.statutActuel || '',
      universiteInstitut: user.universiteInstitut || '',
      faculteDepartement: user.faculteDepartement || '',
      niveauEtudes: user.niveauEtudes || '',
      domaineFormation: user.domaineFormation || '',
      anneeObtentionDiplome: user.anneeObtentionDiplome || '',
      secteurProfessionnelVise: user.secteurProfessionnelVise || '',
      typeEmploiRecherche: user.typeEmploiRecherche || '',
      attentesOrientation: user.attentesOrientation || false,
      attentesFormation: user.attentesFormation || false,
      attentesAccompagnementRecherche: user.attentesAccompagnementRecherche || false,
      attentesMiseEnRelation: user.attentesMiseEnRelation || false,
      attentesStage: user.attentesStage || false,
      attentesEntrepreneuriat: user.attentesEntrepreneuriat || false,
    });
    setCurrentStep(1); // Commencer par l'étape 1 pour l'édition
    setFormOpen(true);
  };
  const handleViewClick = (user: User) => { setSelectedUser(user); setViewOpen(true); };
  const handleDeleteClick = (user: User) => { setSelectedUser(user); setDeleteOpen(true); };

  const handleClose = () => {
    setFormOpen(false);
    setViewOpen(false);
    setDeleteOpen(false);
    setSelectedUser(null);
    setCurrentStep(1); // Réinitialiser l'étape
    setFormData({}); // Réinitialiser les données du formulaire
    setCreatedUserId(null); // Réinitialiser l'ID de l'utilisateur créé
  };
  const handleDeleteConfirm = async () => {
    if (selectedUser && token) {
      try {
        await userService.deleteUser(selectedUser.id, token);
        alert('Utilisateur supprimé avec succès !');
        fetchUsers(); // Rafraîchir la liste après suppression
      } catch (error: any) {
        alert(`Erreur lors de la suppression de l'utilisateur: ${error.message}`);
      }
    }
    handleClose();
  };

  const handleNextStep = async () => {
    // Valider les champs de l'étape 1
    if (!formData.email || !formData.password || !formData.role) {
      alert('Veuillez remplir tous les champs requis de la première étape.');
      return;
    }

    try {
      // Appel à l'API de signup
      const signupData = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };
      const response = await authService.signup(signupData);
      setCreatedUserId(response.userId); // Stocker l'ID de l'utilisateur créé
      setCurrentStep(2); // Passer à l'étape 2
    } catch (error: any) {
      alert(`Erreur lors de l'inscription de l'utilisateur: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      alert('Erreur: Token d\'authentification manquant. Veuillez vous connecter en tant qu\'administrateur.');
      return;
    }

    try {
      let userIdToUpdate = createdUserId; // Pour la création
      if (selectedUser) { // Pour la modification
        userIdToUpdate = selectedUser.id;
        // Mettre à jour l'utilisateur de base (email, role) si nécessaire
        await userService.updateUser(selectedUser.id, { email: formData.email, role: formData.role }, token);
      }

      if (!userIdToUpdate) {
        alert('Erreur: ID utilisateur non trouvé pour la création/modification du profil.');
        return;
      }

      if (formData.role === UserRole.REPRESENTANT_UNIVERSITE) {
          const commonProfilRepresentantData = {
            nom: formData.nom,
            prenom: formData.prenom,
            telephone: formData.telephone,
            adresse: formData.adresse,
          };
        if (selectedUser) {
          // If selectedUser exists, it's an update operation
          await profilRepresentantService.updateProfilRepresentant(userIdToUpdate, commonProfilRepresentantData, token);
        } else {
          // If no selectedUser, it's potentially a create operation, but check if profile already exists
          try {
            // Attempt to fetch existing profile
            await profilRepresentantService.getProfilRepresentantById(userIdToUpdate);
            // If successful, profile exists, so update it
            await profilRepresentantService.updateProfilRepresentant(userIdToUpdate, commonProfilRepresentantData, token);
          } catch (error: any) {
            // If fetching fails (e.g., 404 Not Found), profile does not exist, so create it
            const profilRepresentantDataForCreate = {
              utilisateurId: userIdToUpdate,
              ...commonProfilRepresentantData,
            };
            await profilRepresentantService.createProfilRepresentant(profilRepresentantDataForCreate, token);
          }
        }
      } else { // ETUDIANT, DIPLOME, DEMANDEUR_EMPLOI
        const profilMembreData = {
          nom: formData.nom,
          prenom: formData.prenom,
          sexe: formData.sexe,
          dateNaissance: formData.dateNaissance,
          lieuNaissance: formData.lieuNaissance,
          telephone: formData.telephone,
          adresseActuelle: formData.adresseActuelle,
          regionCommune: formData.regionCommune,
          cvUrl: formData.cvUrl,
          statutActuel: formData.statutActuel,
          universiteInstitut: formData.universiteInstitut,
          faculteDepartement: formData.faculteDepartement,
          niveauEtudes: formData.niveauEtudes,
          domaineFormation: formData.domaineFormation,
          anneeObtentionDiplome: formData.anneeObtentionDiplome ? parseInt(formData.anneeObtentionDiplome) : undefined,
          secteurProfessionnelVise: formData.secteurProfessionnelVise,
          typeEmploiRecherche: formData.typeEmploiRecherche,
          attentesOrientation: formData.attentesOrientation,
          attentesFormation: formData.attentesFormation,
          attentesAccompagnementRecherche: formData.attentesAccompagnementRecherche,
          attentesMiseEnRelation: formData.attentesMiseEnRelation,
          attentesStage: formData.attentesStage,
          attentesEntrepreneuriat: formData.attentesEntrepreneuriat,
        };
        if (selectedUser) {
          await profilMembreService.updateProfilMembre(userIdToUpdate, profilMembreData, token);
        } else {
          await profilMembreService.createProfilMembre({ ...profilMembreData, utilisateurId: userIdToUpdate }, token);
        }
      }
      alert('Utilisateur et profil créés/modifiés avec succès !');
      handleClose();
      fetchUsers(); // Rafraîchir la liste des utilisateurs après création/modification
    } catch (error: any) {
      alert(`Erreur lors de la création/modification du profil: ${error.message}`);
    }
  };
  // Fonctions pour gérer les changements des attentes (checkboxes)
  const handleAttenteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 4, p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', bgcolor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Gestion des Utilisateurs
        </Typography>
      </Box>
      <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField 
                fullWidth
                variant="outlined" 
                size="small" 
                placeholder="Rechercher..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={8} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Button variant="contained" color="primary" onClick={handleAddClick}>Ajouter un utilisateur</Button>
            </Grid>
          </Grid>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Nom</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Rôle</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Statut</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? pagedUsers
                  : filteredUsers
                ).map((user) => (
                  <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{user.nom}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Chip label={user.role} color={roleColors[user.role] || 'default'} size="small" /></TableCell>
                    <TableCell><Chip label={user.estActif ? 'Actif' : 'Inactif'} color={user.estActif ? 'success' : 'default'} size="small" variant="outlined" /></TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir"><IconButton size="small" onClick={() => handleViewClick(user)} color="info"><Visibility fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Modifier"><IconButton size="small" onClick={() => handleEditClick(user)} color="primary"><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Supprimer"><IconButton size="small" onClick={() => handleDeleteClick(user)} color="error"><Delete fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page :"
            labelDisplayedRows={({ from, to, count }: { from: number; to: number; count: number }) => `${from}-${to} sur ${count}`}
          />
        </CardContent>
      </Card>

      {/* MODALE AJOUT/MODIFICATION */}
      <Dialog open={formOpen} onClose={handleClose} maxWidth="md" fullWidth> {/* MaxWidth md pour plus d'espace */}
        <DialogTitle>{selectedUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          {currentStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  required
                  margin="normal"
                  id="email"
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required={!selectedUser} // Requis seulement pour la création
                  margin="normal"
                  id="password"
                  label={selectedUser ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required margin="normal">
                  <InputLabel id="role-select-label">Rôle</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role"
                    label="Rôle"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  >
                    {userRoles.map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {currentStep === 2 && formData.role === UserRole.REPRESENTANT_UNIVERSITE && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  required
                  margin="normal"
                  id="prenom"
                  label="Prénom"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.prenom || ''}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  margin="normal"
                  id="nom"
                  label="Nom"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.nom || ''}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  id="telephone"
                  label="Téléphone"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.telephone || ''}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  id="adresse"
                  label="Adresse"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.adresse || ''}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                />
              </Grid>
            </Grid>
          )}

          {currentStep === 2 && (formData.role === UserRole.ETUDIANT || formData.role === UserRole.DIPLOME || formData.role === UserRole.DEMANDEUR_EMPLOI) && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  required
                  margin="normal"
                  id="prenom"
                  label="Prénom"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.prenom || ''}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  margin="normal"
                  id="nom"
                  label="Nom"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.nom || ''}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  id="sexe"
                  label="Sexe"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.sexe || ''}
                  onChange={(e) => setFormData({ ...formData, sexe: e.target.value })} // Assuming Sexe is a string for now
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  id="dateNaissance"
                  label="Date de Naissance"
                  type="date"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={formData.dateNaissance || ''}
                  onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  id="lieuNaissance"
                  label="Lieu de Naissance"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.lieuNaissance || ''}
                  onChange={(e) => setFormData({ ...formData, lieuNaissance: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  id="telephone"
                  label="Téléphone"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.telephone || ''}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  id="adresseActuelle"
                  label="Adresse Actuelle"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.adresseActuelle || ''}
                  onChange={(e) => setFormData({ ...formData, adresseActuelle: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  id="regionCommune"
                  label="Région/Commune"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.regionCommune || ''}
                  onChange={(e) => setFormData({ ...formData, regionCommune: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  id="cvUrl"
                  label="URL CV"
                  type="url"
                  fullWidth
                  variant="outlined"
                  value={formData.cvUrl || ''}
                  onChange={(e) => setFormData({ ...formData, cvUrl: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="statutActuel-select-label">Statut Actuel</InputLabel>
                  <Select
                    labelId="statutActuel-select-label"
                    id="statutActuel"
                    label="Statut Actuel"
                    value={formData.statutActuel || ''}
                    onChange={(e) => setFormData({ ...formData, statutActuel: e.target.value })}
                  >
                    <MenuItem value="ETUDIANT">Étudiant</MenuItem>
                    <MenuItem value="DIPLOME_SANS_EMPLOI">Diplômé sans emploi</MenuItem>
                    <MenuItem value="DEMANDEUR_EMPLOI">Demandeur d'emploi</MenuItem>
                    <MenuItem value="JEUNE_RECONVERSION">Jeune en reconversion</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  id="universiteInstitut"
                  label="Université/Institut"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.universiteInstitut || ''}
                  onChange={(e) => setFormData({ ...formData, universiteInstitut: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  id="faculteDepartement"
                  label="Faculté/Département"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.faculteDepartement || ''}
                  onChange={(e) => setFormData({ ...formData, faculteDepartement: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  id="niveauEtudes"
                  label="Niveau d'Études"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.niveauEtudes || ''}
                  onChange={(e) => setFormData({ ...formData, niveauEtudes: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  id="domaineFormation"
                  label="Domaine de Formation"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.domaineFormation || ''}
                  onChange={(e) => setFormData({ ...formData, domaineFormation: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  id="anneeObtentionDiplome"
                  label="Année d'obtention du diplôme"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.anneeObtentionDiplome || ''}
                  onChange={(e) => setFormData({ ...formData, anneeObtentionDiplome: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  id="secteurProfessionnelVise"
                  label="Secteur Professionnel Visé"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.secteurProfessionnelVise || ''}
                  onChange={(e) => setFormData({ ...formData, secteurProfessionnelVise: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="typeEmploiRecherche-select-label">Type d'Emploi Recherché</InputLabel>
                  <Select
                    labelId="typeEmploiRecherche-select-label"
                    id="typeEmploiRecherche"
                    label="Type d'Emploi Recherché"
                    value={formData.typeEmploiRecherche || ''}
                    onChange={(e) => setFormData({ ...formData, typeEmploiRecherche: e.target.value })}
                  >
                    <MenuItem value="PUBLIC">Public</MenuItem>
                    <MenuItem value="PRIVE">Privé</MenuItem>
                    <MenuItem value="ONG">ONG</MenuItem>
                    <MenuItem value="AUTO_EMPLOI">Auto-emploi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Attentes</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox checked={formData.attentesOrientation || false} onChange={handleAttenteChange} name="attentesOrientation" />}
                  label="Orientation"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox checked={formData.attentesFormation || false} onChange={handleAttenteChange} name="attentesFormation" />}
                  label="Formation"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox checked={formData.attentesAccompagnementRecherche || false} onChange={handleAttenteChange} name="attentesAccompagnementRecherche" />}
                  label="Accompagnement Recherche"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox checked={formData.attentesMiseEnRelation || false} onChange={handleAttenteChange} name="attentesMiseEnRelation" />}
                  label="Mise en Relation"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox checked={formData.attentesStage || false} onChange={handleAttenteChange} name="attentesStage" />}
                  label="Stage"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox checked={formData.attentesEntrepreneuriat || false} onChange={handleAttenteChange} name="attentesEntrepreneuriat" />}
                  label="Entrepreneuriat"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          {currentStep === 1 && (
            <Button onClick={handleNextStep} variant="contained">Suivant</Button>
          )}
          {currentStep === 2 && (
            <Button onClick={handleSubmit} variant="contained">{selectedUser ? 'Enregistrer' : 'Ajouter'}</Button>
          )}
        </DialogActions>
      </Dialog>

      {/* MODALE VOIR DÉTAILS */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Détails de l'utilisateur</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
            {selectedUser && (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><ListItem><ListItemText primary="ID" secondary={selectedUser.id} /></ListItem></Grid>
                    <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Email" secondary={selectedUser.email} /></ListItem></Grid>
                    <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Rôle" secondary={<Chip label={selectedUser.role} color={roleColors[selectedUser.role] || 'default'} size="small" />} /></ListItem></Grid>
                    <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Statut" secondary={<Chip label={selectedUser.estActif ? 'Actif' : 'Inactif'} color={selectedUser.estActif ? 'success' : 'default'} size="small" variant="outlined" />} /></ListItem></Grid>
                    {selectedUser.nom && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Nom" secondary={selectedUser.nom} /></ListItem></Grid>}
                    {selectedUser.prenom && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Prénom" secondary={selectedUser.prenom} /></ListItem></Grid>}
                    {selectedUser.telephone && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Téléphone" secondary={selectedUser.telephone} /></ListItem></Grid>}

                    {/* Champs spécifiques au représentant */}
                    {selectedUser.role === UserRole.REPRESENTANT_UNIVERSITE && selectedUser.adresse && (
                        <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Adresse" secondary={selectedUser.adresse} /></ListItem></Grid>
                    )}

                    {/* Champs spécifiques aux membres (ETUDIANT, DIPLOME, DEMANDEUR_EMPLOI) */}
                    {(selectedUser.role === UserRole.ETUDIANT || selectedUser.role === UserRole.DIPLOME || selectedUser.role === UserRole.DEMANDEUR_EMPLOI) && (
                        <>
                            {selectedUser.sexe && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Sexe" secondary={selectedUser.sexe} /></ListItem></Grid>}
                            {selectedUser.dateNaissance && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Date de Naissance" secondary={selectedUser.dateNaissance} /></ListItem></Grid>}
                            {selectedUser.lieuNaissance && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Lieu de Naissance" secondary={selectedUser.lieuNaissance} /></ListItem></Grid>}
                            {selectedUser.adresseActuelle && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Adresse Actuelle" secondary={selectedUser.adresseActuelle} /></ListItem></Grid>}
                            {selectedUser.regionCommune && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Région/Commune" secondary={selectedUser.regionCommune} /></ListItem></Grid>}
                            {selectedUser.cvUrl && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="URL CV" secondary={selectedUser.cvUrl} /></ListItem></Grid>}
                            {selectedUser.statutActuel && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Statut Actuel" secondary={selectedUser.statutActuel} /></ListItem></Grid>}
                            {selectedUser.universiteInstitut && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Université/Institut" secondary={selectedUser.universiteInstitut} /></ListItem></Grid>}
                            {selectedUser.faculteDepartement && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Faculté/Département" secondary={selectedUser.faculteDepartement} /></ListItem></Grid>}
                            {selectedUser.niveauEtudes && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Niveau d'Études" secondary={selectedUser.niveauEtudes} /></ListItem></Grid>}
                            {selectedUser.domaineFormation && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Domaine de Formation" secondary={selectedUser.domaineFormation} /></ListItem></Grid>}
                            {selectedUser.anneeObtentionDiplome && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Année d'obtention du diplôme" secondary={selectedUser.anneeObtentionDiplome} /></ListItem></Grid>}
                            {selectedUser.secteurProfessionnelVise && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Secteur Professionnel Visé" secondary={selectedUser.secteurProfessionnelVise} /></ListItem></Grid>}
                            {selectedUser.typeEmploiRecherche && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Type d'Emploi Recherché" secondary={selectedUser.typeEmploiRecherche} /></ListItem></Grid>}
                            <Grid item xs={12}><Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Attentes :</Typography></Grid>
                            {selectedUser.attentesOrientation && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Orientation" secondary="Oui" /></ListItem></Grid>}
                            {selectedUser.attentesFormation && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Formation" secondary="Oui" /></ListItem></Grid>}
                            {selectedUser.attentesAccompagnementRecherche && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Accompagnement Recherche" secondary="Oui" /></ListItem></Grid>}
                            {selectedUser.attentesMiseEnRelation && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Mise en Relation" secondary="Oui" /></ListItem></Grid>}
                            {selectedUser.attentesStage && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Stage" secondary="Oui" /></ListItem></Grid>}
                            {selectedUser.attentesEntrepreneuriat && <Grid item xs={12} sm={6}><ListItem><ListItemText primary="Entrepreneuriat" secondary="Oui" /></ListItem></Grid>}
                        </>
                    )}
                </Grid>
            )}
        </DialogContent>
        <DialogActions><Button onClick={handleClose} variant="contained">Fermer</Button></DialogActions>
      </Dialog>

      {/* MODALE CONFIRMATION SUPPRESSION */}
      <Dialog open={deleteOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}><Typography>Êtes-vous sûr de vouloir supprimer l'utilisateur "{selectedUser?.nom}" ?</Typography></DialogContent>
        <DialogActions><Button onClick={handleClose}>Annuler</Button><Button onClick={handleDeleteConfirm} variant="contained" color="error">Supprimer</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagementPage;
