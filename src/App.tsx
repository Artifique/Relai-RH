import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import HomePage from './pages/HomePage';
import ActivitesPage from './pages/ActivitesPage';
import BoursesPage from './pages/BoursesPage';
import UniversitesPage from './pages/UniversitesPage';
import ConnexionPage from './pages/ConnexionPage';
import ProfilePage from './pages/ProfilePage';
import ServiceDetailPage from './pages/ServiceDetailPage'; // Import ServiceDetailPage
import InscriptionPage from './pages/InscriptionPage';
import MotDePasseOubliePage from './pages/MotDePasseOubliePage';
import PostulerPage from './pages/PostulerPage';
import EditProfilePage from './pages/EditProfilePage';
import AdhesionPage from './pages/AdhesionPage';
import CreateActivityPage from './pages/CreateActivityPage';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="geometric-shape shape1" />
      <div className="geometric-shape shape2" />
      <div className="geometric-shape shape3" />
      <div className="geometric-shape shape4" />
      <div className="geometric-shape shape5" />
      <Router>
        <AuthProvider>
          <NavBar />
          <Box
            sx={{
              minHeight: 'calc(100vh - 64px - 100px)', // Adjust height based on AppBar and Footer height
              // Removed background gradient
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/activites" element={<ActivitesPage />} />
              <Route path="/bourses" element={<BoursesPage />} />
              <Route path="/universites" element={<UniversitesPage />} />
              <Route path="/connexion" element={<ConnexionPage />} />
              <Route path="/inscription" element={<InscriptionPage />} />
              <Route path="/mot-de-passe-oublie" element={<MotDePasseOubliePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="/adhesion" element={<AdhesionPage />} />
              <Route path="/create-activity" element={<CreateActivityPage />} />
              <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
              <Route path="/emploi/:jobId" element={<PostulerPage />} />
            </Routes>
          </Box>
          <Footer />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
