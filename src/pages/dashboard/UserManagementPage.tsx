
import React, { useState } from 'react';
import { 
    Box, Typography, Card, CardContent, TextField, InputAdornment, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, IconButton, Tooltip, Chip, Button, Dialog, DialogTitle, 
    DialogContent, DialogActions, Grid, Select, MenuItem, InputLabel, FormControl, List, ListItem, ListItemText
} from '@mui/material';
import { Search, Edit, Delete, Visibility } from '@mui/icons-material';

type User = {
  id: number;
  nom: string;
  email: string;
  role: string;
  status: string;
};

const initialUsers: User[] = [
  { id: 1, nom: 'Alain Manus', email: 'manus.al@example.com', role: 'ETUDIANT', status: 'Actif' },
  { id: 2, nom: 'Binta Diallo', email: 'binta.diallo@example.com', role: 'DIPLOME', status: 'Actif' },
  { id: 3, nom: 'Cheick Traoré', email: 'cheick.traore@example.com', role: 'DEMANDEUR_EMPLOI', status: 'Inactif' },
  { id: 4, nom: 'Fanta Diarra', email: 'fanta.diarra@univ-sb.com', role: 'REPRESENTANT_UNIVERSITE', status: 'Actif' },
  { id: 5, nom: 'Admin Principal', email: 'admin@relai.rh', role: 'ADMINISTRATEUR', status: 'Actif' },
];

const userRoles = ['ETUDIANT', 'DIPLOME', 'DEMANDEUR_EMPLOI', 'REPRESENTANT_UNIVERSITE', 'ADMINISTRATEUR'];

const roleColors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
    ETUDIANT: 'primary', DIPLOME: 'secondary', DEMANDEUR_EMPLOI: 'warning', REPRESENTANT_UNIVERSITE: 'info', ADMINISTRATEUR: 'error',
};

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState(initialUsers);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleAddClick = () => { setSelectedUser(null); setFormOpen(true); };
  const handleEditClick = (user: User) => { setSelectedUser(user); setFormOpen(true); };
  const handleViewClick = (user: User) => { setSelectedUser(user); setViewOpen(true); };
  const handleDeleteClick = (user: User) => { setSelectedUser(user); setDeleteOpen(true); };

  const handleClose = () => {
    setFormOpen(false);
    setViewOpen(false);
    setDeleteOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
    }
    handleClose();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Gestion des Utilisateurs</Typography>
      <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField variant="outlined" size="small" placeholder="Rechercher..." InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
            <Button variant="contained" color="primary" onClick={handleAddClick}>Ajouter un utilisateur</Button>
          </Box>
          <TableContainer component={Paper} sx={{boxShadow: 'none'}}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead><TableRow><TableCell>Nom</TableCell><TableCell>Email</TableCell><TableCell>Rôle</TableCell><TableCell>Statut</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nom}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Chip label={user.role} color={roleColors[user.role] || 'default'} size="small" /></TableCell>
                    <TableCell><Chip label={user.status} color={user.status === 'Actif' ? 'success' : 'default'} size="small" variant="outlined" /></TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir"><IconButton size="small" onClick={() => handleViewClick(user)}><Visibility /></IconButton></Tooltip>
                      <Tooltip title="Modifier"><IconButton size="small" onClick={() => handleEditClick(user)}><Edit /></IconButton></Tooltip>
                      <Tooltip title="Supprimer"><IconButton size="small" onClick={() => handleDeleteClick(user)}><Delete /></IconButton></Tooltip>
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
        <DialogTitle>{selectedUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{mt: 1}}>
            <Grid item xs={12}><TextField defaultValue={selectedUser?.nom} autoFocus required margin="dense" id="nom" label="Nom complet" type="text" fullWidth variant="outlined" /></Grid>
            <Grid item xs={12}><TextField defaultValue={selectedUser?.email} required margin="dense" id="email" label="Email" type="email" fullWidth variant="outlined" /></Grid>
            <Grid item xs={12}><TextField margin="dense" id="password" label={selectedUser ? "Nouveau mot de passe (optionnel)" : "Mot de passe"} type="password" fullWidth variant="outlined" required={!selectedUser} /></Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required margin="dense">
                <InputLabel id="role-select-label">Rôle</InputLabel>
                <Select labelId="role-select-label" id="role" label="Rôle" defaultValue={selectedUser?.role || 'ETUDIANT'}>
                  {userRoles.map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions><Button onClick={handleClose}>Annuler</Button><Button onClick={handleClose} variant="contained">{selectedUser ? 'Enregistrer' : 'Ajouter'}</Button></DialogActions>
      </Dialog>

      {/* MODALE VOIR DÉTAILS */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Détails de l'utilisateur</DialogTitle>
        <DialogContent>
            {selectedUser && (
                <List>
                    <ListItem><ListItemText primary="ID" secondary={selectedUser.id} /></ListItem>
                    <ListItem><ListItemText primary="Nom" secondary={selectedUser.nom} /></ListItem>
                    <ListItem><ListItemText primary="Email" secondary={selectedUser.email} /></ListItem>
                    <ListItem><ListItemText primary="Rôle" secondary={<Chip label={selectedUser.role} color={roleColors[selectedUser.role] || 'default'} size="small" />} /></ListItem>
                    <ListItem><ListItemText primary="Statut" secondary={<Chip label={selectedUser.status} color={selectedUser.status === 'Actif' ? 'success' : 'default'} size="small" variant="outlined" />} /></ListItem>
                </List>
            )}
        </DialogContent>
        <DialogActions><Button onClick={handleClose} variant="contained">Fermer</Button></DialogActions>
      </Dialog>

      {/* MODALE CONFIRMATION SUPPRESSION */}
      <Dialog open={deleteOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent><Typography>Êtes-vous sûr de vouloir supprimer l'utilisateur "{selectedUser?.nom}" ?</Typography></DialogContent>
        <DialogActions><Button onClick={handleClose}>Annuler</Button><Button onClick={handleDeleteConfirm} variant="contained" color="error">Supprimer</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagementPage;
