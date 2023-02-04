import React, { ChangeEvent } from 'react';

import styles from './SMSNicknameField.module.scss';

interface SMSNicknameFieldProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  valid?: boolean;
  className?: string;
}

const SMSNicknameField: React.FC<SMSNicknameFieldProps> = ({
  onChange,
  value,
  valid = true,
  className,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);
  };

  return (
    <div className={`${styles.nicknameContainer} ${className}`}>
      <label
        className={`${styles.nicknameLabel} ${!valid ? styles.error : ''}`}
        htmlFor="nickname"
      >
        Nickname
      </label>
      <input
        className={`${styles.nicknameInputField} ${!valid ? styles.error : ''}`}
        type="text"
        id="nickname"
        placeholder="Maximum 10 characters"
        onChange={handleChange}
        maxLength={10}
        value={value}
        required
      />
    </div>
  );
};

export default SMSNicknameField;
