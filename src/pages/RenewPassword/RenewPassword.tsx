import React, { useState, ChangeEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Header from '../../components/Header';
import SMSButton from '../../components/SMSButton';
import SMSPasswordField from '../../components/SMSPasswordField';
import { authApi } from '../../services/auth';

import Loading from '../../components/Loading';

import { rulesPassword } from '../../utils/rulesPassword';

import styles from './RenewPassword.module.scss';
import SMSModal from '../../components/SMSModal';

interface RenewPasswordData {
  password?: string | undefined;
  confirmPassword?: string | undefined;
}

const RenewPassword = () => {
  const navigate = useNavigate();
  const [passwordRP, setPasswordRP] = useState<RenewPasswordData>({
    password: '',
    confirmPassword: '',
  });
  const [valid, setValid] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { tokenId } = useParams();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'password') {
      setPasswordRP({
        ...passwordRP,
        ...{ password: event.target.value },
      });
    } else {
      setPasswordRP({
        ...passwordRP,
        ...{ confirmPassword: event.target.value },
      });
    }
  };

  const handleValidation = (
    valid: boolean | ((prevState: boolean) => boolean)
  ) => {
    if (valid && passwordRP.password === passwordRP.confirmPassword)
      setValid(valid);
  };

  const handleSubmit = async () => {
    try {
      const response = await resetPassword({
        password: passwordRP.password,
        tokenId,
      });
      // alert('Your password has been changed');
      setOpenModal(true);
    } catch (err: any) {
      console.error(err);
      // alert('Something went wrong');
      setOpenModal(true);
    }
  };

  const rulesConfirm = [
    {
      rule: 'Passwords do not match.',
      test: () => {
        return passwordRP.password === passwordRP.confirmPassword;
      },
    },
  ];

  const [resetPassword, { isLoading, data, isError, isSuccess, error }] =
    authApi.useResetPasswordMutation();

  return (
    <>
      <div className={styles.renewPasswordPage}>
        <Header mode='logo' color='#001689' />
        <section className={styles.renewPasswordHeader}>
          <h4 className={styles.renewPasswordTitle}>Renew Password</h4>
        </section>
        <section className={styles.renewPasswordBody}>
          <SMSPasswordField
            placeholder='Enter your password'
            onChange={handleChange}
            onValidation={handleValidation}
            name='password'
            value={passwordRP.password}
            rules={rulesPassword}
            required
          />
          <SMSPasswordField
            placeholder='Re-enter your password'
            onChange={handleChange}
            onValidation={handleValidation}
            name='confirm-password'
            value={passwordRP.confirmPassword}
            rules={rulesConfirm}
            required
          />
          <SMSButton
            variant='contained'
            disabled={!valid}
            onClick={handleSubmit}
            className={styles.resetPasswordBtn}
          >
            Reset My Password
          </SMSButton>
        </section>
      </div>
      <SMSModal
        open={openModal}
        mainIcon={
          isSuccess ? (
            <img
              src={'/images/success-icon.svg'}
              alt='white checkmark in green circle'
            />
          ) : undefined
        }
        onClose={() => {
          setOpenModal(false);
        }}
        title={
          isSuccess ? 'Your password has been changed' : 'Something went wrong!'
        }
        replyButtons={
          <SMSButton
            variant='contained'
            onClick={() => {
              if (isSuccess) {
                navigate('/login');
              } else {
                setOpenModal(false);
              }
            }}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
            sx={{ height: '48px', width: '50%' }}
            upperCase
          >
            {isSuccess ? 'Login' : 'Close'}
          </SMSButton>
        }
      ></SMSModal>
      <Loading loading={isLoading} />
    </>
  );
};

export default RenewPassword;
