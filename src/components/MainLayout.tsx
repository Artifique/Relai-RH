import React from 'react';
import { Box } from '@mui/material';
import { useLocation, Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const hideFooter = location.pathname === '/inscription';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Outlet />
      </Box>
      {!hideFooter && <Footer />}
    </Box>
  );
};

export default MainLayout;
