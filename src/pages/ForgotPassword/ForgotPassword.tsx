import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Link } from '@mui/material';

import Header from '../../components/Header';
import SMSButton from '../../components/SMSButton';
import SMSEmailField from '../../components/SMSEmailField';

import styles from './ForgotPassword.module.scss';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [valid, setValid] = useState<boolean>(true);
  const [error, setError] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [emailSentNotice, setEmailSentNotice] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleValidation = (valid: boolean) => {
    setValid(valid);
  };

  const handleSubmit = () => {
    console.log('Submit Email!');
    setEmailSentNotice(true);
    //handle error here (server). If email doesn't exist in server, it will return error as true.
    if (error) {
      setValid(false);
      setErrorMessage('Please try again.');
    } else {
      //open modal
      setEmailSentNotice(true);
    }
  };

  return (
    <div className={styles.forgotPasswordPage}>
      <Header mode="back" color="#001689" />
      <div className={styles.forgotPasswordMain}>
        <section className={styles.forgotPasswordHeader}>
          {!emailSentNotice ? (
            <>
              <h4 className={styles.forgotPasswordTitle}>Forgot Password?</h4>
              <p className={styles.notice}>
                Please submit the email that is associated with your Timessages
                account.
              </p>
            </>
          ) : (
            <>
              <h4 className={styles.forgotPasswordTitle}>
                Email has been sent
              </h4>
              <p className={styles.notice}>
                Please check your inbox and click on the attached link to reset
                the password.
              </p>
            </>
          )}
        </section>
        <section className={styles.forgotPasswordBody}>
          {!emailSentNotice ? (
            <>
              <SMSEmailField
                placeholder="Enter your email"
                onChange={handleChange}
                onValidation={handleValidation}
                name="email"
                value={email}
                helperText={error ? errorMessage : 'Invalid email address'}
                required
              />
              <div className={styles.resendLinkContainer}>
                <p>Didn't receive the link?</p>
                <Link
                  className={styles.link}
                  onClick={() => console.log('send email again')}
                >
                  Resend
                </Link>
              </div>
              <SMSButton
                className={styles.submitBtn}
                variant="contained"
                onClick={handleSubmit}
                disabled={!valid}
              >
                Submit
              </SMSButton>
            </>
          ) : (
            <>
              <div className={styles.envelopeContainer}>
                <img
                  className={styles.envelopeImage}
                  src="/images/envelope.svg"
                  alt="illustration of an open envelope with a letter halfway out"
                />
                <div
                  className={styles.resendLinkContainer}
                  style={{ alignSelf: 'center' }}
                >
                  <p>Didn't receive the link?</p>
                  <Link
                    className={styles.link}
                    onClick={() => console.log('send email again')}
                  >
                    Resend
                  </Link>
                </div>
              </div>
              <SMSButton
                className={styles.loginBtn}
                variant="contained"
                onClick={() => navigate('/login')}
              >
                Login
              </SMSButton>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default ForgotPassword;
