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
import InscriptionPage from './pages/InscriptionPage';
import MotDePasseOubliePage from './pages/MotDePasseOubliePage';
import PostulerPage from './pages/PostulerPage';
import EditProfilePage from './pages/EditProfilePage';
import CreateActivityPage from './pages/CreateActivityPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHomePage from './pages/dashboard/DashboardHomePage';
import UserManagementPage from './pages/dashboard/UserManagementPage';
import UniversityManagementPage from './pages/dashboard/UniversityManagementPage';
import TestManagementPage from './pages/dashboard/TestManagementPage';
import BourseManagementPage from './pages/dashboard/BourseManagementPage';
import OffreManagementPage from './pages/dashboard/OffreManagementPage'; // Import OffreManagementPage
import ActiviteManagementPage from './pages/dashboard/ActiviteManagementPage'; // Import ActiviteManagementPage
import CandidatureManagementPage from './pages/dashboard/CandidatureManagementPage'; // Import CandidatureManagementPage
import RapportEtStatistiquePage from './pages/dashboard/RapportEtStatistiquePage'; // Import RapportEtStatistiquePage

import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/MainLayout'; // Import MainLayout
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import { UserRole } from './models/user'; // Import UserRole
import './App.css';
// import { useLocation } from 'react-router-dom'; // This import is no longer needed here

function App() {
  // const location = useLocation(); // This is no longer needed here
  // const hideFooter = location.pathname === '/inscription'; // This is no longer needed here

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="geometric-shape shape1" />
      <div className="geometric-shape shape2" />
      <div className="geometric-shape shape3" />
      <div className="geometric-shape shape4" />
      <div className="geometric-shape shape5" />
      <Router basename="/Relai-RH">
        <AuthProvider>
          <Routes>
              {/* Routes publiques avec le MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/activites" element={<ActivitesPage />} />
                <Route path="/bourses" element={<BoursesPage />} />
                <Route path="/universites" element={<UniversitesPage />} />
                <Route path="/connexion" element={<ConnexionPage />} />
                <Route path="/inscription" element={<InscriptionPage />} />
                <Route path="/mot-de-passe-oublie" element={<MotDePasseOubliePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />
                <Route path="/create-activity" element={<CreateActivityPage />} />
                <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
                <Route path="/emploi/:jobId" element={<PostulerPage />} />
              </Route>

              {/* Routes du tableau de bord avec le DashboardLayout et ProtectedRoute */}
              <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMINISTRATEUR]} />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardHomePage />} />
                  <Route path="users" element={<UserManagementPage />} />
                  <Route path="universities" element={<UniversityManagementPage />} />
                  <Route path="tests" element={<TestManagementPage />} />
                  <Route path="bourses" element={<BourseManagementPage />} />
                  <Route path="offres" element={<OffreManagementPage />} /> {/* Route for OffreManagementPage */}
                  <Route path="activities" element={<ActiviteManagementPage />} /> {/* Route for ActiviteManagementPage */}
                  <Route path="candidatures" element={<CandidatureManagementPage />} /> {/* Route for CandidatureManagementPage */}
                  <Route path="reports" element={<RapportEtStatistiquePage />} /> {/* Route for RapportEtStatistiquePage */}
                  {/* Ajoutez ici d'autres routes de dashboard au besoin */}
                </Route>
              </Route>
            </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
