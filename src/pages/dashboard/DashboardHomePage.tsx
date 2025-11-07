import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { People, School, Assignment, MonetizationOn } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- Données Factices pour les Graphiques ---

// Graphique Linéaire: Inscriptions des 7 derniers jours
const userActivityData = [
  { date: '01/11', utilisateurs: 4 },
  { date: '02/11', utilisateurs: 7 },
  { date: '03/11', utilisateurs: 5 },
  { date: '04/11', utilisateurs: 12 },
  { date: '05/11', utilisateurs: 9 },
  { date: '06/11', utilisateurs: 15 },
  { date: 'Auj.', utilisateurs: 11 },
];

// Graphique Circulaire: Répartition des rôles
const roleData = [
  { name: 'Étudiants', value: 400 },
  { name: 'Diplômés', value: 300 },
  { name: 'Demandeurs d\'emploi', value: 250 },
  { name: 'Représentants', value: 50 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Données pour les cartes de statistiques
const stats = [
  { title: 'Utilisateurs Inscrits', value: '1,234', icon: <People fontSize="large" color="primary" /> },
  { title: 'Universités Partenaires', value: '25', icon: <School fontSize="large" color="secondary" /> },
  { title: 'Tests d\'Employabilité', value: '58', icon: <Assignment fontSize="large" color="success" /> },
  { title: 'Candidatures aux Bourses', value: '345', icon: <MonetizationOn fontSize="large" color="warning" /> },
];

const DashboardHomePage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Bienvenue sur votre tableau de bord
      </Typography>
      <Grid container spacing={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
              <Box sx={{ mr: 2 }}>{stat.icon}</Box>
              <Box><Typography variant="h5">{stat.value}</Typography><Typography color="text.secondary">{stat.title}</Typography></Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} lg={8}>
            <Card sx={{ p: 2, borderRadius: '16px', height: '400px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{height: '100%'}}>
                    <Typography variant="h6" mb={2}>Activité des Utilisateurs (7 derniers jours)</Typography>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={userActivityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="utilisateurs" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
            <Card sx={{ p: 2, borderRadius: '16px', height: '400px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{height: '100%'}}>
                    <Typography variant="h6" mb={2}>Répartition des Rôles</Typography>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie data={roleData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {roleData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHomePage;
