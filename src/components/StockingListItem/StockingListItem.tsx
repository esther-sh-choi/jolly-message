import React, { MouseEventHandler, MouseEvent } from 'react';

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { FavoriteRounded, FavoriteBorderRounded } from '@mui/icons-material';

import styles from './StockingListItem.module.scss';

interface StockingListItemProps {
  children?: string;
  favorite?: boolean;
  image?: string;
  username?: string;
  onFavoriteClick?: any;
  unread?: boolean;
  sx?: object;
  onClick?: any;
  id?: string;
  date?: string;
  displayInboxItem?: boolean;
  className?: string;
}

const StockingListItem: React.FC<StockingListItemProps> = ({
  children,
  id,
  favorite,
  image,
  date,
  username,
  className,
  onFavoriteClick,
  unread,
  onClick,
  displayInboxItem,
}) => {
  const handleFavoriteClick = (e: MouseEvent<HTMLButtonElement>) => {
    onFavoriteClick(e.currentTarget.id);
    console.log(e.currentTarget.id);
  };

  const handleStockingListClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick(e, e.currentTarget.id);
    console.log(e.currentTarget.id);
  };

  return (
    <div className={`${styles.listItemContainer} ${className}`}>
      <button
        className={styles.listItemButton}
        id={id}
        onClick={handleStockingListClick}
      >
        <div className={styles.stockingThumbnailContainer}>
          <img
            src={image}
            alt="stocking thumbnail"
            className={styles.stockingThumbnail}
          />
        </div>
        <div
          className={styles.message}
          style={{
            paddingRight: displayInboxItem ? '0' : '12px',
          }}
        >
          <h4 className={styles.previewUsername}>
            {username}
            {displayInboxItem && unread && (
              <div className={styles.unreadStar}>*</div>
            )}
          </h4>
          <div
            className={styles.previewMessage}
            style={{ WebkitLineClamp: displayInboxItem ? 2 : 1 }}
          >
            {children}
          </div>
          {!displayInboxItem && <div className={styles.date}>{date}</div>}
        </div>
      </button>
      {displayInboxItem && (
        <button
          className={styles.favoriteToggleButton}
          onClick={handleFavoriteClick}
          id={id}
        >
          {favorite ? (
            <img src={'/images/favorite-true.svg'} />
          ) : (
            <img src={'/images/favorite-false.svg'} />
          )}
        </button>
      )}
    </div>
  );
};

export default StockingListItem;
