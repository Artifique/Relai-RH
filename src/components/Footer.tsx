import React from 'react';
import { Box, Typography, Container, Grid, Link as MuiLink, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import logo from '../assets/logo.jpg'; // Assuming you have the logo in assets

const Footer: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#004AAD', color: 'white', py: 6, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <img src={logo} alt="Relais RH Logo" style={{ height: '50px', marginBottom: '16px' }} />
            <Typography variant="body2">
              Votre partenaire pour l'employabilité et l'insertion professionnelle.
            </Typography>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Navigation
            </Typography>
            <MuiLink href="/" color="inherit" display="block" variant="body2" sx={{ mb: 1, '&:hover': { textDecoration: 'underline' } }}>
              Accueil
            </MuiLink>
            <MuiLink href="/activites" color="inherit" display="block" variant="body2" sx={{ mb: 1, '&:hover': { textDecoration: 'underline' } }}>
              Activités
            </MuiLink>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', visibility: 'hidden' }}>
              .
            </Typography>
            <MuiLink href="/bourses" color="inherit" display="block" variant="body2" sx={{ mb: 1, '&:hover': { textDecoration: 'underline' } }}>
              Bourses
            </MuiLink>
            <MuiLink href="/universites" color="inherit" display="block" variant="body2" sx={{ '&:hover': { textDecoration: 'underline' } }}>
              Universités
            </MuiLink>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact
            </Typography>
            <Typography variant="body2">
              Email: contact@relairh.com
            </Typography>
            <Typography variant="body2">
              Téléphone: +223 12 34 56 78
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Relais RH. Tous droits réservés.
          </Typography>
          <Box>
            <IconButton color="inherit" href="#" target="_blank">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" href="#" target="_blank">
              <TwitterIcon />
            </IconButton>
            <IconButton color="inherit" href="#" target="_blank">
              <LinkedInIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
