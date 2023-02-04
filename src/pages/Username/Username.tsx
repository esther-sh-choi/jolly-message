import React, { useState, ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import SMSButton from '../../components/SMSButton';
import SMSUsernameField from '../../components/SMSUsernameField';
import ErrorPopover from '../../components/ErrorPopover';

import { usersApi } from '../../services/users';
import { updateUser } from '../../stores/auth';
import { rulesUsername } from '../../utils/rulesUsername';

import styles from './Username.module.scss';

const Username = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState<string>('');
  const [valid, setValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [
    updateUsername,
    { isLoading, data: updatedUser, isError, isSuccess, error },
  ] = usersApi.useUpdateUsernameMutation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleValidation = (
    valid: boolean | ((prevState: boolean) => boolean),
  ) => {
    setValid(valid);
  };

  const handleSubmitUsername = async () => {
    try {
      const user = await updateUsername({ username }).unwrap();
      dispatch(updateUser(user));
      setErrorMessage('');
    } catch (err: any) {
      if (err.data.message === 'Conflict') {
        setErrorMessage('This username is already taken.');
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      navigate('/myfireplace');
    }
  }, [isSuccess]);

  return (
    <div className={styles.usernamePage}>
      <Header mode="logo" color="#001689" logoClickAllowed={false} />
      <div className={styles.usernameHeader}>
        <h4 className={styles.usernameTitle}>Username</h4>
      </div>
      <div className={styles.usernameBody}>
        <label className={styles.usernameLabel}>
          Enter your unique username
        </label>
        <SMSUsernameField
          onChange={handleChange}
          onValidation={handleValidation}
          name="username"
          value={username}
          rules={rulesUsername}
        ></SMSUsernameField>
        <div className={styles.submitButtonContainer}>
          {errorMessage && (
            <ErrorPopover
              className={styles.userNameErrorPopover}
              errorMessage={errorMessage}
              id="submit-button"
            />
          )}
          <SMSButton
            variant={'contained'}
            onClick={handleSubmitUsername}
            className={styles.usernameBtn}
            disabled={!valid}
          >
            Submit
          </SMSButton>
        </div>
      </div>
    </div>
  );
};

export default Username;
