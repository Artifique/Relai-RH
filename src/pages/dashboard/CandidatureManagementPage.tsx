import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Card, CardContent, TextField, InputAdornment, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, 
    DialogActions, Grid, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, TablePagination
} from '@mui/material';
import { Search, Edit, Delete, Visibility } from '@mui/icons-material';
import { candidatureService } from '../../services/candidatureService';
import { Candidature, StatutCandidature, CreateCandidatureDto, UpdateCandidatureDto } from '../../models/candidature';
import { useAuth } from '../../context/AuthContext';
import SuccessMessageDialog from '../../components/common/SuccessMessageDialog';
import { offreEmploiService } from '../../services/offreEmploiService';
import { OffreEmploi } from '../../models/offreEmploi';
import { userService } from '../../services/userService';
import { FullUser } from '../../models/user';

const CandidatureManagementPage: React.FC = () => {
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCandidature, setSelectedCandidature] = useState<Candidature | null>(null);
  const { token } = useAuth();

  // Form states
  const [offreEmploiId, setOffreEmploiId] = useState<number | ''>('');
  const [utilisateurId, setUtilisateurId] = useState<number | ''>('');
  const [statut, setStatut] = useState<StatutCandidature | ''>('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [lettreMotivationFile, setLettreMotivationFile] = useState<File | null>(null);

  // Dropdown data
  const [offresEmploi, setOffresEmploi] = useState<OffreEmploi[]>([]);
  const [users, setUsers] = useState<FullUser[]>([]);

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
      try {
        const [candidaturesData, offresData, usersData] = await Promise.all([
          candidatureService.getAllCandidatures(token as string),
          offreEmploiService.getAllOffresEmploi(token as string),
          userService.getAllUsers(token as string),
        ]);
        setCandidatures(candidaturesData);
        setOffresEmploi(offresData);
        setUsers(usersData); // All users might be relevant for candidature
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (selectedCandidature) {
      setOffreEmploiId(selectedCandidature.offre_emploi_id);
      setUtilisateurId(selectedCandidature.utilisateur_id);
      setStatut(selectedCandidature.statut);
      setCvFile(null); // Reset file inputs
      setLettreMotivationFile(null); // Reset file inputs
    } else {
      setOffreEmploiId('');
      setUtilisateurId('');
      setStatut('');
      setCvFile(null);
      setLettreMotivationFile(null);
    }
  }, [selectedCandidature]);

  // GESTION DES MODALES
  const handleAddClick = () => {
    setSelectedCandidature(null);
    setFormOpen(true);
  };

  const handleEditClick = (candidature: Candidature) => {
    setSelectedCandidature(candidature);
    setFormOpen(true);
  };

  const handleViewClick = (candidature: Candidature) => {
    setSelectedCandidature(candidature);
    setViewOpen(true);
  };

  const handleDeleteClick = (candidature: Candidature) => {
    setSelectedCandidature(candidature);
    setDeleteOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setViewOpen(false);
    setDeleteOpen(false);
    setSelectedCandidature(null);
    // Reset form states on close
    setOffreEmploiId('');
    setUtilisateurId('');
    setStatut('');
    setCvFile(null);
    setLettreMotivationFile(null);
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setSuccessDialogTitle('');
    setSuccessDialogMessage('');
  };

  const handleDeleteConfirm = async () => {
    if (selectedCandidature) {
      try {
        await candidatureService.deleteCandidature(selectedCandidature.id, token as string);
        setCandidatures(candidatures.filter(c => c.id !== selectedCandidature.id));
        handleClose();
        setSuccessDialogTitle('Succès');
        setSuccessDialogMessage(`La candidature (ID: ${selectedCandidature.id}) a été supprimée avec succès.`);
        setShowSuccessDialog(true);
      } catch (error) {
        console.error("Erreur lors de la suppression de la candidature:", error);
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

    const candidatureData = {
      offre_emploi_id: offreEmploiId as number,
      utilisateur_id: utilisateurId as number,
      statut: statut as StatutCandidature,
      // cv_url: selectedCandidature?.cv_url || undefined, // These will be handled by file upload
      // lettre_motivation_url: selectedCandidature?.lettre_motivation_url || undefined,
    };

    const formData = new FormData();
    formData.append('candidature', new Blob([JSON.stringify(candidatureData)], { type: 'application/json' }));

    if (cvFile) {
      formData.append('cv_file', cvFile);
    }
    if (lettreMotivationFile) {
      formData.append('lettre_motivation_file', lettreMotivationFile);
    }

    try {
      let responseCandidature: Candidature;
      let successMessage: string;
      if (selectedCandidature) {
        // Update existing candidature
        responseCandidature = await candidatureService.updateCandidature(selectedCandidature.id, formData, token as string);
        successMessage = `La candidature (ID: ${responseCandidature.id}) a été modifiée avec succès.`;
      } else {
        // Create new candidature
        responseCandidature = await candidatureService.createCandidature(formData, token as string);
        successMessage = `La candidature (ID: ${responseCandidature.id}) a été ajoutée avec succès.`;
      }
      console.log("Candidature saved:", responseCandidature);
      // Refresh the list of candidatures
      const updatedCandidatures = await candidatureService.getAllCandidatures(token as string);
      setCandidatures(updatedCandidatures);
      handleClose();
      setSuccessDialogTitle('Succès');
      setSuccessDialogMessage(successMessage);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error saving candidature:", error);
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

  const filteredCandidatures = candidatures.filter(candidature => {
    const offre = offresEmploi.find(o => o.id === candidature.offre_emploi_id);
    const user = users.find(u => u.id === candidature.utilisateur_id);
    const offreTitre = offre?.titre || '';
    const userEmail = user?.email || '';

    return (
      offreTitre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidature.statut.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const pagedCandidatures = filteredCandidatures.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Box sx={{ mb: 4, p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', bgcolor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Gestion des Candidatures
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
              <Button variant="contained" color="primary" onClick={handleAddClick}>Ajouter une candidature</Button>
            </Grid>
          </Grid>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID Offre</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID Utilisateur</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date Candidature</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Statut</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? pagedCandidatures
                  : filteredCandidatures
                ).map((candidature) => (
                  <TableRow key={candidature.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{candidature.offre_emploi_id}</TableCell>
                    <TableCell>{candidature.utilisateur_id}</TableCell>
                    <TableCell>{new Date(candidature.date_candidature).toLocaleDateString()}</TableCell>
                    <TableCell>{candidature.statut}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir"><IconButton size="small" onClick={() => handleViewClick(candidature)} color="info"><Visibility fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Modifier"><IconButton size="small" onClick={() => handleEditClick(candidature)} color="primary"><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Supprimer"><IconButton size="small" onClick={() => handleDeleteClick(candidature)} color="error"><Delete fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCandidatures.length}
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
        <DialogTitle>{selectedCandidature ? 'Modifier la candidature' : 'Ajouter une candidature'}</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="offre-emploi-select-label">Offre d'emploi</InputLabel>
                  <Select
                    labelId="offre-emploi-select-label"
                    id="offreEmploiId"
                    value={offreEmploiId}
                    label="Offre d'emploi"
                    onChange={(e) => setOffreEmploiId(e.target.value as number)}
                  >
                    <MenuItem value=""><em>Sélectionner une offre</em></MenuItem>
                    {offresEmploi.map((offre) => (
                      <MenuItem key={offre.id} value={offre.id}>{offre.titre}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="utilisateur-select-label">Utilisateur</InputLabel>
                  <Select
                    labelId="utilisateur-select-label"
                    id="utilisateurId"
                    value={utilisateurId}
                    label="Utilisateur"
                    onChange={(e) => setUtilisateurId(e.target.value as number)}
                  >
                    <MenuItem value=""><em>Sélectionner un utilisateur</em></MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>{user.email} (ID: {user.id})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="statut-select-label">Statut</InputLabel>
                  <Select
                    labelId="statut-select-label"
                    id="statut"
                    value={statut}
                    label="Statut"
                    onChange={(e) => setStatut(e.target.value as StatutCandidature)}
                  >
                    {Object.values(StatutCandidature).map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <input
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  id="cv-file-upload"
                  type="file"
                  onChange={(e) => setCvFile(e.target.files ? e.target.files[0] : null)}
                />
                <label htmlFor="cv-file-upload">
                  <Button variant="contained" component="span">
                    {cvFile ? cvFile.name : 'Uploader CV'}
                  </Button>
                </label>
              </Grid>
              <Grid item xs={12} sm={6}>
                <input
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  id="lettre-motivation-file-upload"
                  type="file"
                  onChange={(e) => setLettreMotivationFile(e.target.files ? e.target.files[0] : null)}
                />
                <label htmlFor="lettre-motivation-file-upload">
                  <Button variant="contained" component="span">
                    {lettreMotivationFile ? lettreMotivationFile.name : 'Uploader Lettre de Motivation'}
                  </Button>
                </label>
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={handleClose}>Annuler</Button>
              <Button type="submit" variant="contained">{selectedCandidature ? 'Enregistrer' : 'Ajouter'}</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODALE VOIR DÉTAILS */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Détails de la candidature</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
            {selectedCandidature ? (
                <List>
                    <ListItem><ListItemText primary="ID" secondary={selectedCandidature.id} /></ListItem>
                    <ListItem><ListItemText primary="ID Offre d'emploi" secondary={selectedCandidature.offre_emploi_id} /></ListItem>
                    <ListItem><ListItemText primary="ID Utilisateur" secondary={selectedCandidature.utilisateur_id} /></ListItem>
                    <ListItem><ListItemText primary="Date de Candidature" secondary={new Date(selectedCandidature.date_candidature).toLocaleDateString()} /></ListItem>
                    <ListItem><ListItemText primary="Statut" secondary={selectedCandidature.statut} /></ListItem>
                    <ListItem><ListItemText primary="CV URL" secondary={selectedCandidature.cv_url || 'N/A'} /></ListItem>
                    <ListItem><ListItemText primary="Lettre de Motivation URL" secondary={selectedCandidature.lettre_motivation_url || 'N/A'} /></ListItem>
                </List>
            ) : (
                <Typography>Aucune candidature sélectionnée.</Typography>
            )}
        </DialogContent>
        <DialogActions><Button onClick={handleClose} variant="contained">Fermer</Button></DialogActions>
      </Dialog>

      {/* MODALE CONFIRMATION SUPPRESSION */}
      <Dialog open={deleteOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}><Typography>Êtes-vous sûr de vouloir supprimer la candidature (ID: {selectedCandidature?.id}) ? Cette action est irréversible.</Typography></DialogContent>
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

export default CandidatureManagementPage;
