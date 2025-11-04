import React from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import relaiImage from '../assets/relai.jpg';
import { Link } from 'react-router-dom';
import Slider from 'react-slick'; // Import Slider
import 'slick-carousel/slick/slick.css'; // Import slick-carousel CSS
import 'slick-carousel/slick/slick-theme.css'; // Import slick-carousel theme CSS

const SliderItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '60vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  color: 'white',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${relaiImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(50%)', // Darken the image
    zIndex: -1,
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  textAlign: 'center',
}));

const HomePage: React.FC = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'linear',
  };

  return (
    <Box>
      <Slider {...sliderSettings}>
        <SliderItem>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Relais RH : Fédérons pour l'emploi
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4 }}>
            Votre plateforme de connexion pour l'employabilité des jeunes.
          </Typography>
          <Button variant="contained" color="primary" size="large" component={Link} to="/services/lcm">
            Découvrez nos services
          </Button>
        </SliderItem>
        <SliderItem>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Développez vos compétences
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4 }}>
            Accédez à des formations et des outils pour booster votre carrière.
          </Typography>
          <Button variant="contained" color="primary" size="large" component={Link} to="/activites">
            Voir les activités
          </Button>
        </SliderItem>
        <SliderItem>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Trouvez votre opportunité
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4 }}>
            Explorez les bourses d'employabilité et les offres d'emploi.
          </Typography>
          <Button variant="contained" color="primary" size="large" component={Link} to="/bourses">
            Découvrir les bourses
          </Button>
        </SliderItem>
      </Slider>

      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          Nos Services Principaux
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard>
              <WorkIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                Laboratoire des Compétences Métiers
              </Typography>
              <Typography variant="body1">
                Des outils et des ressources pour développer vos compétences professionnelles.
              </Typography>
              <Button size="small" component={Link} to="/services/lcm" sx={{ mt: 2 }}>Voir les détails</Button>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard>
              <SchoolIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                Prévoyance Socioprofessionnelle
              </Typography>
              <Typography variant="body1">
                Accès à des dispositifs d'aide à l'emploi et à des bourses.
              </Typography>
              <Button size="small" component={Link} to="/services/psp" sx={{ mt: 2 }}>Voir les détails</Button>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard>
              <BusinessIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                Réseau Universitaire "Relais RH"
              </Typography>
              <Typography variant="body1">
                Mise en relation avec les universités et les entreprises partenaires.
              </Typography>
              <Button size="small" component={Link} to="/services/reseau-universitaire" sx={{ mt: 2 }}>Voir les détails</Button>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;