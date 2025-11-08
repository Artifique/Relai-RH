
import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Card, CardContent, TextField, InputAdornment, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, 
    DialogActions, Grid, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, TablePagination
} from '@mui/material';
import { Search, Edit, Delete, Visibility } from '@mui/icons-material';
import { universityService } from '../../services/universityService';
import { University, CreateUniversityDto, UpdateUniversityDto } from '../../models/university';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { FullUser, UserRole } from '../../models/user';
// import { uploadFile } from '../../services/api'; // Removed uploadFile import
import SuccessMessageDialog from '../../components/common/SuccessMessageDialog';

const UniversityManagementPage: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);
  const { token } = useAuth();

  // Form states
  const [nom, setNom] = useState('');
  const [emailContact, setEmailContact] = useState('');
  const [adresse, setAdresse] = useState('');
  const [representantId, setRepresentantId] = useState<number | ''>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [representativeUsers, setRepresentativeUsers] = useState<FullUser[]>([]);

  // Success Dialog states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successDialogTitle, setSuccessDialogTitle] = useState('');
  const [successDialogMessage, setSuccessDialogMessage] = useState('');

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchUniversities = async () => {
      if (!token) {
        console.log("No token found, cannot fetch universities.");
        return;
      }
      try {
        const data = await universityService.getAllUniversities(token);
        setUniversities(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des universités:", error);
      }
    };
    fetchUniversities();
  }, [token]);

  useEffect(() => {
    if (selectedUniversity) {
      console.log("selectedUniversity changed:", selectedUniversity);
      setNom(selectedUniversity.nom);
      setEmailContact(selectedUniversity.emailContact);
      setAdresse(selectedUniversity.adresse || '');
      const repId = selectedUniversity.representant?.id || '';
      setRepresentantId(repId);
      console.log("Setting representantId to:", repId);
      // Reset image file when selecting a new university
      setImageFile(null);
    } else {
      console.log("selectedUniversity is null, resetting form.");
      setNom('');
      setEmailContact('');
      setAdresse('');
      setRepresentantId('');
      setImageFile(null);
    }
  }, [selectedUniversity]);

  useEffect(() => {
    const fetchRepresentativeUsers = async () => {
      if (!token) return;
      try {
        const allUsers = await userService.getAllUsers(token);
        const reps = allUsers.filter(user => user.role === UserRole.REPRESENTANT_UNIVERSITE);
        setRepresentativeUsers(reps);
        console.log("Representative users loaded:", reps);
      } catch (error) {
        console.error("Erreur lors de la récupération des représentants:", error);
      }
    };
    fetchRepresentativeUsers();
  }, [token]);

  useEffect(() => {
    if (selectedUniversity?.imageUrl && token) {
      const fetchImage = async () => {
        try {
          const fullImageUrl = `http://localhost:8080/uploads/${selectedUniversity.imageUrl}`;
          const response = await fetch(fullImageUrl, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
          }

          const imageBlob = await response.blob();
          const url = URL.createObjectURL(imageBlob);
          setImageObjectUrl(url);
        } catch (error) {
          console.error("Erreur lors du chargement de l'image:", error);
          setImageObjectUrl(null);
        }
      };
      fetchImage();
    } else {
      setImageObjectUrl(null);
    }

    return () => {
      if (imageObjectUrl) {
        URL.revokeObjectURL(imageObjectUrl);
      }
    };
  }, [selectedUniversity, token, imageObjectUrl]);

  // GESTION DES MODALES
  const handleAddClick = () => {
    setSelectedUniversity(null); // Pas d'université sélectionnée pour l'ajout
    setFormOpen(true);
  };

  const handleEditClick = (uni: University) => {
    setSelectedUniversity(uni);
    setFormOpen(true);
  };

  const handleViewClick = (uni: University) => {
    setSelectedUniversity(uni);
    setViewOpen(true);
  };

  const handleDeleteClick = (uni: University) => {
    setSelectedUniversity(uni);
    setDeleteOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setViewOpen(false);
    setDeleteOpen(false);
    setSelectedUniversity(null);
    // Reset form states on close
    setNom('');
    setEmailContact('');
    setAdresse('');
    setRepresentantId('');
    setImageFile(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUniversity) {
      try {
        await universityService.deleteUniversity(selectedUniversity.id, token as string);
        setUniversities(universities.filter(u => u.id !== selectedUniversity.id));
        handleClose();
        setSuccessDialogTitle('Succès');
        setSuccessDialogMessage(`L'université "${selectedUniversity.nom}" a été supprimée avec succès.`);
        setShowSuccessDialog(true);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'université:", error);
        // Optionally, show an error message to the user
      }
    }
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setSuccessDialogTitle('');
    setSuccessDialogMessage('');
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      console.error("No token available for submission.");
      return;
    }

    const universityData = {
      nom,
      emailContact,
      adresse,
      imageUrl: selectedUniversity?.imageUrl || undefined, // Keep existing image if no new one, otherwise undefined
      representant: representantId ? { id: representantId as number } : undefined,
    };

    const formData = new FormData();
    formData.append('universite', new Blob([JSON.stringify(universityData)], { type: 'application/json' }));

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      let responseUniversity: University;
      let successMessage: string;
      if (selectedUniversity) {
        // Update existing university
        responseUniversity = await universityService.updateUniversity(selectedUniversity.id, formData, token as string);
        successMessage = `L'université "${responseUniversity.nom}" a été modifiée avec succès.`;
      } else {
        // Create new university
        responseUniversity = await universityService.createUniversity(formData, token as string);
        successMessage = `L'université "${responseUniversity.nom}" a été ajoutée avec succès.`;
      }
      console.log("University saved:", responseUniversity);
      // Refresh the list of universities
      const updatedUniversities = await universityService.getAllUniversities(token as string);
      setUniversities(updatedUniversities);
      handleClose();
      setSuccessDialogTitle('Succès');
      setSuccessDialogMessage(successMessage);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error saving university:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', bgcolor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Gestion des Universités
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
                InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={8} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Button variant="contained" color="primary" onClick={handleAddClick}>Ajouter une université</Button>
            </Grid>
          </Grid>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Nom</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Email de Contact</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Représentant (Email)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? universities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : universities
                ).map((uni) => (
                  <TableRow key={uni.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{uni.nom}</TableCell>
                    <TableCell>{uni.emailContact}</TableCell>
                    <TableCell>{uni.representant?.email || 'N/A'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir"><IconButton size="small" onClick={() => handleViewClick(uni)} color="info"><Visibility fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Modifier"><IconButton size="small" onClick={() => handleEditClick(uni)} color="primary"><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Supprimer"><IconButton size="small" onClick={() => handleDeleteClick(uni)} color="error"><Delete fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={universities.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Lignes par page :"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          />
        </CardContent>
      </Card>

      {/* MODALE AJOUT/MODIFICATION */}
      <Dialog open={formOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedUniversity ? 'Modifier l\'université' : 'Ajouter une université'}</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}><TextField value={nom} onChange={(e) => setNom(e.target.value)} autoFocus required margin="normal" id="nom" label="Nom de l'université" type="text" fullWidth variant="outlined" /></Grid>
              <Grid item xs={12}><TextField value={emailContact} onChange={(e) => setEmailContact(e.target.value)} required margin="normal" id="emailContact" label="Email de contact" type="email" fullWidth variant="outlined" /></Grid>
              <Grid item xs={12}><TextField value={adresse} onChange={(e) => setAdresse(e.target.value)} margin="normal" id="adresse" label="Adresse" type="text" fullWidth multiline rows={3} variant="outlined" /></Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="representant-select-label">Représentant</InputLabel>
                  <Select
                    labelId="representant-select-label"
                    id="representantId"
                    value={representantId}
                    label="Représentant"
                    onChange={(e) => setRepresentantId(e.target.value as number)}
                  >
                    <MenuItem value=""><em>Aucun</em></MenuItem>
                    {representativeUsers.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.email} (ID: {user.id})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  multiple
                  type="file"
                  onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                />
                <label htmlFor="raised-button-file">
                  <Button variant="contained" component="span">
                    {imageFile ? imageFile.name : 'Uploader une image'}
                  </Button>
                </label>
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={handleClose}>Annuler</Button>
              <Button type="submit" variant="contained">{selectedUniversity ? 'Enregistrer' : 'Ajouter'}</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODALE VOIR DÉTAILS */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Détails de l'université</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
            {selectedUniversity ? (
                <List>
                    <ListItem><ListItemText primary="ID" secondary={selectedUniversity.id} /></ListItem>
                    <ListItem><ListItemText primary="Nom" secondary={selectedUniversity.nom} /></ListItem>
                    <ListItem><ListItemText primary="Email de Contact" secondary={selectedUniversity.emailContact} /></ListItem>
                    <ListItem><ListItemText primary="Adresse" secondary={selectedUniversity.adresse || 'N/A'} /></ListItem>
                    <ListItem><ListItemText primary="Représentant (Email)" secondary={selectedUniversity.representant?.email || 'N/A'} /></ListItem>
                    {selectedUniversity.imageUrl && imageObjectUrl && (
                        <ListItem>
                            <ListItemText primary="Image" />
                            <img 
                                src={imageObjectUrl}
                                alt="University Logo"
                                style={{ maxWidth: '100%', height: 'auto', marginTop: '8px' }}
                            />
                        </ListItem>
                    )}
                </List>
            ) : (
                <Typography>Aucune université sélectionnée.</Typography>
            )}
        </DialogContent>
        <DialogActions><Button onClick={handleClose} variant="contained">Fermer</Button></DialogActions>
      </Dialog>

      {/* MODALE CONFIRMATION SUPPRESSION */}
      <Dialog open={deleteOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}><Typography>Êtes-vous sûr de vouloir supprimer l'université "{selectedUniversity?.nom}" ? Cette action est irréversible.</Typography></DialogContent>
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

export default UniversityManagementPage;
