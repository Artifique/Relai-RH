import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, TextField, InputAdornment, IconButton, Box, CircularProgress, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import s4Image from '../assets/s4.jpg';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import { bourseService } from '../services/bourseService';
import { BourseEmployabilite } from '../models/bourse';
import { useAuth } from '../context/AuthContext';

const BoursesPage: React.FC = () => {
  const { token } = useAuth();
  const [bourses, setBourses] = useState<BourseEmployabilite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBourses = async () => {
      setLoading(true);
      try {
        const data = await bourseService.getAllBourses(token as string);
        setBourses(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des bourses:", err);
        setError("Impossible de charger les bourses. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    fetchBourses();
  }, [token]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredBourses = bourses.filter(bourse =>
    bourse.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bourse.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bourse.criteresEligibilite?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Chargement des bourses...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          height: '40vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${s4Image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(40%)',
            zIndex: -1,
          },
        }}
      >
        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold' }}>
          Bourses d'Employabilité au Mali
        </Typography>
      </Box>
      <Container sx={{ py: 8 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <TextField
            label="Rechercher une bourse"
            variant="outlined"
            size="small"
            sx={{ width: '50%' }}
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Grid container spacing={4}>
          {filteredBourses.length > 0 ? (
            filteredBourses.map((bourse) => (
              <Grid item xs={12} sm={6} md={4} key={bourse.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 } }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {bourse.titre}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {bourse.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MonetizationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">Montant: Non spécifié</Typography> {/* BourseEmployabilite doesn't have an amount field */}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">Date limite: {bourse.dateLimiteCandidature ? new Date(bourse.dateLimiteCandidature).toLocaleDateString() : 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">Éligibilité: {bourse.criteresEligibilite || 'Non spécifié'}</Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button size="small" onClick={() => console.log('Postuler pour la bourse:', bourse.id)}>Postuler</Button>
                    <Button size="small" onClick={() => console.log('Voir les détails de la bourse:', bourse.id)}>Voir les détails</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
                Aucune bourse trouvée.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default BoursesPage;