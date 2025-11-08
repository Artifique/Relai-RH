import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Card, CardContent, TextField, InputAdornment, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, 
    DialogActions, Grid, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, TablePagination
} from '@mui/material';
import { Search, Edit, Delete, Visibility } from '@mui/icons-material';
import { activityService } from '../../services/activityService';
import { Activite, TypeActivite, CreateActiviteDto, UpdateActiviteDto } from '../../models/activity';
import { useAuth } from '../../context/AuthContext';
import SuccessMessageDialog from '../../components/common/SuccessMessageDialog';
import { userService } from '../../services/userService';
import { FullUser, UserRole } from '../../models/user';
import { universityService } from '../../services/universityService';
import { University } from '../../models/university';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const ActiviteManagementPage: React.FC = () => {
  const [activities, setActivities] = useState<Activite[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedActivite, setSelectedActivite] = useState<Activite | null>(null);
  const { token, user: authUser } = useAuth();

  // Form states
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [typeActivite, setTypeActivite] = useState<TypeActivite | ''>('');
  const [dateActivite, setDateActivite] = useState('');
  const [lieu, setLieu] = useState('');
  const [universiteId, setUniversiteId] = useState<number | ''>('');
  const [imageFile, setImageFile] = useState<File | null>(null); // New state for image file

  // Dropdown data
  const [universities, setUniversities] = useState<University[]>([]);

  // Success Dialog states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successDialogTitle, setSuccessDialogTitle] = useState('');
  const [successDialogMessage, setSuccessDialogMessage] = useState('');

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.log("No token found, cannot fetch data.");
        return;
      }
      console.log("Fetching data with token:", token);
      try {
        const activitiesData = await activityService.getAllActivities(token as string);
        const universitiesData = await universityService.getAllUniversities(token as string);

        console.log("Fetched activities data:", activitiesData);
        setActivities(activitiesData);
        setUniversities(universitiesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (selectedActivite) {
      setTitre(selectedActivite.titre);
      setDescription(selectedActivite.description);
      setTypeActivite(selectedActivite.type_activite);
      setDateActivite(selectedActivite.date_activite ? selectedActivite.date_activite.split('T')[0] : '');
      setLieu(selectedActivite.lieu || '');
      setUniversiteId(selectedActivite.universite.id);
      setImageFile(null); // Reset image file when editing
    } else {
      setTitre('');
      setDescription('');
      setTypeActivite('');
      setDateActivite('');
      setLieu('');
      setUniversiteId('');
      setImageFile(null); // Reset image file when adding
    }
  }, [selectedActivite]);

  // GESTION DES MODALES
  const handleAddClick = () => {
    setSelectedActivite(null);
    setFormOpen(true);
    setImageFile(null); // Reset image file when adding
  };

  const handleEditClick = (activite: Activite) => {
    setSelectedActivite(activite);
    setFormOpen(true);
    setImageFile(null); // Reset image file when editing
  };

  const handleViewClick = (activite: Activite) => {
    setSelectedActivite(activite);
    setViewOpen(true);
  };

  const handleDeleteClick = (activite: Activite) => {
    setSelectedActivite(activite);
    setDeleteOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setViewOpen(false);
    setDeleteOpen(false);
    setSelectedActivite(null);
    // Reset form states on close
    setTitre('');
    setDescription('');
    setTypeActivite('');
    setDateActivite('');
    setLieu('');
    setUniversiteId('');
    setImageFile(null); // Reset image file on close
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setSuccessDialogTitle('');
    setSuccessDialogMessage('');
  };

  const handleDeleteConfirm = async () => {
    if (selectedActivite) {
      try {
        await activityService.deleteActivity(selectedActivite.id, token as string);
        setActivities(activities.filter(a => a.id !== selectedActivite.id));
        handleClose();
        setSuccessDialogTitle('Succès');
        setSuccessDialogMessage(`L'activité "${selectedActivite.titre}" a été supprimée avec succès.`);
        setShowSuccessDialog(true);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'activité:", error);
        // Optionally, show an error message to the user
      }
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      console.error("No token available for submission.");
      return;
    }

    const activityData = {
      titre,
      description,
      typeActivite: typeActivite, // Changed to camelCase
      dateActivite: `${dateActivite}T00:00:00`, // Ensure ISO 8601 format with time
      lieu,
      universite: { id: universiteId }, // Send universite as a nested object
    };

    const formData = new FormData();
    formData.append('activite', new Blob([JSON.stringify(activityData)], { type: 'application/json' }));
    if (imageFile) formData.append('image', imageFile);

    try {
      let responseActivite: Activite;
      let successMessage: string;
      if (selectedActivite) {
        // Update existing activity
        responseActivite = await activityService.updateActivityWithImage(selectedActivite.id, formData, token as string);
        successMessage = `L'activité "${responseActivite.titre}" a été modifiée avec succès.`;
      } else {
        // Create new activity
        responseActivite = await activityService.createActivityWithImage(formData, token as string);
        successMessage = `L'activité "${responseActivite.titre}" a été ajoutée avec succès.`;
      }
      console.log("Activity saved:", responseActivite);
      // Refresh the list of activities
      const updatedActivities = await activityService.getAllActivities(token as string);
      setActivities(updatedActivities);
      handleClose();
      setSuccessDialogTitle('Succès');
      setSuccessDialogMessage(successMessage);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error saving activity:", error);
      // Optionally, show an error message to the user
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    const filteredActivities = activities.filter(activite =>
      (activite.titre ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activite.description ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activite.type_activite ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activite.lieu ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const pagedActivities = filteredActivities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
    return (
      <Box>
        <Box sx={{ mb: 4, p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', bgcolor: 'background.paper' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Gestion des Activités
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
                <Button variant="contained" color="primary" onClick={handleAddClick}>Ajouter une activité</Button>
              </Grid>
            </Grid>
            <TableContainer component={Paper} sx={{ boxShadow: 'none', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Titre</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Lieu</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? pagedActivities
                    : filteredActivities
                  ).map((activite) => (
                    <TableRow key={activite.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{activite.titre}</TableCell>
                      <TableCell>{activite.type_activite}</TableCell>
                      <TableCell>{new Date(activite.date_activite).toLocaleDateString()}</TableCell>
                      <TableCell>{activite.lieu || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Voir"><IconButton size="small" onClick={() => handleViewClick(activite)} color="info"><Visibility fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Modifier"><IconButton size="small" onClick={() => handleEditClick(activite)} color="primary"><Edit fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Supprimer"><IconButton size="small" onClick={() => handleDeleteClick(activite)} color="error"><Delete fontSize="small" /></IconButton></Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredActivities.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Lignes par page :"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
            />
          </CardContent>
        </Card>
      {/* MODALE AJOUT/MODIFICATION */}
      <Dialog open={formOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedActivite ? 'Modifier l\'activité' : 'Ajouter une activité'}</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}><TextField value={titre} onChange={(e) => setTitre(e.target.value)} autoFocus required margin="normal" id="titre" label="Titre de l\'activité" type="text" fullWidth variant="outlined" /></Grid>
              <Grid item xs={12}><TextField value={description} onChange={(e) => setDescription(e.target.value)} required margin="normal" id="description" label="Description" type="text" fullWidth multiline rows={4} variant="outlined" /></Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="type-activite-select-label">Type d\'activité</InputLabel>
                  <Select
                    labelId="type-activite-select-label"
                    id="typeActivite"
                    value={typeActivite}
                    label="Type d\'activité"
                    onChange={(e) => setTypeActivite(e.target.value as TypeActivite)}
                  >
                    {Object.values(TypeActivite).map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}><TextField value={dateActivite} onChange={(e) => setDateActivite(e.target.value)} required margin="normal" id="dateActivite" label="Date de l\'activité" type="date" fullWidth InputLabelProps={{ shrink: true }} variant="outlined" /></Grid>
              <Grid item xs={12}><TextField value={lieu} onChange={(e) => setLieu(e.target.value)} margin="normal" id="lieu" label="Lieu" type="text" fullWidth variant="outlined" /></Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="universite-select-label">Université</InputLabel>
                  <Select
                    labelId="universite-select-label"
                    id="universiteId"
                    value={universiteId}
                    label="Université"
                    onChange={(e) => setUniversiteId(e.target.value as number)}
                  >
                    <MenuItem value=""><em>Sélectionner une université</em></MenuItem>
                    {universities.map((uni) => (
                      <MenuItem key={uni.id} value={uni.id}>{uni.nom}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                {selectedActivite?.imageUrl && (
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="subtitle1">Image actuelle:</Typography>
                    <img src={`${API_BASE_URL}/uploads/${selectedActivite.imageUrl}`} alt="Current Activity" style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px' }} />
                  </Box>
                )}
                <Button
                  variant="contained"
                  component="label"
                >
                  {selectedActivite?.imageUrl ? 'Changer l\'image' : 'Ajouter une image'}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                  />
                </Button>
                {imageFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>Fichier sélectionné: {imageFile.name}</Typography>
                )}
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={handleClose}>Annuler</Button>
              <Button type="submit" variant="contained">{selectedActivite ? 'Enregistrer' : 'Ajouter'}</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODALE VOIR DÉTAILS */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Détails de l\'activité</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
            {selectedActivite ? (
                <List>
                    <ListItem><ListItemText primary="ID" secondary={selectedActivite.id} /></ListItem>
                    <ListItem><ListItemText primary="Titre" secondary={selectedActivite.titre} /></ListItem>
                    <ListItem><ListItemText primary="Description" secondary={selectedActivite.description} /></ListItem>
                    <ListItem><ListItemText primary="Type d\'activité" secondary={selectedActivite.type_activite} /></ListItem>
                    <ListItem><ListItemText primary="Date de l\'activité" secondary={new Date(selectedActivite.date_activite).toLocaleDateString()} /></ListItem>
                    <ListItem><ListItemText primary="Lieu" secondary={selectedActivite.lieu || 'N/A'} /></ListItem>
                    {selectedActivite.imageUrl && (
                      <ListItem>
                        <ListItemText primary="Image" />
                        <img src={`${API_BASE_URL}/uploads/${selectedActivite.imageUrl}`} alt="Activity" style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px' }} />
                      </ListItem>
                    )}
                    <ListItem>
                      <ListItemText 
                        primary="Université" 
                        secondary={selectedActivite.universite?.nom || 'N/A'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Publié par" 
                        secondary={selectedActivite.publiePar?.email || 'N/A'} 
                      />
                    </ListItem>
                    <ListItem><ListItemText primary="Créé le" secondary={new Date(selectedActivite.cree_le).toLocaleString()} /></ListItem>
                </List>
            ) : (
                <Typography>Aucune activité sélectionnée.</Typography>
            )}
        </DialogContent>
        <DialogActions><Button onClick={handleClose} variant="contained">Fermer</Button></DialogActions>
      </Dialog>

      {/* MODALE CONFIRMATION SUPPRESSION */}
      <Dialog open={deleteOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}><Typography>Êtes-vous sûr de vouloir supprimer l\'activité "{selectedActivite?.titre}" ? Cette action est irréversible.</Typography></DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>

      <SuccessMessageDialog
        open={showSuccessDialog}
        title={successDialogTitle}
        message={successDialogMessage}
        onClose={handleCloseSuccessDialog}
      />
    </Box>
  );
};

export default ActiviteManagementPage;
