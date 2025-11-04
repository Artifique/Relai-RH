import { Container, Typography, Grid, Card, CardContent, CardActions, Button, TextField, InputAdornment, IconButton, Box, CardMedia } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import s3Image from '../assets/s3.jpg';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  imageUrl: string;
}

const dummyActivities: Activity[] = [
  {
    id: 1,
    title: 'Atelier de développement web',
    description: 'Apprenez les bases du développement web avec React et Node.js.',
    date: '15 novembre 2025',
    location: 'Bamako, Mali',
    organizer: 'Université des Sciences Sociales et de Gestion de Bamako',
    imageUrl: 'https://picsum.photos/seed/devmali/600/400',
  },
  {
    id: 2,
    title: "Conférence sur l'entrepreneuriat local",
    description: 'Découvrez les clés du succès entrepreneurial avec des experts maliens.',
    date: '20 novembre 2025',
    location: 'Centre International de Conférences de Bamako',
    organizer: 'Chambre de Commerce et d Industrie du Mali',
    imageUrl: 'https://picsum.photos/seed/entrepreneurmali/600/400',
  },
  {
    id: 3,
    title: "Forum de l'emploi des jeunes",
    description: 'Rencontrez des entreprises maliennes qui recrutent et postulez directement.',
    date: '25 novembre 2025',
    location: 'Palais de la Culture Amadou Hampaté Bah',
    organizer: "Agence Nationale Pour l'Emploi (ANPE) Mali",
    imageUrl: 'https://picsum.photos/seed/emploimali/600/400',
  },
  {
    id: 4,
    title: 'Séminaire sur la rédaction de CV et lettres de motivation',
    description: "Optimisez votre CV pour maximiser vos chances d'obtenir un entretien au Mali.",
    date: '01 décembre 2025',
    location: 'En ligne',
    organizer: 'Relais RH Mali',
    imageUrl: 'https://picsum.photos/seed/cvmali/600/400',
  },
];

const ActivitesPage: React.FC = () => {
  const { user } = useAuth();

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
            backgroundImage: `url(${s3Image})`,
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
          {user && user.role === 'university' && (
            <Button component={Link} to="/create-activity" variant="contained" color="primary" startIcon={<AddIcon />}>
              Créer une activité
            </Button>
          )}
        </Box>

        <Grid container spacing={4}>
          {dummyActivities.map((activity) => (
            <Grid item xs={12} sm={6} md={4} key={activity.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 } }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={activity.imageUrl}
                  alt={activity.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
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
    </Box>
  );
};

export default ActivitesPage;
