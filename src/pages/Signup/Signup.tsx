import React, {
  useState,
  useEffect,
  createRef,
  ChangeEvent,
  MouseEvent,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import jwt_decode from 'jwt-decode';
import { Link } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';

import SeparatorLine from '../../components/SeparatorLine';
import SMSEmailField from '../../components/SMSEmailField';
import SMSPasswordField from '../../components/SMSPasswordField';
import CheckboxField from '../../components/CheckboxField';
import SMSButton from '../../components/SMSButton';
import Header from '../../components/Header';
import ErrorPopover from '../../components/ErrorPopover';

import { rulesPassword } from '../../utils/rulesPassword';

import styles from './Signup.module.scss';

import { authApi, SignUpRequest } from '../../services/auth';
import { useDispatch } from 'react-redux';

const Signup = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const ref = createRef<HTMLFormElement>();
  const [credentials, setCredentials] = useState<SignUpRequest>({
    email: '',
    password: '',
    passwordConfirm: '',
    // agree: false,
  });
  const [validAll, setValidAll] = useState({
    email: false,
    password: false,
    passwordConfirm: false,
    // agree: false,
  });

  const [errorMessage, setErrorMessage] = useState<string>();

  const isAllFieldsValid =
    Object.values(validAll).length > 0 &&
    !Object.values(validAll).includes(false);
  const [signUp, { isLoading: isSignUpLoading }] = authApi.useSignUpMutation();
  const [login, { isLoading: isLoginLoading, data: loginData }] =
    authApi.useLoginMutation();

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const requestBody = { ...credentials, provider: 'email' };
      await signUp(requestBody).unwrap();
      const auth = await login(requestBody).unwrap();
    } catch (err: any) {
      if (err) {
        setErrorMessage('A user with this email already exists.');
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [event.target.name]:
        event.target.name === 'agree'
          ? event.target.checked
          : event.target.value,
    });
  };

  useEffect(() => {
    // console.log(credentials);
    // console.log(isAllFieldsValid);
  }, [credentials]);

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

    try {
      const requestBody = { tokenId: res.credential, provider: 'google' };
      await signUp(requestBody).unwrap();
      const auth = await login(requestBody).unwrap();
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('Please enter the correct email/password.');
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
    //     }
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
    <div className={styles.signupPage}>
      <Header mode='back' color='#001689' />
      <div className={styles.signupMain}>
        <section className={styles.signupHeader}>
          <h4 className={styles.signupTitle}>Sign Up</h4>
        </section>
        <section className={styles.signupBody}>
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
            <SMSPasswordField
              placeholder='Re-enter your password'
              onChange={handleChange}
              onValidation={handleValidation}
              name='passwordConfirm'
              value={credentials.passwordConfirm}
              rules={rulesConfirm}
              required
            />
            {/* <CheckboxField
              onChange={handleChange}
              onValidation={handleValidation}
              name="agree"
              size="medium"
              required
            >
              I agree to the&nbsp;
              <Link
                className={styles.agreeToTermLink}
                onClick={() => {
                  console.log('Open Terms of Service');
                }}
              >
                Terms of Service
                <OpenInNew
                  sx={{
                    paddingBottom: '5px',
                    fontSize: '17px',
                    color: '#1976d2',
                  }}
                />
              </Link>
            </CheckboxField> */}
          </form>
          <div className={styles.submitButtonContainer}>
            {errorMessage && (
              <ErrorPopover errorMessage={errorMessage} id='submit-button' />
            )}
            <SMSButton
              variant='contained'
              disabled={
                !isAllFieldsValid
                // || !credentials?.['agree']
              }
              onClick={handleSubmit}
              className={styles.submitBtn}
            >
              Sign up
            </SMSButton>
          </div>
          <div className={styles.loginLinkContainer}>
            <p>Do you have an account?</p>
            <Link
              sx={{ textDecoration: 'none' }}
              onClick={() => navigate('/login')}
            >
              Log in 〉
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Signup;
