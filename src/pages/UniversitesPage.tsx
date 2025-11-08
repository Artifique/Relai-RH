import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, TextField, InputAdornment, IconButton, Box, Avatar, CircularProgress, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import s1Image from '../assets/s1.jpg';
import { universityService } from '../services/universityService';
import { University } from '../models/university';
import { useAuth } from '../context/AuthContext';

const UniversitesPage: React.FC = () => {
  const { token } = useAuth();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      try {
        const data = await universityService.getAllUniversities(token as string);
        setUniversities(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des universités:", err);
        setError("Impossible de charger les universités. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, [token]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

    const filteredUniversities = universities.filter(university =>

      university.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||

      university.adresse?.toLowerCase().includes(searchTerm.toLowerCase()) ||

      university.emailContact?.toLowerCase().includes(searchTerm.toLowerCase())

    );

  

    if (loading) {

      return (

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>

          <CircularProgress />

          <Typography variant="h6" sx={{ ml: 2 }}>Chargement des universités...</Typography>

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

            {filteredUniversities.length > 0 ? (

              filteredUniversities.map((university) => (

                <Grid item xs={12} sm={6} md={4} key={university.id}>

                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, textAlign: 'center', transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 } }}>

                                      <Avatar

                                        src={university.imageUrl ? `http://localhost:8080/uploads/${university.imageUrl}` : 'https://placehold.co/150'} // Construct full URL

                                        alt={`${university.nom} logo`}

                                        sx={{ width: 80, height: 80, mb: 2 }}

                                      />

                    <CardContent sx={{ flexGrow: 1 }}>

                      <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>

                        {university.nom}

                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>

                        {university.adresse || 'N/A'}

                      </Typography>

                      <Typography variant="body1">

                        Contact: {university.emailContact || 'N/A'}

                      </Typography>

                    </CardContent>

                    <CardActions>

                      {/* Removed "Visiter le site" button as siteWeb property is not available */}

                    </CardActions>

                  </Card>

                </Grid>

              ))

            ) : (

              <Grid item xs={12}>

                <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>

                  Aucune université trouvée.

                </Typography>

              </Grid>

            )}

          </Grid>

        </Container>

      </Box>

    );

  };

  

  export default UniversitesPage;

  