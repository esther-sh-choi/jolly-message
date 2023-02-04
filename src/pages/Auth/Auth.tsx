import React, {
  useState,
  useEffect,
  createRef,
  ChangeEvent,
  MouseEvent,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import jwt_decode from 'jwt-decode';
import {
  Box,
  Typography,
  FormLabel,
  Avatar,
  IconButton,
  Link,
} from '@mui/material';
import { LockRounded, OpenInNew } from '@mui/icons-material';

import SeparatorLine from '../../components/SeparatorLine';
import SMSEmailField from '../../components/SMSEmailField';
import SMSPasswordField from '../../components/SMSPasswordField';
import CheckboxField from '../../components/CheckboxField';
import SMSButton from '../../components/SMSButton';
import Header from '../../components/Header';

import { rulesPassword } from '../../utils/rulesPassword';

import styles from './Auth.module.scss';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../stores/auth';
import { authApi, SignUpRequest } from '../../services/auth';

const Auth = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const ref = createRef<HTMLFormElement>();
  const [credentials, setCredentials] = useState<SignUpRequest>({
    email: '',
    password: '',
    passwordConfirm: '',
    agree: false,
  });
  const [validAll, setValidAll] = useState({
    email: false,
    password: false,
    passwordConfirm: false,
    agree: false,
  });
  const isAllFieldsValid =
    Object.values(validAll).length > 0 &&
    !Object.values(validAll).includes(false);

  const isSignUpPage = location.pathname === '/signup';
  const [signUp, { isLoading: isSignUpLoading }] = authApi.useSignUpMutation();
  const [login, { isLoading: isLoginLoading, data: loginData }] =
    authApi.useLoginMutation();

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isSignUpPage) {
      try {
        const requestBody = { ...credentials, provider: 'email' };
        await signUp(requestBody).unwrap();
        const auth = await login(requestBody).unwrap();
      } catch (err) {
        console.log(err);
      }
    }
    // If the current page is for Login
    else {
      try {
        const requestBody = { ...credentials, provider: 'email' };
        const auth = await login(requestBody).unwrap();
        dispatch(setAuth(auth));
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (!loginData) {
      return;
    }
    const username = loginData?.user?.username;
    if (username === null) {
      navigate('/signup/username');
    } else {
      navigate('/myfireplace');
    }
  }, [loginData]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [event.target.name]:
        event.target.name === 'agree'
          ? event.target.checked
          : event.target.value,
    });
  };

  const handleValidation = (valid: boolean, name: string | undefined = '') => {
    setValidAll({
      ...validAll,
      [name]: valid,
    });
  };

  const rulesConfirm = [
    {
      rule: 'Passwords do not match.',
      test: () => {
        return credentials.password === credentials.passwordConfirm;
      },
    },
  ];

  const handleGoogleCallback = async (res: CredentialResponse) => {
    if (!res.clientId || !res.credential) {
      return;
    }
    const user: any = jwt_decode(res.credential);

    if (isSignUpPage) {
      try {
        const requestBody = { tokenId: res.credential, provider: 'google' };
        await signUp(requestBody).unwrap();
        const auth = await login(requestBody).unwrap();
      } catch (err) {
        console.log(err);
      }
    }
    // If the current page is for Login
    else {
      try {
        const requestBody = { tokenId: res.credential, provider: 'google' };
        const auth = await login(requestBody).unwrap();
        dispatch(setAuth(auth));
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const initGsi = () => {
      //@ts-ignore
      if (!window.google) {
        return;
      }
      //@ts-ignore
      window.google.accounts.id.initialize({
        client_id:
          '72276386968-n8s078bsb8ok5f22q9b44n56j4k42c8s.apps.googleusercontent.com',
        callback: handleGoogleCallback,
      });
      //@ts-ignore
      window.google.accounts.id.renderButton(
        document.getElementById('signInDiv')!,
        {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          width: ref.current?.clientWidth,
          text: 'continue_with',
        },
      );
    };

    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://accounts.google.com/gsi/client';
    scriptElement.onload = initGsi;
    scriptElement.async = true;
    scriptElement.id = 'gsi';
    document.querySelector('body')?.appendChild(scriptElement);

    return () => {
      //@ts-ignore
      window.google?.accounts.id.cancel();
      document.querySelector('#gsi')?.remove();
    };
  }, []);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header mode="back" />
      <Box className={styles.auth}>
        <Box
          sx={{
            alignSelf: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexShrink: '2',
            paddingBottom: '20px',
          }}
        >
          <Avatar
            alt="locked icon"
            className={styles.authAvatar}
            sx={{
              bgcolor: '#8f32a8',
              width: '50px',
              height: '50px',
            }}
          >
            <LockRounded />
          </Avatar>
          <Typography variant="h4" className={styles.authTitle}>
            {isSignUpPage ? 'Sign Up' : 'Log In'}
          </Typography>
          <Typography
            variant="caption"
            sx={{ lineHeight: '1rem', textAlign: 'center' }}
            gutterBottom
          >
            {isSignUpPage
              ? 'Get your own fireplace with Timessages'
              : 'Welcome back to Timessages'}
          </Typography>
        </Box>
        <div id="signInDiv" className={styles.googleBtn}></div>
        <SeparatorLine className={styles.separator}>or</SeparatorLine>
        <form ref={ref} className={styles.form}>
          <FormLabel sx={{ fontSize: '14px' }} required>
            Email
          </FormLabel>
          <SMSEmailField
            placeholder="Enter your email"
            onChange={handleChange}
            onValidation={handleValidation}
            name="email"
            value={credentials.email}
            helperText={'Invalid email address'}
            required
          />

          <FormLabel sx={{ fontSize: '14px' }} required>
            Password
          </FormLabel>
          <SMSPasswordField
            placeholder="Enter your password"
            onChange={handleChange}
            onValidation={handleValidation}
            name="password"
            value={credentials.password}
            rules={rulesPassword}
            required
          />
          {isSignUpPage && (
            <>
              <FormLabel sx={{ fontSize: '14px' }} required>
                Confirm Password
              </FormLabel>
              <SMSPasswordField
                placeholder="Re-enter your password"
                onChange={handleChange}
                onValidation={handleValidation}
                name="passwordConfirm"
                value={credentials.passwordConfirm}
                rules={rulesConfirm}
                required
              />
              <CheckboxField
                onChange={handleChange}
                onValidation={handleValidation}
                size="small"
                name="agree"
                required
              >
                <Typography sx={{ fontSize: '12px' }}>
                  I have read and agree to SMS's&nbsp;
                  <Link>Terms of Service</Link>
                  <IconButton
                    sx={{ padding: '0 0 10px 2px' }}
                    onClick={() => {
                      console.log('Open Terms of Service');
                    }}
                  >
                    <OpenInNew sx={{ fontSize: '15px' }} />
                  </IconButton>
                </Typography>
              </CheckboxField>
            </>
          )}
          <SMSButton
            variant="contained"
            disabled={
              isSignUpPage
                ? !isAllFieldsValid || !credentials?.['agree']
                : !isAllFieldsValid
            }
            onClick={handleSubmit}
            className={styles.submitBtn}
            upperCase
          >
            {isSignUpPage ? 'Sign up' : 'Log in'}
          </SMSButton>
        </form>
        {!isSignUpPage && (
          <Link
            variant="caption"
            sx={{ alignSelf: 'flex-end' }}
            onClick={() => navigate('/forgotpassword')}
          >
            Forgot password?
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default Auth;
