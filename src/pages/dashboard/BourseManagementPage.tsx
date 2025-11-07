
import React, { useState } from 'react';
import { 
    Box, Typography, Card, CardContent, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, IconButton, Tooltip, Button, Chip, Dialog, DialogTitle, 
    DialogContent, DialogActions, Grid, TextField, List, ListItem, ListItemText
} from '@mui/material';
import { Edit, Delete, Add, Visibility } from '@mui/icons-material';

type Bourse = {
  id: number;
  titre: string;
  candidatures: number;
  en_attente: number;
  date_limite: string;
  description?: string;
  criteres_eligibilite?: string;
};

const initialBourses: Bourse[] = [
  { id: 1, titre: 'Bourse "Je Crée Mon Emploi" 2024', candidatures: 45, en_attente: 12, date_limite: '2024-12-31', description: 'Aide à la création d\'entreprise pour les jeunes diplômés.', criteres_eligibilite: 'Avoir un projet d\'entreprise viable.' },
  { id: 2, titre: 'Bourse d\'Excellence Numérique', candidatures: 78, en_attente: 5, date_limite: '2025-01-15', description: 'Finance les formations dans le domaine du numérique.', criteres_eligibilite: 'Être inscrit dans une formation certifiante.' },
  { id: 3, titre: 'Fonds d\'Appui à l\'Entrepreneuriat Féminin', candidatures: 120, en_attente: 35, date_limite: '2024-11-30', description: 'Soutien les femmes entrepreneures.', criteres_eligibilite: 'Projet porté par une ou plusieurs femmes.' },
];

const BourseManagementPage: React.FC = () => {
  const [bourses, setBourses] = useState(initialBourses);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBourse, setSelectedBourse] = useState<Bourse | null>(null);

  const handleAddClick = () => { setSelectedBourse(null); setFormOpen(true); };
  const handleEditClick = (bourse: Bourse) => { setSelectedBourse(bourse); setFormOpen(true); };
  const handleViewClick = (bourse: Bourse) => { setSelectedBourse(bourse); setViewOpen(true); };
  const handleDeleteClick = (bourse: Bourse) => { setSelectedBourse(bourse); setDeleteOpen(true); };

  const handleClose = () => {
    setFormOpen(false);
    setViewOpen(false);
    setDeleteOpen(false);
    setSelectedBourse(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedBourse) {
      setBourses(bourses.filter(b => b.id !== selectedBourse.id));
    }
    handleClose();
  };

  return (
    <Box>
      <Box sx={{ mb: 4, p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', bgcolor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Gestion des Bourses d'Employabilité
        </Typography>
      </Box>
      <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Grid container justifyContent="flex-end" sx={{ mb: 3 }}>
            <Grid item>
              <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddClick}>Créer une nouvelle bourse</Button>
            </Grid>
          </Grid>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Titre</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Candidatures</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>En Attente</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date Limite</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bourses.map((bourse) => (
                  <TableRow key={bourse.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{bourse.titre}</TableCell>
                    <TableCell align="center"><Chip label={bourse.candidatures} color="primary" /></TableCell>
                    <TableCell align="center"><Chip label={bourse.en_attente} color="warning" /></TableCell>
                    <TableCell>{bourse.date_limite}</TableCell>
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
        </CardContent>
      </Card>

      {/* MODALE AJOUT/MODIFICATION */}
      <Dialog open={formOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedBourse ? 'Modifier la bourse' : 'Créer une nouvelle bourse'}</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}><TextField defaultValue={selectedBourse?.titre} autoFocus required margin="normal" id="titre" label="Titre de la bourse" type="text" fullWidth variant="outlined" /></Grid>
            <Grid item xs={12}><TextField defaultValue={selectedBourse?.description} required margin="normal" id="description" label="Description" type="text" fullWidth multiline rows={5} variant="outlined" /></Grid>
            <Grid item xs={12}><TextField defaultValue={selectedBourse?.criteres_eligibilite} margin="normal" id="criteres" label="Critères d'éligibilité" type="text" fullWidth multiline rows={3} variant="outlined" /></Grid>
            <Grid item xs={12}><TextField defaultValue={selectedBourse?.date_limite} required margin="normal" id="date_limite" label="Date limite" type="date" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions><Button onClick={handleClose}>Annuler</Button><Button onClick={handleClose} variant="contained">{selectedBourse ? 'Enregistrer' : 'Créer'}</Button></DialogActions>
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
                    <ListItem><ListItemText primary="Critères d'éligibilité" secondary={selectedBourse.criteres_eligibilite || 'N/A'} /></ListItem>
                    <ListItem><ListItemText primary="Date limite" secondary={selectedBourse.date_limite} /></ListItem>
                    <ListItem><ListItemText primary="Total Candidatures" secondary={<Chip label={selectedBourse.candidatures} color="primary" />} /></ListItem>
                    <ListItem><ListItemText primary="Candidatures en attente" secondary={<Chip label={selectedBourse.en_attente} color="warning" />} /></ListItem>
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
