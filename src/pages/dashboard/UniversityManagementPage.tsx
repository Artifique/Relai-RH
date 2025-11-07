
import React, { useState } from 'react';
import { 
    Box, Typography, Card, CardContent, TextField, InputAdornment, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, 
    DialogActions, Grid, List, ListItem, ListItemText
} from '@mui/material';
import { Search, Edit, Delete, Visibility } from '@mui/icons-material';

// Définir un type pour les objets université pour plus de sécurité
type University = {
  id: number;
  nom: string;
  email: string;
  representant: string;
  adresse?: string;
};

// Données factices
const initialUniversities: University[] = [
  { id: 1, nom: 'Université des Sciences Sociales et de Gestion de Bamako', email: 'contact@ussgb.ml', representant: 'Fanta Diarra', adresse: 'Bamako, Mali' },
  { id: 2, nom: 'Université des Sciences, des Techniques et des Technologies de Bamako', email: 'contact@usttb.ml', representant: 'Moussa Coulibaly', adresse: 'Bamako, Mali' },
  { id: 3, nom: 'Université des Lettres et des Sciences Humaines de Bamako', email: 'contact@ulshb.ml', representant: 'Awa Keita', adresse: 'Bamako, Mali' },
];

const UniversityManagementPage: React.FC = () => {
  const [universities, setUniversities] = useState(initialUniversities);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);

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
      <Typography variant="h4" gutterBottom>Gestion des Universités</Typography>
      <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField variant="outlined" size="small" placeholder="Rechercher..." InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
            <Button variant="contained" color="primary" onClick={handleAddClick}>Ajouter une université</Button>
          </Box>
          <TableContainer component={Paper} sx={{boxShadow: 'none'}}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead><TableRow><TableCell>Nom</TableCell><TableCell>Email</TableCell><TableCell>Représentant</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
              <TableBody>
                {universities.map((uni) => (
                  <TableRow key={uni.id}>
                    <TableCell>{uni.nom}</TableCell>
                    <TableCell>{uni.email}</TableCell>
                    <TableCell>{uni.representant}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir"><IconButton size="small" onClick={() => handleViewClick(uni)}><Visibility /></IconButton></Tooltip>
                      <Tooltip title="Modifier"><IconButton size="small" onClick={() => handleEditClick(uni)}><Edit /></IconButton></Tooltip>
                      <Tooltip title="Supprimer"><IconButton size="small" onClick={() => handleDeleteClick(uni)}><Delete /></IconButton></Tooltip>
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
        <DialogContent>
          <Grid container spacing={2} sx={{mt: 1}}>
            <Grid item xs={12}><TextField defaultValue={selectedUniversity?.nom} autoFocus required margin="dense" id="nom" label="Nom de l'université" type="text" fullWidth variant="outlined" /></Grid>
            <Grid item xs={12}><TextField defaultValue={selectedUniversity?.email} required margin="dense" id="email" label="Email de contact" type="email" fullWidth variant="outlined" /></Grid>
            <Grid item xs={12}><TextField defaultValue={selectedUniversity?.adresse} margin="dense" id="adresse" label="Adresse" type="text" fullWidth multiline rows={3} variant="outlined" /></Grid>
            <Grid item xs={12}><TextField defaultValue={selectedUniversity?.representant} margin="dense" id="representant" label="Nom du Représentant" type="text" fullWidth variant="outlined" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions><Button onClick={handleClose}>Annuler</Button><Button onClick={handleClose} variant="contained">{selectedUniversity ? 'Enregistrer' : 'Ajouter'}</Button></DialogActions>
      </Dialog>

      {/* MODALE VOIR DÉTAILS */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Détails de l'université</DialogTitle>
        <DialogContent>
            {selectedUniversity && (
                <List>
                    <ListItem><ListItemText primary="ID" secondary={selectedUniversity.id} /></ListItem>
                    <ListItem><ListItemText primary="Nom" secondary={selectedUniversity.nom} /></ListItem>
                    <ListItem><ListItemText primary="Email" secondary={selectedUniversity.email} /></ListItem>
                    <ListItem><ListItemText primary="Adresse" secondary={selectedUniversity.adresse || 'N/A'} /></ListItem>
                    <ListItem><ListItemText primary="Représentant" secondary={selectedUniversity.representant} /></ListItem>
                </List>
            )}
        </DialogContent>
        <DialogActions><Button onClick={handleClose} variant="contained">Fermer</Button></DialogActions>
      </Dialog>

      {/* MODALE CONFIRMATION SUPPRESSION */}
      <Dialog open={deleteOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent><Typography>Êtes-vous sûr de vouloir supprimer l'université "{selectedUniversity?.nom}" ? Cette action est irréversible.</Typography></DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UniversityManagementPage;
