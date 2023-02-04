import React, { ChangeEventHandler, ChangeEvent } from 'react';

import { Checkbox } from '@mui/material';

import styles from './CheckboxField.module.scss';

interface CheckboxFieldProps {
  variant?:
    | 'button'
    | 'caption'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'inherit'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'overline'
    | undefined;
  size?: 'small' | 'medium' | undefined;
  checked?: boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onValidation?: (valid: boolean, name: string | undefined) => void;
  name?: string | undefined;
  children:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  size,
  onChange,
  onValidation,
  children,
  required,
  name,
}) => {
  const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    if (onValidation) {
      onValidation(event.target.checked, name);
    }
  };

  return (
    <div className={styles.checkboxContainer}>
      <Checkbox
        name={name}
        sx={{ padding: '0' }}
        size={size}
        onChange={handleCheck}
        required={required}
      />
      <div className={styles.checkboxLabel}>{children}</div>
    </div>
  );
};

export default CheckboxField;
