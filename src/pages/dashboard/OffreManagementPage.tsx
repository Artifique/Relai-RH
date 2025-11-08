import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Card, CardContent, TextField, InputAdornment, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, 
    DialogActions, Grid, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, TablePagination
} from '@mui/material';
import { Search, Edit, Delete, Visibility } from '@mui/icons-material';
import { offreEmploiService } from '../../services/offreEmploiService';
import { OffreEmploi, TypeContrat } from '../../models/activity'; // Import TypeContrat
import { useAuth } from '../../context/AuthContext';
import SuccessMessageDialog from '../../components/common/SuccessMessageDialog';
import { FullUser } from '../../models/user'; // Import FullUser

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const OffreManagementPage: React.FC = () => {
  const [offres, setOffres] = useState<OffreEmploi[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState<OffreEmploi | null>(null);
  const { token, user: authUser } = useAuth(); // Destructure authUser

  // Form states
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [lieu, setLieu] = useState('');
  const [typeContrat, setTypeContrat] = useState<TypeContrat | ''>(''); // Use TypeContrat enum
  const [dateLimiteCandidature, setDateLimiteCandidature] = useState('');
  const [lien, setLien] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

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
    const fetchOffres = async () => {
      if (!token) {
        console.log("No token found, cannot fetch offres.");
        return;
      }
      try {
        const data = await offreEmploiService.getAllOffresEmploi(token as string);
        console.log("Fetched offres data:", data); // Debug log
        setOffres(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des offres:", error);
      }
    };
    fetchOffres();
  }, [token]);

  useEffect(() => {
    if (selectedOffre) {
      setTitre(selectedOffre.titre);
      setDescription(selectedOffre.description);
      setEntreprise(selectedOffre.entreprise || '');
      setLieu(selectedOffre.lieu || '');
      setTypeContrat(selectedOffre.typeContrat || ''); // Use camelCase
      setDateLimiteCandidature(selectedOffre.dateLimiteCandidature ? selectedOffre.dateLimiteCandidature.split('T')[0] : ''); // Use camelCase
      setLien(selectedOffre.lien || '');
      setImageFile(null); // Reset image file when editing
    } else {
      setTitre('');
      setDescription('');
      setEntreprise('');
      setLieu('');
      setTypeContrat('');
      setDateLimiteCandidature('');
      setLien('');
      setImageFile(null); // Reset image file when adding
    }
  }, [selectedOffre]);

  // GESTION DES MODALES
  const handleAddClick = () => {
    setSelectedOffre(null);
    setFormOpen(true);
    setImageFile(null); // Reset image file when adding
  };

  const handleEditClick = (offre: OffreEmploi) => {
    setSelectedOffre(offre);
    setFormOpen(true);
    setImageFile(null); // Reset image file when editing
  };

  const handleViewClick = (offre: OffreEmploi) => {
    setSelectedOffre(offre);
    setViewOpen(true);
    console.log("Viewing offre:", offre); // Debug log
  };

  const handleDeleteClick = (offre: OffreEmploi) => {
    setSelectedOffre(offre);
    setDeleteOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setViewOpen(false);
    setDeleteOpen(false);
    setSelectedOffre(null);
    // Reset form states on close
    setTitre('');
    setDescription('');
    setEntreprise('');
    setLieu('');
    setTypeContrat('');
    setDateLimiteCandidature('');
    setLien('');
    setImageFile(null); // Reset image file on close
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setSuccessDialogTitle('');
    setSuccessDialogMessage('');
  };

  const handleDeleteConfirm = async () => {
    if (selectedOffre) {
      try {
        await offreEmploiService.deleteOffreEmploi(selectedOffre.id, token as string);
        setOffres(offres.filter(o => o.id !== selectedOffre.id));
        handleClose();
        setSuccessDialogTitle('Succès');
        setSuccessDialogMessage(`L'offre "${selectedOffre.titre}" a été supprimée avec succès.`);
        setShowSuccessDialog(true);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'offre:", error);
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
    if (!authUser?.id) {
      console.error("Current user ID not available.");
      return;
    }

    const offreData = {
      titre,
      description,
      entreprise,
      lieu,
      typeContrat: typeContrat, // Use camelCase
      dateLimiteCandidature: `${dateLimiteCandidature}T00:00:00`, // Ensure ISO 8601 format with time
      lien,
      publiePar: { id: authUser.id }, // Send publiePar as a nested object with current user's ID
    };

    const formData = new FormData();
    formData.append('offreEmploi', new Blob([JSON.stringify(offreData)], { type: 'application/json' }));

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      let responseOffre: OffreEmploi;
      let successMessage: string;
      if (selectedOffre) {
        // Update existing offre
        responseOffre = await offreEmploiService.updateOffreEmploiWithImage(selectedOffre.id, formData, token as string);
        successMessage = `L'offre "${responseOffre.titre}" a été modifiée avec succès.`;
      } else {
        // Create new offre
        responseOffre = await offreEmploiService.createOffreEmploiWithImage(formData, token as string);
        successMessage = `L'offre "${responseOffre.titre}" a été ajoutée avec succès.`;
      }
      console.log("Offre saved:", responseOffre);
      // Refresh the list of offres
      const updatedOffres = await offreEmploiService.getAllOffresEmploi(token as string);
      setOffres(updatedOffres);
      handleClose();
      setSuccessDialogTitle('Succès');
      setSuccessDialogMessage(successMessage);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error saving offre:", error);
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
  
    const filteredOffres = offres.filter(offre =>
      offre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.entreprise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.lieu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.typeContrat?.toLowerCase().includes(searchTerm.toLowerCase()) // Use camelCase
    );
  
    const pagedOffres = filteredOffres.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
    return (
      <Box>
        <Box sx={{ mb: 4, p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', bgcolor: 'background.paper' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Gestion des Offres d'Emploi
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
                            <Button variant="contained" color="primary" onClick={handleAddClick}>Ajouter une offre</Button>
                          </Grid>
                        </Grid>
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', overflowX: 'auto' }}>
                          <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Titre</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Entreprise</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Lieu</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date Limite</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {(rowsPerPage > 0
                                ? pagedOffres
                                : filteredOffres
                              ).map((offre) => {
                                console.log("Rendering offre in table:", offre); // Debug log
                                return (
                                  <TableRow key={offre.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{offre.titre}</TableCell>
                                    <TableCell>{offre.entreprise || 'N/A'}</TableCell>
                                    <TableCell>{offre.lieu || 'N/A'}</TableCell>
                                    <TableCell>{offre.dateLimiteCandidature ? new Date(offre.dateLimiteCandidature).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell align="right">
                                      <Tooltip title="Voir"><IconButton size="small" onClick={() => handleViewClick(offre)} color="info"><Visibility fontSize="small" /></IconButton></Tooltip>
                                      <Tooltip title="Modifier"><IconButton size="small" onClick={() => handleEditClick(offre)} color="primary"><Edit fontSize="small" /></IconButton></Tooltip>
                                      <Tooltip title="Supprimer"><IconButton size="small" onClick={() => handleDeleteClick(offre)} color="error"><Delete fontSize="small" /></IconButton></Tooltip>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25]}
                          component="div"
                          count={filteredOffres.length}
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
                      <DialogTitle>{selectedOffre ? 'Modifier l\'offre d\'emploi' : 'Ajouter une offre d\'emploi'}</DialogTitle>
                      <DialogContent dividers sx={{ pt: 2 }}>
                        <form onSubmit={handleFormSubmit}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}><TextField value={titre} onChange={(e) => setTitre(e.target.value)} autoFocus required margin="normal" id="titre" label="Titre de l\'offre" type="text" fullWidth variant="outlined" /></Grid>
                            <Grid item xs={12}><TextField value={description} onChange={(e) => setDescription(e.target.value)} required margin="normal" id="description" label="Description" type="text" fullWidth multiline rows={4} variant="outlined" /></Grid>
                            <Grid item xs={12} sm={6}><TextField value={entreprise} onChange={(e) => setEntreprise(e.target.value)} margin="normal" id="entreprise" label="Entreprise" type="text" fullWidth variant="outlined" /></Grid>
                            <Grid item xs={12} sm={6}><TextField value={lieu} onChange={(e) => setLieu(e.target.value)} margin="normal" id="lieu" label="Lieu" type="text" fullWidth variant="outlined" /></Grid>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth margin="normal">
                                <InputLabel id="type-contrat-select-label">Type de Contrat</InputLabel>
                                <Select
                                  labelId="type-contrat-select-label"
                                  id="typeContrat"
                                  value={typeContrat}
                                  label="Type de Contrat"
                                  onChange={(e) => setTypeContrat(e.target.value as TypeContrat)}
                                >
                                  {Object.values(TypeContrat).map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}><TextField value={dateLimiteCandidature} onChange={(e) => setDateLimiteCandidature(e.target.value)} margin="normal" id="dateLimiteCandidature" label="Date Limite Candidature" type="date" fullWidth InputLabelProps={{ shrink: true }} variant="outlined" /></Grid>
                            <Grid item xs={12}><TextField value={lien} onChange={(e) => setLien(e.target.value)} margin="normal" id="lien" label="Lien de l\'offre" type="url" fullWidth variant="outlined" /></Grid>
                            <Grid item xs={12}>
                              {selectedOffre?.imageUrl && (
                                <Box sx={{ mt: 2, mb: 2 }}>
                                  <Typography variant="subtitle1">Image actuelle:</Typography>
                                  <img src={`${API_BASE_URL}/uploads/${selectedOffre.imageUrl}`} alt="Current Offre" style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px' }} />
                                </Box>
                              )}
                              <Button
                                variant="contained"
                                component="label"
                              >
                                {selectedOffre?.imageUrl ? 'Changer l\'image' : 'Ajouter une image'}
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
                            <Button type="submit" variant="contained">{selectedOffre ? 'Enregistrer' : 'Ajouter'}</Button>
                          </DialogActions>
                        </form>
                      </DialogContent>
                    </Dialog>
              
                    {/* MODALE VOIR DÉTAILS */}
                    <Dialog open={viewOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                      <DialogTitle>Détails de l\'offre d\'emploi</DialogTitle>
                      <DialogContent dividers sx={{ pt: 2 }}>
                          {selectedOffre ? (
                              <List>
                                  <ListItem><ListItemText primary="ID" secondary={selectedOffre.id} /></ListItem>
                                  <ListItem><ListItemText primary="Titre" secondary={selectedOffre.titre} /></ListItem>
                                  <ListItem><ListItemText primary="Description" secondary={selectedOffre.description} /></ListItem>
                                  <ListItem><ListItemText primary="Entreprise" secondary={selectedOffre.entreprise || 'N/A'} /></ListItem>
                                  <ListItem><ListItemText primary="Lieu" secondary={selectedOffre.lieu || 'N/A'} /></ListItem>
                                  <ListItem><ListItemText primary="Type de Contrat" secondary={selectedOffre.typeContrat || 'N/A'} /></ListItem>
                                  <ListItem><ListItemText primary="Date Limite Candidature" secondary={selectedOffre.dateLimiteCandidature ? new Date(selectedOffre.dateLimiteCandidature).toLocaleDateString() : 'N/A'} /></ListItem>
                                  <ListItem><ListItemText primary="Lien" secondary={selectedOffre.lien || 'N/A'} /></ListItem>
                                  {selectedOffre.imageUrl && (
                                    <ListItem>
                                      <ListItemText primary="Image" />
                                      <img src={`${API_BASE_URL}/uploads/${selectedOffre.imageUrl}`} alt="Offre Image" style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px' }} />
                                    </ListItem>
                                  )}
                                  <ListItem>
                                    <ListItemText 
                                      primary="Publié par" 
                                      secondary={selectedOffre.publiePar?.email || 'N/A'} 
                                    />
                                  </ListItem>
                                  <ListItem><ListItemText primary="Créé le" secondary={selectedOffre.creeLe ? new Date(selectedOffre.creeLe).toLocaleString() : 'N/A'} /></ListItem>
                              </List>
                          ) : (
                              <Typography>Aucune offre sélectionnée.</Typography>
                          )}
                      </DialogContent>
                      <DialogActions><Button onClick={handleClose} variant="contained">Fermer</Button></DialogActions>
                    </Dialog>
      {/* MODALE CONFIRMATION SUPPRESSION */}
      <Dialog open={deleteOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}><Typography>Êtes-vous sûr de vouloir supprimer l\'offre "{selectedOffre?.titre}" ? Cette action est irréversible.</Typography></DialogContent>
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

export default OffreManagementPage;
