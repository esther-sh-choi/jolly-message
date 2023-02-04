import React, {
  useState,
  useEffect,
  ChangeEvent,
  ChangeEventHandler,
} from 'react';

import styles from './SMSPasswordField.module.scss';

interface SMSPasswordFieldProps {
  placeholder?: string | undefined;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onValidation: (valid: boolean, name: string | undefined) => void;
  name?: string | undefined;
  required?: boolean | undefined;
  value?: string | undefined;
  rules: {
    rule: string;
    test: (value: string) => boolean;
  }[];
}

const SMSPasswordField: React.FC<SMSPasswordFieldProps> = ({
  placeholder,
  onChange,
  onValidation,
  name,
  required,
  value,
  rules,
}) => {
  const [valid, setValid] = useState(true);
  const [helperText, setHelperText] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const validatePassword = () => {
    rules.every((rule) => {
      if (value) {
        const valid = rule.test(value);
        setValid(valid);
        onValidation(valid, name);
        setHelperText(rule.rule);
        return valid;
      }
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    validatePassword();
  };

  useEffect(() => {
    if (!valid) {
      validatePassword();
    }
  }, [value]);

  return (
    <div className={styles.passwordContainer}>
      <label
        className={`${styles.passwordLabel} ${!valid ? styles.error : ''}`}
        htmlFor={name === 'password' ? 'password' : 'passwordConfirm'}
      >
        {name === 'password' ? 'Password' : 'Confirm Password'}
      </label>
      <div
        className={`${
          name === 'password'
            ? styles.passwordInputContainer
            : styles.confirmPasswordInputContainer
        }`}
      >
        <input
          className={`${styles.passwordInputField} ${
            !valid ? styles.error : ''
          }`}
          id={name === 'password' ? 'password' : 'passwordConfirm'}
          // placeholder=""
          onChange={handleChange}
          onBlur={validatePassword}
          value={value}
          name={name}
          required={required}
          type={showPassword ? 'text' : 'password'}
        />
        {value && !valid && <p className={styles.helperText}>{helperText}</p>}

        <button
          className={styles.eyeIconBtn}
          aria-label='toggle password visibility'
          onClick={handleClickShowPassword}
        >
          {showPassword ? (
            <img src='/images/hide-password.svg' alt='eye icon crossed out' />
          ) : (
            <img src='/images/show-password.svg' alt='eye icon' />
          )}
        </button>
      </div>
    </div>
  );
};

export default SMSPasswordField;
