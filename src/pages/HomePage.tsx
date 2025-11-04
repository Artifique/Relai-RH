import React from 'react';
import { Container, Typography, Button, Grid, Card, Box, CardContent, CardActions, Avatar, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import s1Image from '../assets/s1.jpg';
import s3Image from '../assets/s3.jpg';
import s4Image from '../assets/s4.jpg';
import { Link } from 'react-router-dom';
import Slider from 'react-slick'; // Import Slider
import 'slick-carousel/slick/slick.css'; // Import slick-carousel CSS
import 'slick-carousel/slick/slick-theme.css'; // Import slick-carousel theme CSS

const sliderContent = [
  {
    image: s1Image,
    title: 'Relais RH : Fédérons pour l\'emploi',
    description: 'Votre plateforme de connexion pour l\'employabilité des jeunes.',
    buttonText: 'Découvrez nos services',
    buttonLink: '/services/lcm',
  },
  {
    image: s3Image,
    title: 'Développez vos compétences',
    description: 'Accédez à des formations et des outils pour booster votre carrière.',
    buttonText: 'Voir les activités',
    buttonLink: '/activites',
  },
  {
    image: s4Image,
    title: 'Trouvez votre opportunité',
    description: 'Explorez les bourses d\'employabilité et les offres d\'emploi.',
    buttonText: 'Découvrir les bourses',
    buttonLink: '/bourses',
  },
];

const dummyJobs = [
  {
    id: 1,
    title: 'Développeur Frontend',
    company: 'Orange Mali',
    location: 'Bamako, Mali',
    logoUrl: 'https://picsum.photos/seed/orangemali/200',
    contractType: 'CDI',
  },
  {
    id: 2,
    title: 'Chef de Projet Digital',
    company: 'Malitel',
    location: 'Bamako, Mali',
    logoUrl: 'https://picsum.photos/seed/malitel/200',
    contractType: 'CDD',
  },
  {
    id: 3,
    title: 'Data Analyst',
    company: 'Banque de Développement du Mali (BDM)',
    location: 'Bamako, Mali',
    logoUrl: 'https://picsum.photos/seed/bdm/200',
    contractType: 'Stage',
  },
  {
    id: 4,
    title: 'UI/UX Designer',
    company: 'Jumia Mali',
    location: 'Bamako, Mali',
    logoUrl: 'https://picsum.photos/seed/jumiamali/200',
    contractType: 'CDI',
  },
  {
    id: 5,
    title: 'Développeur Backend',
    company: 'Société Malienne de Transports (SMT)',
    location: 'Bamako, Mali',
    logoUrl: 'https://picsum.photos/seed/smt/200',
    contractType: 'CDI',
  },
];

const SliderItem = styled(Box)<{ backgroundImage: string }>(({ theme, backgroundImage }) => ({
  position: 'relative',
  height: '60vh',
  [theme.breakpoints.down('sm')]: {
    height: '40vh',
  },
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
    backgroundImage: `url(${backgroundImage})`,
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
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.shadows[10],
  },
}));

const JobCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  padding: theme.spacing(2),
  height: '100%', // Ensure cards take full height
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[5],
  },
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

  const jobSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Box>
      <div className="geometric-shape shape6" />
      <div className="geometric-shape shape7" />
      <Slider {...sliderSettings}>
        {sliderContent.map((item, index) => (
          <SliderItem key={index} backgroundImage={item.image}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', sm: '3rem' } }}>
              {item.title}
            </Typography>
            <Typography variant="h5" component="p" sx={{ mb: 4, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {item.description}
            </Typography>
            <Button variant="contained" color="primary" size="large" component={Link} to={item.buttonLink}>
              {item.buttonText}
            </Button>
          </SliderItem>
        ))}
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

      <Box sx={{ bgcolor: '#f5f5f5', py: 8 }}>
        <Container>
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            Annonces d'Emploi Récentes
          </Typography>
          <Box sx={{ overflow: 'hidden' }}>
            <Slider {...jobSliderSettings}>
              {dummyJobs.map((job) => (
                <JobCard key={job.id}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={job.logoUrl} alt={`${job.company} logo`} sx={{ width: 50, height: 50, mr: 2 }} />
                      <Box>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                          {job.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {job.company}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {job.location}
                      </Typography>
                      <Chip label={job.contractType} color="primary" size="small" />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button size="small" component={Link} to={`/emploi/${job.id}`}>
                      Postuler
                    </Button>
                  </CardActions>
                </JobCard>
              ))}
            </Slider>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;


