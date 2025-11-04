import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ActivitesPage from './pages/ActivitesPage';
import BoursesPage from './pages/BoursesPage';
import UniversitesPage from './pages/UniversitesPage';
import ConnexionPage from './pages/ConnexionPage';
import ProfilePage from './pages/ProfilePage';
import ServiceDetailPage from './pages/ServiceDetailPage'; // Import ServiceDetailPage
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer'; // Import Footer

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <NavBar /> {/* Render NavBar component */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/activites" element={<ActivitesPage />} />
            <Route path="/bourses" element={<BoursesPage />} />
            <Route path="/universites" element={<UniversitesPage />} />
            <Route path="/connexion" element={<ConnexionPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
          </Routes>
          <Footer /> {/* Render Footer component */}
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
