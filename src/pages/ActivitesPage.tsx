import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, TextField, InputAdornment, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
}

const dummyActivities: Activity[] = [
  {
    id: 1,
    title: 'Atelier de développement web',
    description: 'Apprenez les bases du développement web avec React et Node.js.',
    date: '15 novembre 2025',
    location: 'Université de Dakar',
    organizer: 'Département Informatique',
  },
  {
    id: 2,
    title: "Conférence sur l'entrepreneuriat",
    description: 'Découvrez les clés du succès entrepreneurial avec des experts.',
    date: '20 novembre 2025',
    location: 'Centre de Conférences',
    organizer: 'Chambre de Commerce',
  },
  {
    id: 3,
    title: "Forum de l'emploi",
    description: 'Rencontrez des entreprises qui recrutent et postulez directement.',
    date: '25 novembre 2025',
    location: 'Parc des Expositions',
    organizer: "Agence Nationale pour l'Emploi",
  },
  {
    id: 4,
    title: 'Séminaire sur la rédaction de CV',
    description: "Optimisez votre CV pour maximiser vos chances d'obtenir un entretien.",
    date: '01 décembre 2025',
    location: 'En ligne',
    organizer: 'Relais RH',
  },
];

const ActivitesPage: React.FC = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Activités
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <TextField
          label="Rechercher une activité"
          variant="outlined"
          size="small"
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
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          Créer une activité
        </Button>
      </Box>

      <Grid container spacing={4}>
        {dummyActivities.map((activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {activity.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {activity.date} - {activity.location}
                </Typography>
                <Typography variant="body1">
                  {activity.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Voir les détails</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ActivitesPage;
