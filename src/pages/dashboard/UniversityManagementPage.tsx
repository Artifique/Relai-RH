
import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Card, CardContent, TextField, InputAdornment, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, 
    DialogActions, Grid, List, ListItem, ListItemText
} from '@mui/material';
import { Search, Edit, Delete, Visibility } from '@mui/icons-material';
import { universityService } from '../../services/universityService';
import { University } from '../../models/university';
import { useAuth } from '../../context/AuthContext';

const UniversityManagementPage: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);
  const { token } = useAuth();

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
  };

  const handleDeleteConfirm = () => {
    if (selectedUniversity) {
      setUniversities(universities.filter(u => u.id !== selectedUniversity.id));
    }
    handleClose();
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
                {universities.map((uni) => (
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
        </CardContent>
      </Card>

      {/* MODALE AJOUT/MODIFICATION */}
      <Dialog open={formOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedUniversity ? 'Modifier l\'université' : 'Ajouter une université'}</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}><TextField defaultValue={selectedUniversity?.nom} autoFocus required margin="normal" id="nom" label="Nom de l'université" type="text" fullWidth variant="outlined" /></Grid>
            <Grid item xs={12}><TextField defaultValue={selectedUniversity?.emailContact} required margin="normal" id="emailContact" label="Email de contact" type="email" fullWidth variant="outlined" /></Grid>
            <Grid item xs={12}><TextField defaultValue={selectedUniversity?.adresse} margin="normal" id="adresse" label="Adresse" type="text" fullWidth multiline rows={3} variant="outlined" /></Grid>
            <Grid item xs={12}><TextField defaultValue={selectedUniversity?.representant?.email} margin="normal" id="representantEmail" label="Email du Représentant" type="text" fullWidth variant="outlined" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions><Button onClick={handleClose}>Annuler</Button><Button onClick={handleClose} variant="contained">{selectedUniversity ? 'Enregistrer' : 'Ajouter'}</Button></DialogActions>
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
    </Box>
  );
};

export default UniversityManagementPage;
