import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, TextField, InputAdornment, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

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
    title: "Bourse d'excellence Relais RH",
    description: "Bourse destinée aux étudiants brillants dans les domaines techniques.",
    eligibility: 'Étudiants en Master 1 ou 2, moyenne > 15/20',
    amount: '500 000 XOF',
    deadline: '30 novembre 2025',
  },
  {
    id: 2,
    title: 'Bourse de mobilité internationale',
    description: "Soutien financier pour les étudiants souhaitant effectuer un stage à l'étranger.",
    eligibility: "Tous étudiants, projet de stage validé",
    amount: '300 000 XOF',
    deadline: '15 décembre 2025',
  },
  {
    id: 3,
    title: 'Bourse pour la formation professionnelle',
    description: "Financement de formations certifiantes pour les demandeurs d'emploi.",
    eligibility: "Demandeurs d'emploi inscrits à l'ANPE",
    amount: '200 000 XOF',
    deadline: '31 décembre 2025',
  },
];

const BoursesPage: React.FC = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bourses d'Employabilité
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <TextField
          label="Rechercher une bourse"
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
        {dummyScholarships.map((scholarship) => (
          <Grid item xs={12} sm={6} md={4} key={scholarship.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {scholarship.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Montant: {scholarship.amount}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Date limite: {scholarship.deadline}
                </Typography>
                <Typography variant="body1">
                  {scholarship.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Éligibilité: {scholarship.eligibility}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Postuler</Button>
                <Button size="small">Voir les détails</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BoursesPage;
