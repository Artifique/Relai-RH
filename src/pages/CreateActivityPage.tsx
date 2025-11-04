import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Grid, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle activity creation logic here
    console.log({ title, description, date, location, image });
    alert('Activité créée avec succès !');
    navigate('/activites');
  };

  return (
    <Container sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Créer une nouvelle activité
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Titre de l'activité"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date de l'activité"
                type="date"
                fullWidth
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Lieu de l'activité"
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
              >
                Télécharger une image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {image && <Typography sx={{ ml: 2, display: 'inline' }}>{image.name}</Typography>}
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" sx={{ mr: 1 }} onClick={() => navigate('/activites')}>
              Annuler
            </Button>
            <Button type="submit" variant="contained">
              Créer l'activité
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateActivityPage;
