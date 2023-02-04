import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Typography } from '@mui/material';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

import SMSModal from '../SMSModal';
import SMSButton from '../SMSButton';

interface LoginReminderProps {
  open: boolean;
}

const LoginReminder: React.FC<LoginReminderProps> = ({ open }) => {
  const navigate = useNavigate();

  return (
    <SMSModal
      open={open}
      closeButton={false}
      title="Warning"
      mainIcon={
        <WarningRoundedIcon
          sx={{
            fontSize: '50px',
            m: '5px',
            color: 'red',
          }}
        />
      }
    >
      <Typography sx={{ pb: '20px' }}>
        Log in to read, delete, and/or edit the stockings that you send before
        December 25th. Once you log in, you can get your very own virtual
        fireplace and receive stockings from others!
      </Typography>
      <Typography fontWeight="bold" sx={{ pb: '20px' }}>
        As a guest, you cannot gain access to the stockings that you send.
      </Typography>
      <SMSButton
        variant="contained"
        sx={{ mt: '10px', height: '48px' }}
        onClick={() => {
          navigate('/login');
        }}
      >
        Log in
      </SMSButton>
      <SMSButton
        variant="outlined"
        sx={{ mt: '10px' }}
        onClick={() => {
          navigate('/signup');
        }}
      >
        Sign up
      </SMSButton>
      <SMSButton
        variant="text"
        sx={{ mt: '10px', textDecoration: 'underline' }}
        onClick={() => {
          navigate('/message', { state: { guest: true } });
        }}
      >
        Continue as guest
      </SMSButton>
    </SMSModal>
  );
};

export default LoginReminder;
