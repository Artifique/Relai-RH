import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Grid, TextField, Button, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, FormControl, FormLabel } from '@mui/material';

const AdhesionPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    sex: '',
    dob: '',
    phone: '',
    email: '',
    address: '',
    region: '',
    status: '',
    university: '',
    department: '',
    educationLevel: '',
    otherEducationLevel: '',
    fieldOfStudy: '',
    graduationYear: '',
    targetSector: '',
    jobType: '',
    benefits: {
      orientation: false,
      training: false,
      jobSearchSupport: false,
      networking: false,
      internship: false,
      entrepreneurshipSupport: false,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name in formData.benefits) {
      setFormData(prev => ({ ...prev, benefits: { ...prev.benefits, [name]: checked } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission logic here
    alert('Merci pour votre adhésion !');
  };

  return (
    <Container sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Fiche d’Adhésion au Réseau Relais RH
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Section A: Identité */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>A. Identité du Membre</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField name="fullName" label="Nom et Prénom" fullWidth onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Sexe</FormLabel>
                <RadioGroup row name="sex" value={formData.sex} onChange={handleChange}>
                  <FormControlLabel value="M" control={<Radio />} label="M" />
                  <FormControlLabel value="F" control={<Radio />} label="F" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}><TextField name="dob" label="Date et lieu de naissance" fullWidth onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField name="phone" label="Téléphone" fullWidth onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField name="email" label="E-mail" type="email" fullWidth onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField name="address" label="Adresse actuelle" fullWidth onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField name="region" label="Région / Commune" fullWidth onChange={handleChange} /></Grid>
          </Grid>

          {/* Section B: Situation */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>B. Situation Universitaire ou Professionnelle</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Statut actuel</FormLabel>
                <RadioGroup name="status" value={formData.status} onChange={handleChange}>
                  <FormControlLabel value="student" control={<Radio />} label="Étudiant(e) en cours de formation" />
                  <FormControlLabel value="unemployed_graduate" control={<Radio />} label="Diplômé(e) sans emploi" />
                  <FormControlLabel value="job_seeker" control={<Radio />} label="Demandeur(se) d’emploi" />
                  <FormControlLabel value="reconversion" control={<Radio />} label="Jeune en reconversion" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}><TextField name="university" label="Université / Institut / École" fullWidth onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField name="department" label="Faculté / Département" fullWidth onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Niveau d’études</FormLabel>
                <RadioGroup row name="educationLevel" value={formData.educationLevel} onChange={handleChange}>
                  <FormControlLabel value="licence" control={<Radio />} label="Licence" />
                  <FormControlLabel value="master" control={<Radio />} label="Master" />
                  <FormControlLabel value="doctorat" control={<Radio />} label="Doctorat" />
                  <FormControlLabel value="autre" control={<Radio />} label="Autre" />
                </RadioGroup>
              </FormControl>
              {formData.educationLevel === 'autre' && <TextField name="otherEducationLevel" label="Précisez" fullWidth onChange={handleChange} sx={{ mt: 1 }}/>}
            </Grid>
            <Grid item xs={12} sm={6}><TextField name="fieldOfStudy" label="Domaine de formation" fullWidth onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField name="graduationYear" label="Année d’obtention du diplôme" fullWidth onChange={handleChange} /></Grid>
          </Grid>

          {/* Section C: Objectifs */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>C. Objectifs et Attentes</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField name="targetSector" label="Secteur professionnel visé" fullWidth onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Type d’emploi recherché</FormLabel>
                <RadioGroup row name="jobType" value={formData.jobType} onChange={handleChange}>
                  <FormControlLabel value="public" control={<Radio />} label="Public" />
                  <FormControlLabel value="private" control={<Radio />} label="Privé" />
                  <FormControlLabel value="ong" control={<Radio />} label="ONG" />
                  <FormControlLabel value="self_employed" control={<Radio />} label="Auto-emploi" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Souhaitez-vous bénéficier de :</FormLabel>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={formData.benefits.orientation} onChange={handleChange} name="orientation" />} label="Orientation professionnelle" />
                  <FormControlLabel control={<Checkbox checked={formData.benefits.training} onChange={handleChange} name="training" />} label="Formation en employabilité / soft skills" />
                  <FormControlLabel control={<Checkbox checked={formData.benefits.jobSearchSupport} onChange={handleChange} name="jobSearchSupport" />} label="Accompagnement à la recherche d’emploi" />
                  <FormControlLabel control={<Checkbox checked={formData.benefits.networking} onChange={handleChange} name="networking" />} label="Mise en relation avec les entreprises" />
                  <FormControlLabel control={<Checkbox checked={formData.benefits.internship} onChange={handleChange} name="internship" />} label="Stage professionnel" />
                  <FormControlLabel control={<Checkbox checked={formData.benefits.entrepreneurshipSupport} onChange={handleChange} name="entrepreneurshipSupport" />} label="Accompagnement à l’entrepreneuriat" />
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>

          {/* Section D: Engagement */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>D. Engagement du Membre</Typography>
          <Typography variant="body2">Je m’engage à :</Typography>
          <ul>
            <li><Typography variant="body2">Participer activement aux activités du Réseau Relais RH ;</Typography></li>
            <li><Typography variant="body2">Respecter les valeurs de solidarité, inclusion et professionnalisme ;</Typography></li>
            <li><Typography variant="body2">Fournir des informations exactes sur ma situation académique et professionnelle.</Typography></li>
          </ul>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button type="submit" variant="contained" size="large">Soumettre mon adhésion</Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AdhesionPage;
