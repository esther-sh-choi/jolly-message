import React from 'react';
import { useNavigate } from 'react-router-dom';

import SMSButton from '../../components/SMSButton';

import styles from './Landing.module.scss';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.landingPage}>
      <div className={styles.landingTop}>
        <div className={styles.landingTitle}>
          <h1 className={styles.stuff}>Stuff</h1>
          <div className={styles.secondLine}>
            <h1 className={styles.my}>My</h1>
            <img
              className={styles.blueStocking}
              src="images/blue-stocking.svg"
              alt="small blue stocking"
            />
          </div>
          <h1 className={styles.stocking}>Stocking</h1>
        </div>
        <img
          className={styles.fireplaceImage}
          src={'/images/fireplace.svg'}
          alt="fireplace with hanging stockings"
        />
        <img
          className={styles.giftLarge}
          src={'/images/gift-large.svg'}
          alt="green giftbox"
        />
        <img
          className={styles.giftSmall}
          src={'/images/gift-small.svg'}
          alt="yellow giftbox"
        />
      </div>
      <div className={styles.landingBottom}>
        <SMSButton
          variant={'outlined'}
          onClick={() => {
            navigate('/login');
          }}
          className={styles.loginBtn}
        >
          Login
        </SMSButton>
        <SMSButton
          variant={'contained'}
          onClick={() => {
            navigate('/signup');
          }}
          className={styles.signupBtn}
        >
          Sign up
        </SMSButton>
      </div>
    </div>
  );
};

export default Landing;
