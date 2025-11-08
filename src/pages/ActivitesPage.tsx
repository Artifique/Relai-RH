import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../models/user';
import { Link } from 'react-router-dom';
import { Box, Typography, Container, TextField, InputAdornment, IconButton, Button, Grid, Card, CardMedia, CardContent, CardActions, CircularProgress, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import s1Image from '../assets/s1.jpg';
import { activityService } from '../services/activityService';
import { Activite } from '../models/activity'; // Corrected import name

const ActivitesPage: React.FC = () => {
  const { user, token } = useAuth();
  const [activities, setActivities] = useState<Activite[]>([]); // Corrected type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const data = await activityService.getAllActivities(token as string);
        setActivities(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des activités:", err);
        setError("Impossible de charger les activités. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [token]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredActivities = activities.filter(activity =>
    activity.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.lieu?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Chargement des activités...</Typography>
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
            backgroundImage: `url(${s1Image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(40%)',
            zIndex: -1,
          },
        }}
      >
        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold' }}>
          Nos Activités au Mali
        </Typography>
      </Box>
      <Container sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <TextField
            label="Rechercher une activité"
            variant="outlined"
            size="small"
            sx={{ width: '40%' }}
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
          {user && user.role === UserRole.REPRESENTANT_UNIVERSITE && (
            <Button component={Link} to="/create-activity" variant="contained" color="primary" startIcon={<AddIcon />}>
              Créer une activité
            </Button>
          )}
        </Box>

        <Grid container spacing={4}>
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <Grid item xs={12} sm={6} md={4} key={activity.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 } }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={activity.imageUrl ? `http://localhost:8080/uploads/${activity.imageUrl}` : 'https://placehold.co/600x400'} // Construct full URL
                    alt={activity.titre}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {activity.titre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {activity.date_activite ? new Date(activity.date_activite).toLocaleDateString() : 'N/A'} - {activity.lieu}
                    </Typography>
                    <Typography variant="body1">
                      {activity.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => console.log('Voir les détails de l\'activité:', activity.id)}>Voir les détails</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
                Aucune activité trouvée.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default ActivitesPage;