import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, TextField, InputAdornment, IconButton, Box, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import s1Image from '../assets/s1.jpg';

interface University {
  id: number;
  name: string;
  description: string;
  location: string;
  contact: string;
  logoUrl: string;
}

const dummyUniversities: University[] = [
  {
    id: 1,
    name: 'Université des Sciences Juridiques et Politiques de Bamako (USJPB)',
    description: 'Une des principales universités du Mali, axée sur le droit et les sciences politiques.',
    location: 'Bamako, Mali',
    contact: 'contact@usjpb.edu.ml',
    logoUrl: 'https://picsum.photos/seed/usjpb/200',
  },
  {
    id: 2,
    name: 'Université des Sciences Sociales et de Gestion de Bamako (USSGB)',
    description: 'Spécialisée dans les sciences sociales, l\'économie et la gestion au Mali.',
    location: 'Bamako, Mali',
    contact: 'contact@ussgb.edu.ml',
    logoUrl: 'https://picsum.photos/seed/ussgb/200',
  },
  {
    id: 3,
    name: 'Université des Sciences, des Techniques et des Technologies de Bamako (USTTB)',
    description: 'Pôle d\'excellence pour les sciences, la technologie et la santé au Mali.',
    location: 'Bamako, Mali',
    contact: 'contact@usttb.edu.ml',
    logoUrl: 'https://picsum.photos/seed/usttb/200',
  },
  {
    id: 4,
    name: "École Nationale d'Ingénieurs Abderhamane Baba Touré (ENI-ABT)",
    description: 'La plus grande école d\'ingénieurs du Mali.',
    location: 'Bamako, Mali',
    contact: 'contact@eni-abt.edu.ml',
    logoUrl: 'https://picsum.photos/seed/eniabt/200',
  },
];

const UniversitesPage: React.FC = () => {
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
          Nos Universités Partenaires au Mali
        </Typography>
      </Box>
      <Container sx={{ py: 8 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <TextField
            label="Rechercher une université"
            variant="outlined"
            size="small"
            sx={{ width: '50%' }}
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
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, textAlign: 'center', transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 } }}>
                <Avatar
                  src={university.logoUrl}
                  alt={`${university.name} logo`}
                  sx={{ width: 80, height: 80, mb: 2 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {university.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {university.location}
                  </Typography>
                  <Typography variant="body1">
                    {university.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Visiter le site</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default UniversitesPage;
