import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface SuccessMessageDialogProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const SuccessMessageDialog: React.FC<SuccessMessageDialogProps> = ({ open, title, message, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessMessageDialog;
