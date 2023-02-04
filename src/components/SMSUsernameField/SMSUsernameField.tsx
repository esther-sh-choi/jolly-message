import React, {
  useState,
  useEffect,
  ChangeEvent,
  ChangeEventHandler,
} from 'react';

import styles from './SMSUsernameField.module.scss';

interface SMSUsernameFieldProps {
  className?: string | undefined;
  placeholder?: string | undefined;
  name?: string | undefined;
  required?: boolean | undefined;
  value?: string | undefined;
  autoFocus?: boolean | undefined;
  rules: {
    rule: string;
    test: (value: string) => boolean;
  }[];
  onChange: ChangeEventHandler<HTMLInputElement>;
  onValidation: (valid: boolean) => void;
}

const SMSUsernameField: React.FC<SMSUsernameFieldProps> = ({
  className,
  placeholder,
  onChange,
  onValidation,
  name,
  required,
  value,
  autoFocus = false,
  rules,
}) => {
  const [valid, setValid] = useState(true);
  const [helperText, setHelperText] = useState('');

  const validateUsername = () => {
    rules.every((rule) => {
      if (value) {
        const valid = rule.test(value);
        setValid(valid);
        onValidation(valid);
        setHelperText(rule.rule);
        return valid;
      }
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    validateUsername();
  };

  useEffect(() => {
    if (!valid) {
      validateUsername();
    }
  }, [value]);

  return (
    <div className={styles.usernameContainer}>
      <input
        className={`${styles.usernameInputField} ${!valid ? styles.error : ''}`}
        type="text"
        id="username"
        onChange={handleChange}
        onBlur={validateUsername}
        value={value}
        autoFocus={autoFocus}
        name={name}
        required={required}
      />
      {!valid ? (
        <p className={styles.helperText}>{helperText}</p>
      ) : (
        <p className={styles.warningMessage}>
          *You will not be able to change your username once you submit.
        </p>
      )}
    </div>
  );
};

export default SMSUsernameField;
