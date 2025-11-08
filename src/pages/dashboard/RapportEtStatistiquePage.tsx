import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress, Alert } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { offreEmploiService } from '../../services/offreEmploiService';
import { bourseService } from '../../services/bourseService';
import { candidatureService } from '../../services/candidatureService';
import { activityService } from '../../services/activityService';
import { UserRole } from '../../models/user';
import { CandidatureStatut } from '../../models/bourse';

interface UserStats {
  ADMINISTRATEUR: number;
  REPRESENTANT_UNIVERSITE: number;
  DEMANDEUR_EMPLOI: number;
  total: number;
}

interface CandidatureStatusStats {
  EN_ATTENTE: number;
  ACCEPTEE: number;
  REFUSEE: number;
  total: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF'];

const RapportEtStatistiquePage: React.FC = () => {
  const { token } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [offreCount, setOffreCount] = useState<number | null>(null);
  const [bourseCount, setBourseCount] = useState<number | null>(null);
  const [candidatureStats, setCandidatureStats] = useState<CandidatureStatusStats | null>(null);
  const [activityCount, setActivityCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setError("Authentification requise pour accéder aux statistiques.");
        setLoading(false);
        return;
      }

      try {
        // Fetch Users
        const users = await userService.getAllUsers(token);
        const adminCount = users.filter(u => u.role === UserRole.ADMINISTRATEUR).length;
        const representantCount = users.filter(u => u.role === UserRole.REPRESENTANT_UNIVERSITE).length;
        const demandeurEmploiCount = users.filter(u => u.role === UserRole.DEMANDEUR_EMPLOI).length;
        setUserStats({
          ADMINISTRATEUR: adminCount,
          REPRESENTANT_UNIVERSITE: representantCount,
          DEMANDEUR_EMPLOI: demandeurEmploiCount,
          total: users.length,
        });

        // Fetch Offres d'emploi
        const offres = await offreEmploiService.getAllOffresEmploi(token);
        setOffreCount(offres.length);

        // Fetch Bourses
        const bourses = await bourseService.getAllBourses(token);
        setBourseCount(bourses.length);

        // Fetch Candidatures
        const candidatures = await candidatureService.getAllCandidatures(token);
        const enAttenteCount = candidatures.filter(c => c.statut === CandidatureStatut.EN_ATTENTE).length;
        const accepteeCount = candidatures.filter(c => c.statut === CandidatureStatut.ACCEPTEE).length;
        const refuseeCount = candidatures.filter(c => c.statut === CandidatureStatut.REFUSEE).length;
        setCandidatureStats({
          EN_ATTENTE: enAttenteCount,
          ACCEPTEE: accepteeCount,
          REFUSEE: refuseeCount,
          total: candidatures.length,
        });

        // Fetch Activities
        const activities = await activityService.getAllActivities(token);
        setActivityCount(activities.length);

      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques:", err);
        setError("Impossible de charger les statistiques. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Chargement des statistiques...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const candidaturePieData = candidatureStats ? [
    { name: 'En Attente', value: candidatureStats.EN_ATTENTE },
    { name: 'Acceptées', value: candidatureStats.ACCEPTEE },
    { name: 'Refusées', value: candidatureStats.REFUSEE },
  ] : [];

  return (
    <Box>
      <Box sx={{ mb: 4, p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', bgcolor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Rapports et Statistiques
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* User Statistics */}
        {userStats && (
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Statistiques Utilisateurs</Typography>
                <Typography>Total Utilisateurs: {userStats.total}</Typography>
                <Typography>Administrateurs: {userStats.ADMINISTRATEUR}</Typography>
                <Typography>Représentants d'université: {userStats.REPRESENTANT_UNIVERSITE}</Typography>
                <Typography>Demandeurs d'emploi: {userStats.DEMANDEUR_EMPLOI}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Offre d'emploi Count */}
        {offreCount !== null && (
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Offres d'emploi</Typography>
                <Typography>Total Offres: {offreCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Bourse Count */}
        {bourseCount !== null && (
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Bourses d'Employabilité</Typography>
                <Typography>Total Bourses: {bourseCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Activity Count */}
        {activityCount !== null && (
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Activités</Typography>
                <Typography>Total Activités: {activityCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Candidature Status Pie Chart */}
        {candidatureStats && candidatureStats.total > 0 && (
          <Grid item xs={12} md={6} lg={8}>
            <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Statut des Candidatures</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={candidaturePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                    >
                      {candidaturePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default RapportEtStatistiquePage;