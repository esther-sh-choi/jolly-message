import React from 'react';

import styles from './ErrorPopover.module.scss';

interface ErrorPopoverProps {
  className?: string;
  errorMessage?: string;
  id?: string;
}

const ErrorPopover: React.FC<ErrorPopoverProps> = ({
  className,
  errorMessage,
  id,
}) => {
  return (
    <div id={id} className={`${className} ${styles.ErrorPopover}`}>
      {errorMessage}
    </div>
  );
};

export default ErrorPopover;
