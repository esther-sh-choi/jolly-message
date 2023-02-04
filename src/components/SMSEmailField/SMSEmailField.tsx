import React, {
  useState,
  useEffect,
  ChangeEvent,
  ChangeEventHandler,
} from 'react';

import styles from './SMSEmailField.module.scss';

interface SMSEmailFieldProps {
  placeholder?: string | undefined;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onValidation: (valid: boolean, name: string | undefined) => void;
  name?: string | undefined;
  required?: boolean | undefined;
  value?: string | undefined;
  autoFocus?: boolean | undefined;
  helperText?: string | undefined;
  pattern?: RegExp | undefined;
}

const SMSEmailField: React.FC<SMSEmailFieldProps> = ({
  placeholder,
  onChange,
  onValidation,
  name,
  required,
  value,
  autoFocus = false,
  helperText,
  pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
}) => {
  const [valid, setValid] = useState(true);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);
  };

  const validateEmail = () => {
    if (value && !pattern.test(value)) {
      setValid(false);
      onValidation(false, name);
    } else if (value && pattern.test(value)) {
      setValid(true);
      onValidation(true, name);
    }
  };

  useEffect(() => {
    if (!valid) {
      validateEmail();
    }
  }, [value]);

  return (
    <div className={styles.emailContainer}>
      <label
        className={`${styles.emailLabel} ${!valid ? styles.error : ''}`}
        htmlFor="email"
      >
        Email
      </label>
      <div className={styles.emailInputContainer}>
        <input
          className={`${styles.emailInputField} ${!valid ? styles.error : ''}`}
          type="text"
          id="email"
          onChange={handleChange}
          onBlur={validateEmail}
          value={value}
          autoFocus={autoFocus}
          name={name}
          required={required}
        />
        {value && !valid && <p className={styles.helperText}>{helperText}</p>}
      </div>
    </div>
  );
};

export default SMSEmailField;
