import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Card, CardContent, TextField, InputAdornment, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, 
    DialogActions, Grid, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, TablePagination
} from '@mui/material';
import { Search, Edit, Delete, Visibility } from '@mui/icons-material';
import { offreEmploiService } from '../../services/offreEmploiService';
import { OffreEmploi } from '../../models/offreEmploi';
import { useAuth } from '../../context/AuthContext';
import SuccessMessageDialog from '../../components/common/SuccessMessageDialog';

const OffreManagementPage: React.FC = () => {
  const [offres, setOffres] = useState<OffreEmploi[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState<OffreEmploi | null>(null);
  const { token } = useAuth();

  // Form states
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [lieu, setLieu] = useState('');
  const [typeContrat, setTypeContrat] = useState('');
  const [dateLimiteCandidature, setDateLimiteCandidature] = useState('');
  const [lien, setLien] = useState('');
  const [publieParId, setPublieParId] = useState<number | ''>('');
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
      setTypeContrat(selectedOffre.type_contrat || '');
      setDateLimiteCandidature(selectedOffre.date_limite_candidature ? selectedOffre.date_limite_candidature.split('T')[0] : '');
      setLien(selectedOffre.lien || '');
      setPublieParId(selectedOffre.publie_par_id || '');
      setImageFile(null);
    } else {
      setTitre('');
      setDescription('');
      setEntreprise('');
      setLieu('');
      setTypeContrat('');
      setDateLimiteCandidature('');
      setLien('');
      setPublieParId('');
      setImageFile(null);
    }
  }, [selectedOffre]);

  // GESTION DES MODALES
  const handleAddClick = () => {
    setSelectedOffre(null);
    setFormOpen(true);
  };

  const handleEditClick = (offre: OffreEmploi) => {
    setSelectedOffre(offre);
    setFormOpen(true);
  };

  const handleViewClick = (offre: OffreEmploi) => {
    setSelectedOffre(offre);
    setViewOpen(true);
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
    setPublieParId('');
    setImageFile(null);
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

    const offreData = {
      titre,
      description,
      entreprise,
      lieu,
      type_contrat: typeContrat,
      date_limite_candidature: dateLimiteCandidature,
      lien,
      publie_par_id: publieParId ? (publieParId as number) : undefined,
      image_url: selectedOffre?.image_url || undefined, // Keep existing image if no new one, otherwise undefined
    };

    const formData = new FormData();
    formData.append('offre', new Blob([JSON.stringify(offreData)], { type: 'application/json' }));

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      let responseOffre: OffreEmploi;
      let successMessage: string;
      if (selectedOffre) {
        // Update existing offre
        responseOffre = await offreEmploiService.updateOffreEmploi(selectedOffre.id, formData, token as string);
        successMessage = `L'offre "${responseOffre.titre}" a été modifiée avec succès.`;
      } else {
        // Create new offre
        responseOffre = await offreEmploiService.createOffreEmploi(formData, token as string);
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
      offre.type_contrat?.toLowerCase().includes(searchTerm.toLowerCase())
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
                  ).map((offre) => (
                    <TableRow key={offre.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{offre.titre}</TableCell>
                      <TableCell>{offre.entreprise || 'N/A'}</TableCell>
                      <TableCell>{offre.lieu || 'N/A'}</TableCell>
                      <TableCell>{offre.date_limite_candidature ? new Date(offre.date_limite_candidature).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Voir"><IconButton size="small" onClick={() => handleViewClick(offre)} color="info"><Visibility fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Modifier"><IconButton size="small" onClick={() => handleEditClick(offre)} color="primary"><Edit fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Supprimer"><IconButton size="small" onClick={() => handleDeleteClick(offre)} color="error"><Delete fontSize="small" /></IconButton></Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
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
              <Grid item xs={12} sm={6}><TextField value={typeContrat} onChange={(e) => setTypeContrat(e.target.value)} margin="normal" id="typeContrat" label="Type de Contrat" type="text" fullWidth variant="outlined" /></Grid>
              <Grid item xs={12} sm={6}><TextField value={dateLimiteCandidature} onChange={(e) => setDateLimiteCandidature(e.target.value)} margin="normal" id="dateLimiteCandidature" label="Date Limite Candidature" type="date" fullWidth InputLabelProps={{ shrink: true }} variant="outlined" /></Grid>
              <Grid item xs={12}><TextField value={lien} onChange={(e) => setLien(e.target.value)} margin="normal" id="lien" label="Lien de l\'offre" type="url" fullWidth variant="outlined" /></Grid>
              <Grid item xs={12}><TextField value={publieParId} onChange={(e) => setPublieParId(parseInt(e.target.value) || '')} margin="normal" id="publieParId" label="Publié par (ID Utilisateur)" type="number" fullWidth variant="outlined" /></Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="offre-image-upload"
                  type="file"
                  onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                />
                <label htmlFor="offre-image-upload">
                  <Button variant="contained" component="span">
                    {imageFile ? imageFile.name : 'Uploader une image'}
                  </Button>
                </label>
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
                    <ListItem><ListItemText primary="Type de Contrat" secondary={selectedOffre.type_contrat || 'N/A'} /></ListItem>
                    <ListItem><ListItemText primary="Date Limite Candidature" secondary={selectedOffre.date_limite_candidature ? new Date(selectedOffre.date_limite_candidature).toLocaleDateString() : 'N/A'} /></ListItem>
                    <ListItem><ListItemText primary="Lien" secondary={selectedOffre.lien || 'N/A'} /></ListItem>
                    <ListItem><ListItemText primary="Publié par (ID)" secondary={selectedOffre.publie_par_id || 'N/A'} /></ListItem>
                    {selectedOffre.image_url && (
                        <ListItem>
                            <ListItemText primary="Image" />
                            <img 
                                src={`http://localhost:8080/uploads/${selectedOffre.image_url}`}
                                alt="Offre Image"
                                style={{ maxWidth: '100%', height: 'auto', marginTop: '8px' }}
                            />
                        </ListItem>
                    )}
                    <ListItem><ListItemText primary="Créé le" secondary={selectedOffre.cree_le ? new Date(selectedOffre.cree_le).toLocaleString() : 'N/A'} /></ListItem>
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
