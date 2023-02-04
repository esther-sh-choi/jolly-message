import React, { MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import StockingListItem from '../StockingListItem';

import styles from './StockingList.module.scss';

interface StockingListProps {
  onFavoriteClick?: any;
  onStockingListClick?: any;
  filteredStockings?: {
    message?: string | undefined;
    image?: string;
    unread?: boolean;
    id?: string;
    favorite?: boolean;
    userTo?: string;
    userFrom?: string;
    date?: string;
  }[];
  className?: string;
}

const StockingList: React.FC<StockingListProps> = ({
  className,
  onFavoriteClick,
  onStockingListClick,
  filteredStockings,
}) => {
  const location = useLocation();
  const currentURL = location.pathname;
  const navigate = useNavigate();

  // const deadline = new Date('December 25, 2022 00:00');
  const deadline = new Date('October 25, 2022 00:00');

  const handleFavoriteClick = (id: string) => {
    onFavoriteClick(id);
  };

  const handleStockingListClick = (
    e: MouseEvent<HTMLButtonElement>,
    id: string,
  ) => {
    onStockingListClick(id);
    if (currentURL === '/sent') {
      navigate(`${id}`);
    } else {
      if (new Date() > deadline) {
        navigate(`${id}`);
      } else {
        console.log('Wait until December 25');
      }
    }
  };

  return (
    <div className={`${styles.stockingListContainer} ${className}`}>
      {filteredStockings?.map((stocking) => (
        <StockingListItem
          className={styles.stockingListItem}
          id={stocking.id}
          key={stocking.id}
          image={stocking.image}
          unread={stocking.unread}
          // if on Search page, show the sender username (from), if My Stocking, show receiver username (to)
          username={
            currentURL === '/inbox' ? stocking.userFrom : stocking.userTo
          }
          favorite={stocking.favorite}
          onClick={handleStockingListClick}
          onFavoriteClick={handleFavoriteClick}
          date={stocking.date}
          displayInboxItem={currentURL === '/inbox'}
        >
          {stocking.message}
        </StockingListItem>
      ))}
    </div>
  );
};

export default StockingList;
