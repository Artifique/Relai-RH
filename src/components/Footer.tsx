import React from 'react';
import { Box, Typography, Container, Grid, Link as MuiLink, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Relais RH
            </Typography>
            <Typography variant="body2">
              Votre partenaire pour l'employabilité et l'insertion professionnelle.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Liens Rapides
            </Typography>
            <MuiLink href="#" color="inherit" display="block" variant="body2">
              Accueil
            </MuiLink>
            <MuiLink href="#" color="inherit" display="block" variant="body2">
              Activités
            </MuiLink>
            <MuiLink href="#" color="inherit" display="block" variant="body2">
              Bourses
            </MuiLink>
            <MuiLink href="#" color="inherit" display="block" variant="body2">
              Universités
            </MuiLink>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Suivez-nous
            </Typography>
            <IconButton color="inherit" href="#" target="_blank">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" href="#" target="_blank">
              <TwitterIcon />
            </IconButton>
            <IconButton color="inherit" href="#" target="_blank">
              <LinkedInIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="inherit">
            © {new Date().getFullYear()} Relais RH. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
