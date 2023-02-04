import React from 'react';

import { MoreVert } from '@mui/icons-material';

import styles from './SpeedDial.module.scss';

const SpeedDial = ({ options, onOptionClick, openSpeedDial, onClick }) => {
  return (
    <div className={styles.speedDial}>
      <button
        className={`${styles.speedDialMainButton} ${styles.speedDialButton} ${
          openSpeedDial ? styles.open : ''
        }`}
        onClick={onClick}
      >
        <MoreVert sx={{ fontSize: '33px', fontWeight: 'bolder' }} />
      </button>
      <div className={styles.speedDialOptions}>
        {options.map((action) => (
          <button
            className={`${styles.speedDialOptionButton} ${
              styles.speedDialButton
            } ${openSpeedDial ? styles.open : ''}`}
            key={action.name}
            title={action.name}
            onClick={onOptionClick}
            id={action.id}
          >
            {action.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpeedDial;
