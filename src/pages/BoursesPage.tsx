import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, TextField, InputAdornment, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import s4Image from '../assets/s4.jpg';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';

interface Scholarship {
  id: number;
  title: string;
  description: string;
  eligibility: string;
  amount: string;
  deadline: string;
}

const dummyScholarships: Scholarship[] = [
  {
    id: 1,
    title: "Bourse d'excellence Relais RH Mali",
    description: "Bourse destinée aux étudiants maliens brillants dans les domaines techniques.",
    eligibility: 'Étudiants en Master 1 ou 2 dans une université malienne, moyenne > 15/20',
    amount: '500 000 XOF',
    deadline: '30 novembre 2025',
  },
  {
    id: 2,
    title: 'Bourse de mobilité internationale (Mali)',
    description: "Soutien financier pour les étudiants maliens souhaitant effectuer un stage à l'étranger.",
    eligibility: "Tous étudiants maliens, projet de stage validé",
    amount: '300 000 XOF',
    deadline: '15 décembre 2025',
  },
  {
    id: 3,
    title: 'Bourse pour la formation professionnelle (Mali)',
    description: "Financement de formations certifiantes pour les demandeurs d'emploi au Mali.",
    eligibility: "Demandeurs d'emploi maliens inscrits à l'ANPE Mali",
    amount: '200 000 XOF',
    deadline: '31 décembre 2025',
  },
];

const BoursesPage: React.FC = () => {
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
          {dummyScholarships.map((scholarship) => (
            <Grid item xs={12} sm={6} md={4} key={scholarship.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 } }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {scholarship.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {scholarship.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MonetizationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">{scholarship.amount}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">Date limite: {scholarship.deadline}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">Éligibilité: {scholarship.eligibility}</Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button size="small">Postuler</Button>
                  <Button size="small">Voir les détails</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default BoursesPage;
