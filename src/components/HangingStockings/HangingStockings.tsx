import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  ArrowBackIosNewRounded,
  ArrowForwardIosRounded,
} from '@mui/icons-material';

import StockingComponent from '../Stocking';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

import styles from './HangingStockings.module.scss';
import './SwiperArrow.scss';

import { Stocking } from '../../services/fireplaces';
import { currentUser } from '../../stores/auth';
import { useSelector } from 'react-redux';

interface HangingStockingsProps {
  className?: string;
  stockings: Stocking[];
  onOpenAlert?: any;
  onPageChange?: (page: number) => void;
  possibleToOpen?: boolean;
}

const HangingStockings: React.FC<HangingStockingsProps> = ({
  className,
  stockings,
  onOpenAlert,
  onPageChange = (page) => {},
  possibleToOpen,
}) => {
  const [chosenIndex, setChosenIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const swiperRef = useRef(null);
  const user = useSelector(currentUser);

  const stockingThumbnail = (stocking: Stocking, stockingIndex: number) => {
    return (
      <div className={styles.stockingThumbnailContainer} key={stocking.uid}>
        <div
          className={`${styles.stockingThumbnailContainer} ${
            stockingIndex === 2 || stockingIndex === 8
              ? styles.animatedStockingA
              : stockingIndex === 0 || stockingIndex === 9
              ? styles.animatedStockingB
              : stockingIndex === 3 || stockingIndex === 5
              ? styles.animatedStockingC
              : stockingIndex === 1 || stockingIndex === 7
              ? styles.animatedStockingD
              : ''
          }`}
        >
          <div
            id={stocking.uid}
            className={styles.stockingThumbnail}
            style={{
              transform:
                stockingIndex === 0 || stockingIndex === 5
                  ? 'scaleX(-1)'
                  : stockingIndex === 3 || stockingIndex === 7
                  ? 'translateY(-15px)'
                  : stockingIndex === 1 || stockingIndex === 6
                  ? 'scaleX(-1) rotate(20deg) translateY(-15px) scale(1.2)'
                  : '',
              WebkitTransform:
                stockingIndex === 0 || stockingIndex === 5
                  ? 'scaleX(-1)'
                  : stockingIndex === 6
                  ? 'scaleX(-1) rotate(20deg) scale(1.2)'
                  : stockingIndex === 3 || stockingIndex === 7
                  ? 'translateY(-20px)'
                  : stockingIndex === 1
                  ? 'scaleX(-1) rotate(20deg) translateY(-20px) scale(1.2)'
                  : '',
              cursor: location.pathname.includes('myfireplace')
                ? 'pointer'
                : 'auto',
            }}
            onClick={handleClickStocking}
          >
            <StockingComponent
              className={styles.stocking}
              stockingOptions={{
                colorSelected: stocking.color,
                patternSelected: stocking.pattern,
                itemsSelected: stocking.items,
              }}
              clickable
            />
          </div>
        </div>
        <p className={styles.stockingNickname}>
          {stocking.nickname.length < 6 ? (
            stocking.nickname
          ) : (
            <span>{stocking.nickname.substring(0, 5)}&#8230;</span>
          )}
        </p>
      </div>
    );
  };

  const stockingsList: Stocking[][] = [[]];

  let fireplaceStockingPage = 0;
  for (
    let stockingDataIndex = 0;
    stockingDataIndex < stockings.length;
    stockingDataIndex++
  ) {
    if (stockingDataIndex % 10 === 0 && stockingDataIndex > 0) {
      stockingsList.push([]);
      fireplaceStockingPage++;
    }

    stockingsList[fireplaceStockingPage].push(stockings[stockingDataIndex]);
  }

  const handleClickStocking = (event: any) => {
    if (location.pathname.includes('myfireplace')) {
      if (possibleToOpen) {
        navigate(`/myfireplace/stockings/${event.currentTarget.id}`);
      } else {
        onOpenAlert(true);
      }
    } else {
      onOpenAlert(true);
    }
  };

  const handleNavigation = (direction: number) => {
    if (direction > 0) {
      // @ts-ignore
      swiperRef.current.swiper.slideNext();
    } else {
      // @ts-ignore
      swiperRef.current.swiper.slidePrev();
    }
  };

  useEffect(() => {
    // @ts-ignore
    const currentPage = swiperRef.current.swiper.activeIndex + 1;
    onPageChange(currentPage);
  }, []);

  return (
    <div className={styles.swiperPage}>
      <Swiper
        className={styles.swiperContainer}
        ref={swiperRef}
        initialSlide={0}
        onSlideChange={(event) => {
          onPageChange(event.activeIndex + 1);
          setChosenIndex(event.activeIndex);
        }}
        pagination={{
          type: 'fraction',
        }}
        modules={[Pagination]}
      >
        {stockingsList.map((stockingPage, page) => (
          <SwiperSlide
            key={`FireplacePage${page}`}
            className={styles.swiperSlide}
          >
            <div className={styles.firstRow}>
              {stockingPage.map((stocking, stockingIndex) => {
                if (stockingIndex >= 0 && stockingIndex < 5) {
                  return stockingThumbnail(stocking, stockingIndex);
                }
              })}
            </div>
            <div className={styles.secondRow}>
              {stockingPage.map((stocking, stockingIndex) => {
                if (stockingIndex >= 5 && stockingIndex < 10) {
                  return stockingThumbnail(stocking, stockingIndex);
                }
              })}
            </div>
          </SwiperSlide>
        ))}
        {stockings.length > 10 && (
          <div className={styles.swiperNavigation}>
            <button className='' onClick={() => handleNavigation(-1)}>
              <ArrowBackIosNewRounded sx={{ fontSize: 16 }} />
            </button>
            <button className='' onClick={() => handleNavigation(1)}>
              <ArrowForwardIosRounded sx={{ fontSize: 16 }} />
            </button>
          </div>
        )}
      </Swiper>
    </div>
  );
};

export default HangingStockings;
