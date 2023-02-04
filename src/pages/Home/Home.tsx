import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Typography } from '@mui/material';

import SMSButton from '../../components/SMSButton';

import styles from './Home.module.scss';

const Home = () => {
  const navigate = useNavigate();

  const handleClickStartButton = () => {
    navigate('/landing');
  };

  return (
    <Box
      sx={{
        height: '100%',
        backgroundImage: `url(${'./images/fireplace-home.jpg'})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          padding: '30px 10px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'rgb(0, 0, 0, 0.5)',
          color: '#FFFFFF',
          position: 'absolute',
          top: '15%',
        }}
      >
        <Typography variant="h4" align="center" fontWeight="bold">
          Stuff a Stocking!
        </Typography>
        <Typography variant="subtitle1" align="center" fontWeight="bold">
          Decorate, stuff, and send your greetings
        </Typography>
      </Box>
      <SMSButton
        variant={'contained'}
        onClick={handleClickStartButton}
        className={styles.homeStartBtn}
        upperCase={true}
      >
        Get Started
      </SMSButton>
    </Box>
  );
};

export default Home;
