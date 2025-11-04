import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Grid, Paper, Link as MuiLink, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Stepper, Step, StepLabel, StepContent, Checkbox, FormGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import s1Image from '../assets/s1.jpg';

const InscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  // Step 1: Account Information
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');

  // Adhesion Form Data (for 'user' role)
  const [adhesionFormData, setAdhesionFormData] = useState({
    fullName: '',
    sex: '',
    dob: '',
    phone: '',
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

  const handleAdhesionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name in adhesionFormData.benefits) {
      setAdhesionFormData(prev => ({ ...prev, benefits: { ...prev.benefits, [name]: checked } }));
    } else {
      setAdhesionFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinalSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Combine all form data and send to backend
    const finalData = role === 'user' ? { name, email, password, role, adhesionFormData } : { name, email, password, role };
    console.log(finalData);
    alert('Inscription réussie !');
    navigate('/connexion');
  };

  const getSteps = () => {
    const steps = ['Informations de Compte'];
    if (role === 'user') {
      steps.push('Identité du Membre', 'Situation Professionnelle', 'Objectifs et Attentes', 'Engagement');
    }
    return steps;
  };

  const steps = getSteps();

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nom complet"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse e-mail"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmer le mot de passe"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Je suis un(e)</FormLabel>
              <RadioGroup row name="role" value={role} onChange={(e) => setRole(e.target.value)}>
                <FormControlLabel value="user" control={<Radio />} label="Étudiant / Demandeur d'emploi" />
                <FormControlLabel value="university" control={<Radio />} label="Représentant d'université" />
              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 1:
        if (role === 'user') {
          return (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12}><TextField name="fullName" label="Nom et Prénom" fullWidth onChange={handleAdhesionChange} value={adhesionFormData.fullName} /></Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Sexe</FormLabel>
                    <RadioGroup row name="sex" value={adhesionFormData.sex} onChange={handleAdhesionChange}>
                      <FormControlLabel value="M" control={<Radio />} label="M" />
                      <FormControlLabel value="F" control={<Radio />} label="F" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}><TextField name="dob" label="Date et lieu de naissance" fullWidth onChange={handleAdhesionChange} value={adhesionFormData.dob} /></Grid>
                <Grid item xs={12}><TextField name="phone" label="Téléphone" fullWidth onChange={handleAdhesionChange} value={adhesionFormData.phone} /></Grid>
                <Grid item xs={12}><TextField name="address" label="Adresse actuelle" fullWidth onChange={handleAdhesionChange} value={adhesionFormData.address} /></Grid>
                <Grid item xs={12}><TextField name="region" label="Région / Commune" fullWidth onChange={handleAdhesionChange} value={adhesionFormData.region} /></Grid>
              </Grid>
            </Box>
          );
        } else {
          // University specific fields if any, for now just move to next step
          return <Typography>Informations spécifiques à l'université (à venir)</Typography>;
        }
      case 2:
        return (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Statut actuel</FormLabel>
                  <RadioGroup name="status" value={adhesionFormData.status} onChange={handleAdhesionChange}>
                    <FormControlLabel value="student" control={<Radio />} label="Étudiant(e) en cours de formation" />
                    <FormControlLabel value="unemployed_graduate" control={<Radio />} label="Diplômé(e) sans emploi" />
                    <FormControlLabel value="job_seeker" control={<Radio />} label="Demandeur(se) d’emploi" />
                    <FormControlLabel value="reconversion" control={<Radio />} label="Jeune en reconversion" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}><TextField name="university" label="Université / Institut / École" fullWidth onChange={handleAdhesionChange} value={adhesionFormData.university} /></Grid>
              <Grid item xs={12}><TextField name="department" label="Faculté / Département" fullWidth onChange={handleAdhesionChange} value={adhesionFormData.department} /></Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Niveau d’études</FormLabel>
                  <RadioGroup row name="educationLevel" value={adhesionFormData.educationLevel} onChange={handleAdhesionChange}>
                    <FormControlLabel value="licence" control={<Radio />} label="Licence" />
                    <FormControlLabel value="master" control={<Radio />} label="Master" />
                    <FormControlLabel value="doctorat" control={<Radio />} label="Doctorat" />
                    <FormControlLabel value="autre" control={<Radio />} label="Autre" />
                  </RadioGroup>
                </FormControl>
                {adhesionFormData.educationLevel === 'autre' && <TextField name="otherEducationLevel" label="Précisez" fullWidth onChange={handleAdhesionChange} value={adhesionFormData.otherEducationLevel} sx={{ mt: 1 }}/>}
              </Grid>
              <Grid item xs={12}><TextField name="fieldOfStudy" label="Domaine de formation" fullWidth onChange={handleAdhesionChange} value={adhesionFormData.fieldOfStudy} /></Grid>
              <Grid item xs={12}><TextField name="graduationYear" label="Année d’obtention du diplôme" fullWidth onChange={handleAdhesionChange} value={adhesionFormData.graduationYear} /></Grid>
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField name="targetSector" label="Secteur professionnel visé" fullWidth onChange={handleAdhesionChange} value={adhesionFormData.targetSector} /></Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Type d’emploi recherché</FormLabel>
                  <RadioGroup row name="jobType" value={adhesionFormData.jobType} onChange={handleAdhesionChange}>
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
                    <FormControlLabel control={<Checkbox checked={adhesionFormData.benefits.orientation} onChange={handleAdhesionChange} name="orientation" />} label="Orientation professionnelle" />
                    <FormControlLabel control={<Checkbox checked={adhesionFormData.benefits.training} onChange={handleAdhesionChange} name="training" />} label="Formation en employabilité / soft skills" />
                    <FormControlLabel control={<Checkbox checked={adhesionFormData.benefits.jobSearchSupport} onChange={handleAdhesionChange} name="jobSearchSupport" />} label="Accompagnement à la recherche d’emploi" />
                    <FormControlLabel control={<Checkbox checked={adhesionFormData.benefits.networking} onChange={handleAdhesionChange} name="networking" />} label="Mise en relation avec les entreprises" />
                    <FormControlLabel control={<Checkbox checked={adhesionFormData.benefits.internship} onChange={handleAdhesionChange} name="internship" />} label="Stage professionnel" />
                    <FormControlLabel control={<Checkbox checked={adhesionFormData.benefits.entrepreneurshipSupport} onChange={handleAdhesionChange} name="entrepreneurshipSupport" />} label="Accompagnement à l’entrepreneuriat" />
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );
      case 4:
        return (
          <Box>
            <Typography variant="body1">Je m’engage à :</Typography>
            <ul>
              <li><Typography variant="body2">Participer activement aux activités du Réseau Relais RH ;</Typography></li>
              <li><Typography variant="body2">Respecter les valeurs de solidarité, inclusion et professionnalisme ;</Typography></li>
              <li><Typography variant="body2">Fournir des informations exactes sur ma situation académique et professionnelle.</Typography></li>
            </ul>
            <Typography variant="body2" sx={{ mt: 2 }}>Signature du membre : ____________________</Typography>
            <Typography variant="body2">Date d’adhésion : ____ / ____ / ______</Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={12}
        sm={6}
        md={6}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 600,
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
            Créer un compte
          </Typography>
          <Typography component="p" variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Rejoignez notre communauté dès aujourd'hui.
          </Typography>

          <Stepper activeStep={activeStep} orientation="vertical" sx={{ width: '100%' }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {getStepContent(index)}
                  <Box sx={{ mb: 2 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Terminer' : 'Suivant'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Retour
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>Toutes les étapes sont complétées - vous avez terminé !</Typography>
              <Button onClick={handleFinalSubmit} sx={{ mt: 1, mr: 1 }}>
                Soumettre l'inscription
              </Button>
            </Paper>
          )}

          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Grid item>
              <MuiLink href="/connexion" variant="body2">
                {"Déjà un compte ? Se connecter"}
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid
        item
        xs={false}
        sm={6}
        md={6}
        sx={{
          backgroundImage: `url(${s1Image})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </Grid>
  );
};

export default InscriptionPage;
