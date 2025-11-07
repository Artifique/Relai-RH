
import React, { useState } from 'react';
import { 
    Box, Typography, Card, CardContent, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, 
    DialogActions, Grid, TextField, List, ListItem, ListItemText
} from '@mui/material';
import { Edit, Delete, Add, Visibility } from '@mui/icons-material';

type Test = {
  id: number;
  titre: string;
  duree: number;
  questions: number;
  description?: string;
};

const initialTests: Test[] = [
  { id: 1, titre: 'Test de Logique et Raisonnement', duree: 60, questions: 30, description: 'Évalue les compétences de raisonnement logique.' },
  { id: 2, titre: 'Test de Compétences en Vente', duree: 45, questions: 25, description: 'Mesure les aptitudes commerciales.' },
  { id: 3, titre: 'QCM de Culture Générale', duree: 30, questions: 50, description: 'Teste les connaissances générales.' },
  { id: 4, titre: 'Étude de Cas : Gestion de Projet', duree: 90, questions: 5, description: 'Analyse d\'un cas pratique en gestion de projet.' },
];

const TestManagementPage: React.FC = () => {
  const [tests, setTests] = useState(initialTests);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  const handleAddClick = () => { setSelectedTest(null); setFormOpen(true); };
  const handleEditClick = (test: Test) => { setSelectedTest(test); setFormOpen(true); };
  const handleViewClick = (test: Test) => { setSelectedTest(test); setViewOpen(true); };
  const handleDeleteClick = (test: Test) => { setSelectedTest(test); setDeleteOpen(true); };

  const handleClose = () => {
    setFormOpen(false);
    setViewOpen(false);
    setDeleteOpen(false);
    setSelectedTest(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedTest) {
      setTests(tests.filter(t => t.id !== selectedTest.id));
    }
    handleClose();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Gestion des Tests d'Employabilité</Typography>
      <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddClick}>Créer un nouveau test</Button>
          </Box>
          <TableContainer component={Paper} sx={{boxShadow: 'none'}}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead><TableRow><TableCell>Titre</TableCell><TableCell align="center">Durée (min)</TableCell><TableCell align="center">Questions</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>{test.titre}</TableCell>
                    <TableCell align="center">{test.duree}</TableCell>
                    <TableCell align="center">{test.questions}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir"><IconButton size="small" onClick={() => handleViewClick(test)}><Visibility /></IconButton></Tooltip>
                      <Tooltip title="Modifier"><IconButton size="small" onClick={() => handleEditClick(test)}><Edit /></IconButton></Tooltip>
                      <Tooltip title="Supprimer"><IconButton size="small" onClick={() => handleDeleteClick(test)}><Delete /></IconButton></Tooltip>
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
        <DialogTitle>{selectedTest ? 'Modifier le test' : 'Créer un nouveau test'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{mt: 1}}>
            <Grid item xs={12}><TextField defaultValue={selectedTest?.titre} autoFocus required margin="dense" id="titre" label="Titre du test" type="text" fullWidth variant="outlined" /></Grid>
            <Grid item xs={12}><TextField defaultValue={selectedTest?.description} margin="dense" id="description" label="Description" type="text" fullWidth multiline rows={4} variant="outlined" /></Grid>
            <Grid item xs={6}><TextField defaultValue={selectedTest?.duree} margin="dense" id="duree" label="Durée (minutes)" type="number" fullWidth variant="outlined" /></Grid>
            <Grid item xs={6}><TextField defaultValue={selectedTest?.questions} margin="dense" id="questions" label="Nombre de questions" type="number" fullWidth variant="outlined" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions><Button onClick={handleClose}>Annuler</Button><Button onClick={handleClose} variant="contained">{selectedTest ? 'Enregistrer' : 'Créer'}</Button></DialogActions>
      </Dialog>

      {/* MODALE VOIR DÉTAILS */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Détails du test</DialogTitle>
        <DialogContent>
            {selectedTest && (
                <List>
                    <ListItem><ListItemText primary="ID" secondary={selectedTest.id} /></ListItem>
                    <ListItem><ListItemText primary="Titre" secondary={selectedTest.titre} /></ListItem>
                    <ListItem><ListItemText primary="Description" secondary={selectedTest.description || 'N/A'} /></ListItem>
                    <ListItem><ListItemText primary="Durée" secondary={`${selectedTest.duree} minutes`} /></ListItem>
                    <ListItem><ListItemText primary="Nombre de questions" secondary={selectedTest.questions} /></ListItem>
                </List>
            )}
        </DialogContent>
        <DialogActions><Button onClick={handleClose} variant="contained">Fermer</Button></DialogActions>
      </Dialog>

      {/* MODALE CONFIRMATION SUPPRESSION */}
      <Dialog open={deleteOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent><Typography>Êtes-vous sûr de vouloir supprimer le test "{selectedTest?.titre}" ?</Typography></DialogContent>
        <DialogActions><Button onClick={handleClose}>Annuler</Button><Button onClick={handleDeleteConfirm} variant="contained" color="error">Supprimer</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestManagementPage;
