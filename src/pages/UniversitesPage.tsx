import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, TextField, InputAdornment, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface University {
  id: number;
  name: string;
  description: string;
  location: string;
  contact: string;
}

const dummyUniversities: University[] = [
  {
    id: 1,
    name: 'Université Cheikh Anta Diop',
    description: 'La plus ancienne et la plus grande université du Sénégal.',
    location: 'Dakar, Sénégal',
    contact: 'contact@ucad.sn',
  },
  {
    id: 2,
    name: 'Université Gaston Berger',
    description: 'Située à Saint-Louis, elle est réputée pour ses formations techniques.',
    location: 'Saint-Louis, Sénégal',
    contact: 'contact@ugb.sn',
  },
  {
    id: 3,
    name: 'Université Virtuelle du Sénégal',
    description: 'Offre des formations à distance pour une flexibilité maximale.',
    location: 'En ligne',
    contact: 'contact@uvs.edu.sn',
  },
];

const UniversitesPage: React.FC = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Universités Partenaires
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <TextField
          label="Rechercher une université"
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
      </Box>

      <Grid container spacing={4}>
        {dummyUniversities.map((university) => (
          <Grid item xs={12} sm={6} md={4} key={university.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {university.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {university.location}
                </Typography>
                <Typography variant="body1">
                  {university.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Contact: {university.contact}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Voir le profil</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UniversitesPage;
