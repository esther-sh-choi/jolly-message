import React, {
  useState,
  useEffect,
  createRef,
  ChangeEvent,
  MouseEvent,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import jwt_decode from 'jwt-decode';
import { Link, useMediaQuery } from '@mui/material';

import SeparatorLine from '../../components/SeparatorLine';
import SMSEmailField from '../../components/SMSEmailField';
import SMSPasswordField from '../../components/SMSPasswordField';
import SMSButton from '../../components/SMSButton';
import Header from '../../components/Header';
import ErrorPopover from '../../components/ErrorPopover';

import { rulesPassword } from '../../utils/rulesPassword';

import styles from './Login.module.scss';

import { setAuth } from '../../stores/auth';
import { authApi, LoginRequest } from '../../services/auth';
import { useDispatch } from 'react-redux';

const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const ref = createRef<HTMLFormElement>();
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [validAll, setValidAll] = useState({
    email: false,
    password: false,
  });

  const [errorMessage, setErrorMessage] = useState<string>();

  const isAllFieldsValid =
    Object.values(validAll).length > 0 &&
    !Object.values(validAll).includes(false);

  const [login, { isLoading: isLoginLoading, data: loginData }] =
    authApi.useLoginMutation();

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const requestBody = { ...credentials, provider: 'email' };
      const auth = await login(requestBody).unwrap();
      dispatch(setAuth(auth));
      setErrorMessage('');
    } catch (err: any) {
      if (err) {
        setErrorMessage('Please enter the correct email/password.');
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
      [event.target.name]: event.target.value,
    });
  };

  const handleValidation = (valid: boolean, name: string | undefined = '') => {
    setValidAll({
      ...validAll,
      [name]: valid,
    });
  };

  const handleGoogleCallback = async (res: CredentialResponse) => {
    if (!res.clientId || !res.credential) {
      return;
    }
    const user: any = jwt_decode(res.credential);

    try {
      const requestBody = { tokenId: res.credential, provider: 'google' };
      const auth = await login(requestBody).unwrap();
      dispatch(setAuth(auth));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // const initGsi = () => {
    //   //@ts-ignore
    //   if (!window.google) {
    //     return;
    //   }
    //   //@ts-ignore
    //   window.google.accounts.id.initialize({
    //     client_id:
    //       '72276386968-n8s078bsb8ok5f22q9b44n56j4k42c8s.apps.googleusercontent.com',
    //     callback: handleGoogleCallback,
    //   });
    //   //@ts-ignore
    //   window.google.accounts.id.renderButton(
    //     document.getElementById('signInDiv')!,
    //     {
    //       theme: 'filled_blue',
    //       size: 'large',
    //       type: 'standard',
    //       width: ref.current?.clientWidth,
    //       text: 'continue_with',
    //     },
    //   );
    // };
    // const scriptElement = document.createElement('script');
    // scriptElement.src = 'https://accounts.google.com/gsi/client';
    // scriptElement.onload = initGsi;
    // scriptElement.async = true;
    // scriptElement.id = 'gsi';
    // document.querySelector('body')?.appendChild(scriptElement);
    // return () => {
    //   //@ts-ignore
    //   window.google?.accounts.id.cancel();
    //   document.querySelector('#gsi')?.remove();
    // };
  }, []);

  return (
    <div className={styles.loginPage}>
      <Header mode='back' color='#001689' />
      <div className={styles.loginMain}>
        <section className={styles.loginHeader}>
          <h4 className={styles.loginTitle}>Login</h4>
        </section>
        <section className={styles.loginBody}>
          {/* <div id="signInDiv" className={styles.googleBtn}></div>
          <SeparatorLine className={styles.separator}>
            <p className={styles.separatorLineCaption}>or continue with</p>
          </SeparatorLine> */}
          <form ref={ref} className={styles.form}>
            <SMSEmailField
              placeholder='Enter your email'
              onChange={handleChange}
              onValidation={handleValidation}
              name='email'
              value={credentials.email}
              helperText={'Invalid email address'}
              required
            />
            <SMSPasswordField
              placeholder='Enter your password'
              onChange={handleChange}
              onValidation={handleValidation}
              name='password'
              value={credentials.password}
              rules={rulesPassword}
              required
            />
            {/* <Link
              className={styles.forgotPasswordLink}
              onClick={() => navigate('/forgotpassword')}
            >
              Forgot password?
            </Link> */}
          </form>
          <div className={styles.submitButtonContainer}>
            {errorMessage && (
              <ErrorPopover errorMessage={errorMessage} id='submit-button' />
            )}
            <SMSButton
              variant='contained'
              disabled={!isAllFieldsValid}
              onClick={handleSubmit}
              className={styles.submitBtn}
              id='submit-button'
            >
              Login
            </SMSButton>
          </div>

          <div className={styles.signupLinkContainer}>
            <p>Don't have an account?</p>
            <Link
              sx={{ textDecoration: 'none' }}
              onClick={() => navigate('/signup')}
            >
              Sign up 〉
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
