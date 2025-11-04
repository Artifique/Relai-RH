import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme, ButtonProps } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { useAuth } from '../context/AuthContext';
import { styled } from '@mui/material/styles';

interface NavButtonProps extends ButtonProps {
  component?: React.ElementType;
  to?: string;
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)', // Very light, slightly transparent background
  color: theme.palette.primary.main, // Dark text for contrast
  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow
  borderBottom: `1px solid ${theme.palette.grey[200]}`, // Very subtle bottom border
  padding: theme.spacing(0.5, 0), // Slightly less padding
}));

const NavButton = styled(Button)<NavButtonProps>(({ theme }) => ({
  color: theme.palette.primary.main, // Dark color for buttons
  fontWeight: 'bold',
  textTransform: 'none',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.light, // Subtle background change on hover
    color: 'white', // White text on hover
  },
}));

const NavBar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false); // Close drawer on logout
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, color: muiTheme.palette.primary.main }}>
        Relais RH
      </Typography>
      <List>
        <ListItem component={Link} to="/" onClick={handleDrawerToggle}>
          <ListItemText primary="Accueil" sx={{ color: muiTheme.palette.primary.main }} />
        </ListItem>
        <ListItem component={Link} to="/activites" onClick={handleDrawerToggle}>
          <ListItemText primary="Activités" sx={{ color: muiTheme.palette.primary.main }} />
        </ListItem>
        <ListItem component={Link} to="/bourses" onClick={handleDrawerToggle}>
          <ListItemText primary="Bourses" sx={{ color: muiTheme.palette.primary.main }} />
        </ListItem>
        <ListItem component={Link} to="/universites" onClick={handleDrawerToggle}>
          <ListItemText primary="Universités" sx={{ color: muiTheme.palette.primary.main }} />
        </ListItem>
        {user ? (
          <>
            <ListItem component={Link} to="/profile" onClick={handleDrawerToggle}>
              <ListItemText primary="Profil" sx={{ color: muiTheme.palette.primary.main }} />
            </ListItem>
            <ListItem onClick={handleLogout}>
              <ListItemText primary="Déconnexion" sx={{ color: muiTheme.palette.primary.main }} />
            </ListItem>
          </>
        ) : (
          <ListItem component={Link} to="/connexion" onClick={handleDrawerToggle}>
            <ListItemText primary="Connexion" sx={{ color: muiTheme.palette.primary.main }} />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit" // This will now be primary.main
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <img src={logo} alt="Relais RH Logo" style={{ height: '40px', marginRight: '16px' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1, color: muiTheme.palette.primary.main }}>
            Relais RH
          </Typography>
          {!isMobile && (
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <NavButton component={Link} to="/">Accueil</NavButton>
              <NavButton component={Link} to="/activites">Activités</NavButton>
              <NavButton component={Link} to="/bourses">Bourses</NavButton>
              <NavButton component={Link} to="/universites">Universités</NavButton>
              {user ? (
                <>
                  <NavButton component={Link} to="/profile">Profil</NavButton>
                  <NavButton onClick={handleLogout}>Déconnexion</NavButton>
                </>
              ) : (
                <NavButton component={Link} to="/connexion">Connexion</NavButton>
              )}
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};

export default NavBar;
