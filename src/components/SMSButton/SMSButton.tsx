import React, { useState, useEffect } from 'react';

import styles from './SMSButton.module.scss';

interface SMSButtonProps {
  className?: string | undefined;
  variant?: 'text' | 'outlined' | 'contained';
  disabled?: boolean | undefined;
  upperCase?: boolean | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  children:
    | string
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | undefined;
  sx?: any;
  style?: object;
  id?: string;
  badgeCount?: number;
  displayBadge?: boolean;
}

const SMSButton: React.FC<SMSButtonProps> = ({
  className,
  variant = 'text',
  disabled,
  upperCase,
  badgeCount,
  displayBadge = false,
  onClick,
  children,
  type,
  sx,
  id,
  style,
}) => {
  const [showBadge, setShowBadge] = useState(displayBadge);

  useEffect(() => {
    if (badgeCount === 0) {
      setShowBadge(false);
    }
  }, [badgeCount]);

  return (
    <div className={`${styles.buttonContainer} ${className}`} style={style}>
      <button
        className={`${styles.button} ${styles[variant ? variant : '']} ${
          styles[disabled ? 'disabled' : '']
        }`}
        disabled={disabled}
        onClick={onClick}
        id={id}
        type={type}
        style={{
          textTransform: `${upperCase ? 'uppercase' : 'none'}`,
          ...sx,
        }}
      >
        {children}
      </button>
      {showBadge && <div className={styles.badge}>{badgeCount}</div>}
    </div>
  );
};

export default SMSButton;
