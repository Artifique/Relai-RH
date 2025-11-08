
import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Card, CardContent, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, IconButton, Tooltip, Button, Chip, Dialog, DialogTitle, 
    DialogContent, DialogActions, Grid, TextField, List, ListItem, ListItemText, TablePagination, InputAdornment
} from '@mui/material';
import { Edit, Delete, Add, Visibility, Search } from '@mui/icons-material';
import { BourseEmployabilite, CreateBourseEmployabiliteDto, UpdateBourseEmployabiliteDto } from '../../models/bourse';
import { bourseService } from '../../services/bourseService';
import { useAuth } from '../../context/AuthContext';

const BourseManagementPage: React.FC = () => {
  const [bourses, setBourses] = useState<BourseEmployabilite[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBourse, setSelectedBourse] = useState<BourseEmployabilite | null>(null);
  const { token, user: authUser } = useAuth();

  // Form states
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [criteresEligibilite, setCriteresEligibilite] = useState('');
  const [dateLimiteCandidature, setDateLimiteCandidature] = useState('');

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBourses = async () => {
      if (!token) {
        console.log("No token found, cannot fetch bourses.");
        return;
      }
      try {
        const data = await bourseService.getAllBourses(token as string);
        setBourses(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des bourses:", error);
      }
    };
    fetchBourses();
  }, [token]);

  const handleAddClick = () => {
    setSelectedBourse(null);
    setFormOpen(true);
    setTitre('');
    setDescription('');
    setCriteresEligibilite('');
    setDateLimiteCandidature('');
  };

  const handleEditClick = (bourse: BourseEmployabilite) => {
    setSelectedBourse(bourse);
    setFormOpen(true);
    setTitre(bourse.titre);
    setDescription(bourse.description);
    setCriteresEligibilite(bourse.criteresEligibilite || '');
    setDateLimiteCandidature(bourse.dateLimiteCandidature ? bourse.dateLimiteCandidature.split('T')[0] : '');
  };

  const handleViewClick = (bourse: BourseEmployabilite) => { setSelectedBourse(bourse); setViewOpen(true); };
  const handleDeleteClick = (bourse: BourseEmployabilite) => { setSelectedBourse(bourse); setDeleteOpen(true); };

  const handleClose = () => {
    setFormOpen(false);
    setViewOpen(false);
    setDeleteOpen(false);
    setSelectedBourse(null);
    // Reset form states on close
    setTitre('');
    setDescription('');
    setCriteresEligibilite('');
    setDateLimiteCandidature('');
  };

  const handleDeleteConfirm = async () => {
    if (selectedBourse) {
      try {
        await bourseService.deleteBourse(selectedBourse.id, token as string);
        setBourses(bourses.filter(b => b.id !== selectedBourse.id));
        handleClose();
      } catch (error) {
        console.error("Erreur lors de la suppression de la bourse:", error);
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

    const bourseData = {
      titre,
      description,
      criteresEligibilite,
      dateLimiteCandidature: `${dateLimiteCandidature}T00:00:00`, // Ensure ISO 8601 format with time
      creePar: { id: authUser.id },
    };

    try {
      let responseBourse: BourseEmployabilite;
      if (selectedBourse) {
        // Update existing bourse
        responseBourse = await bourseService.updateBourse(selectedBourse.id, bourseData as UpdateBourseEmployabiliteDto, token as string);
      } else {
        // Create new bourse
        responseBourse = await bourseService.createBourse(bourseData as CreateBourseEmployabiliteDto, token as string);
      }
      console.log("Bourse saved:", responseBourse);
      // Refresh the list of bourses
      const updatedBourses = await bourseService.getAllBourses(token as string);
      setBourses(updatedBourses);
      handleClose();
    } catch (error) {
      console.error("Error saving bourse:", error);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredBourses = bourses.filter(bourse =>
    bourse.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bourse.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bourse.criteresEligibilite?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bourse.creePar.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pagedBourses = filteredBourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Box sx={{ mb: 4, p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', bgcolor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Gestion des Bourses d'Employabilité
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
              <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddClick}>Créer une nouvelle bourse</Button>
            </Grid>
          </Grid>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Titre</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Créé par</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date Limite</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f55f5f5' }}>Créé le</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? pagedBourses
                  : filteredBourses
                ).map((bourse) => (
                  <TableRow key={bourse.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{bourse.titre}</TableCell>
                    <TableCell>{bourse.creePar.email}</TableCell>
                    <TableCell>{bourse.dateLimiteCandidature ? new Date(bourse.dateLimiteCandidature).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{bourse.creeLe ? new Date(bourse.creeLe).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir les détails"><IconButton size="small" onClick={() => handleViewClick(bourse)} color="info"><Visibility fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Modifier"><IconButton size="small" onClick={() => handleEditClick(bourse)} color="primary"><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Supprimer"><IconButton size="small" onClick={() => handleDeleteClick(bourse)} color="error"><Delete fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredBourses.length}
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
        <DialogTitle>{selectedBourse ? 'Modifier la bourse' : 'Créer une nouvelle bourse'}</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}><TextField value={titre} onChange={(e) => setTitre(e.target.value)} autoFocus required margin="normal" id="titre" label="Titre de la bourse" type="text" fullWidth variant="outlined" /></Grid>
              <Grid item xs={12}><TextField value={description} onChange={(e) => setDescription(e.target.value)} required margin="normal" id="description" label="Description" type="text" fullWidth multiline rows={5} variant="outlined" /></Grid>
              <Grid item xs={12}><TextField value={criteresEligibilite} onChange={(e) => setCriteresEligibilite(e.target.value)} margin="normal" id="criteres" label="Critères d'éligibilité" type="text" fullWidth multiline rows={3} variant="outlined" /></Grid>
              <Grid item xs={12}><TextField value={dateLimiteCandidature} onChange={(e) => setDateLimiteCandidature(e.target.value)} required margin="normal" id="date_limite" label="Date limite" type="date" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} /></Grid>
            </Grid>
            <DialogActions><Button onClick={handleClose}>Annuler</Button><Button type="submit" variant="contained">{selectedBourse ? 'Enregistrer' : 'Créer'}</Button></DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODALE VOIR DÉTAILS */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Détails de la bourse</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
            {selectedBourse && (
                <List>
                    <ListItem><ListItemText primary="ID" secondary={selectedBourse.id} /></ListItem>
                    <ListItem><ListItemText primary="Titre" secondary={selectedBourse.titre} /></ListItem>
                    <ListItem><ListItemText primary="Description" secondary={selectedBourse.description || 'N/A'} /></ListItem>
                    <ListItem><ListItemText primary="Critères d'éligibilité" secondary={selectedBourse.criteresEligibilite || 'N/A'} /></ListItem>
                    <ListItem><ListItemText primary="Date limite" secondary={selectedBourse.dateLimiteCandidature ? new Date(selectedBourse.dateLimiteCandidature).toLocaleDateString() : 'N/A'} /></ListItem>
                    <ListItem><ListItemText primary="Créé par" secondary={selectedBourse.creePar.email || 'N/A'} /></ListItem>
                    <ListItem><ListItemText primary="Créé le" secondary={selectedBourse.creeLe ? new Date(selectedBourse.creeLe).toLocaleString() : 'N/A'} /></ListItem>
                </List>
            )}
        </DialogContent>
        <DialogActions><Button onClick={handleClose} variant="contained">Fermer</Button></DialogActions>
      </Dialog>

      {/* MODALE CONFIRMATION SUPPRESSION */}
      <Dialog open={deleteOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}><Typography>Êtes-vous sûr de vouloir supprimer la bourse "{selectedBourse?.titre}" ?</Typography></DialogContent>
        <DialogActions><Button onClick={handleClose}>Annuler</Button><Button onClick={handleDeleteConfirm} variant="contained" color="error">Supprimer</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

export default BourseManagementPage;
