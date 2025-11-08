import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Card, CardContent, TextField, InputAdornment, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, 
    DialogActions, Grid, List, ListItem, ListItemText, TablePagination
} from '@mui/material';
import { Search, Delete, Visibility } from '@mui/icons-material';
import { candidatureService } from '../../services/candidatureService';
import { CandidatureBourse, CandidatureStatut } from '../../models/bourse'; // Updated import
import { useAuth } from '../../context/AuthContext';
import SuccessMessageDialog from '../../components/common/SuccessMessageDialog';

const CandidatureManagementPage: React.FC = () => {
  const [candidatures, setCandidatures] = useState<CandidatureBourse[]>([]); // Updated type
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCandidature, setSelectedCandidature] = useState<CandidatureBourse | null>(null); // Updated type
  const { token } = useAuth();

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
        const candidaturesData = await candidatureService.getAllCandidatures(token as string);
        setCandidatures(candidaturesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchData();
  }, [token]);

  // GESTION DES MODALES
  const handleViewClick = (candidature: CandidatureBourse) => {
    setSelectedCandidature(candidature);
    setViewOpen(true);
  };

  const handleDeleteClick = (candidature: CandidatureBourse) => {
    setSelectedCandidature(candidature);
    setDeleteOpen(true);
  };

  const handleClose = () => {
    setViewOpen(false);
    setDeleteOpen(false);
    setSelectedCandidature(null);
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

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setSuccessDialogTitle('');
    setSuccessDialogMessage('');
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCandidatures = candidatures.filter(candidature => {
    const offreTitre = candidature.bourse.titre || '';
    const userEmail = candidature.utilisateur.email || '';

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
            </Grid>
          </Grid>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Offre d'emploi</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Candidat</TableCell>
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
                    <TableCell>{candidature.bourse.titre}</TableCell>
                    <TableCell>{candidature.utilisateur.email}</TableCell>
                    <TableCell>{candidature.dateCandidature ? new Date(candidature.dateCandidature).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{candidature.statut}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir"><IconButton size="small" onClick={() => handleViewClick(candidature)} color="info"><Visibility fontSize="small" /></IconButton></Tooltip>
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



      {/* MODALE VOIR DÉTAILS */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Détails de la candidature</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
            {selectedCandidature ? (
                <List>
                    <ListItem><ListItemText primary="ID" secondary={selectedCandidature.id} /></ListItem>
                    <ListItem><ListItemText primary="Offre d'emploi" secondary={selectedCandidature.bourse.titre} /></ListItem>
                    <ListItem><ListItemText primary="Candidat" secondary={selectedCandidature.utilisateur.email} /></ListItem>
                    <ListItem><ListItemText primary="Date de Candidature" secondary={selectedCandidature.dateCandidature ? new Date(selectedCandidature.dateCandidature).toLocaleDateString() : 'N/A'} /></ListItem>
                    <ListItem><ListItemText primary="Statut" secondary={selectedCandidature.statut} /></ListItem>
                    <ListItem><ListItemText primary="Lettre de Motivation" secondary={selectedCandidature.lettreMotivation || 'N/A'} /></ListItem>
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
