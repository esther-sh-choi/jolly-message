import React, { useState } from 'react';
import { Stocking } from '../../services/fireplaces';

import SMSButton from '../SMSButton';
import StockingComponent from '../Stocking/Stocking';

import styles from './StockingMessage.module.scss';

interface StockingMessageProps {
  className?: string;
  stocking: Stocking;
  mode: 'inbox' | 'sent' | 'myfireplace' | string;
  messageStyle?: object;
}

const StockingMessage: React.FC<StockingMessageProps> = ({
  className,
  mode,
  messageStyle,
  stocking,
}) => {
  const [showStocking, setShowStocking] = useState(
    !stocking.read && (mode === 'inbox' || mode === 'myfireplace')
  );

  const handleOpenMessage = () => {
    setShowStocking(false);
  };

  return (
    <div className={`${styles.openStockingBody} ${className}`}>
      {showStocking && (
        <div className={styles.displayStockingContainer}>
          <StockingComponent
            className={styles.stocking}
            stockingOptions={{
              colorSelected: stocking.color,
              patternSelected: stocking.pattern,
              itemsSelected: stocking.items,
            }}
          />
          <SMSButton
            className={styles.openButton}
            variant='contained'
            onClick={handleOpenMessage}
            // style={{ marginTop: 'auto' }}
          >
            Click to open
          </SMSButton>
        </div>
      )}
      {!showStocking && (
        <div className={styles.displayMessageContainer}>
          {stocking?.imageUrl && (
            <img
              src={stocking?.imageUrl}
              alt='photo attachment'
              className={styles.imageAttached}
            />
          )}
          <p className={styles.message} style={{ ...messageStyle }}>
            {stocking?.message}
          </p>

          <SMSButton
            className={styles.openButton}
            variant='contained'
            onClick={() => {
              setShowStocking(true);
            }}
          >
            Show Stocking
          </SMSButton>
        </div>
      )}
    </div>
  );
};

export default StockingMessage;
