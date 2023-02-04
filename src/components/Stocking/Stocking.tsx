import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import StockingBase from './StockingBase';
import StockingStripe from './StockingStripe';
import StockingSnowflake from './StockingSnowflake';
import StockingDot from './StockingDot';
import StockingMoroccan from './StockingMoroccan';
import StockingPlaid from './StockingPlaid';
import StockingCrosshatch from './StockingCrosshatch';
import StockingHoundstooth from './StockingHoundstooth';
import StockingHeart from './StockingHeart';
import StockingZigzag from './StockingZigzag';

import styles from './stocking.module.scss';

interface StockingProps {
  stockingOptions: {
    colorSelected?: string;
    patternSelected?: string;
    itemsSelected?: string[];
  };
  className?: string;
  clickable?: boolean;
}

const itemOptions = [
  { id: 'bells', image: '/images/item-bell.svg' },
  { id: 'candycane', image: '/images/item-candycane.svg' },
  { id: 'gingerbread', image: '/images/item-gingerbread.svg' },
  { id: 'hearttag', image: '/images/item-hearttag.svg' },
  { id: 'mistletoe', image: '/images/item-mistletoe.svg' },
  { id: 'ornament', image: '/images/item-ornament.svg' },
  { id: 'snowman', image: '/images/item-snowman.svg' },
  { id: 'tree', image: '/images/item-tree.svg' },
];

const itemStyles = {
  oneItem: [
    {
      height: '35%',
      left: '25%',
      top: '10%',
    },
  ],
  twoItems: [
    { height: '30%', left: '8%', top: '10%' },
    {
      height: '30%',
      left: '50%',
      top: '20%',
    },
  ],
  threeItems: [
    {
      height: '27%',
      left: '5%',
      top: '10%',
    },
    { height: '27%', left: '30%', top: '16%' },
    { height: '27%', left: '52%', top: '22%' },
  ],
};

const Stocking: React.FC<StockingProps> = ({
  stockingOptions,
  className,
  clickable,
}) => {
  const stockingThumbnailList = [
    {
      name: 'solid',
      component: (
        <StockingBase
          className={styles.stockingMain}
          key="solid-pattern"
          color={stockingOptions.colorSelected}
        />
      ),
    },
    {
      name: 'snowflake',
      component: (
        <StockingSnowflake
          className={styles.stockingMain}
          key="snowflake-pattern"
          color={stockingOptions.colorSelected}
        />
      ),
    },
    {
      name: 'stripe',
      component: (
        <StockingStripe
          className={styles.stockingMain}
          key="stripe-pattern"
          color={stockingOptions.colorSelected}
        />
      ),
    },
    {
      name: 'dot',
      component: (
        <StockingDot
          className={styles.stockingMain}
          key="dot-pattern"
          color={stockingOptions.colorSelected}
        />
      ),
    },
    {
      name: 'moroccan',
      component: (
        <StockingMoroccan
          className={styles.stockingMain}
          key="moroccan-pattern"
          color={stockingOptions.colorSelected}
        />
      ),
    },
    {
      name: 'plaid',
      component: (
        <StockingPlaid
          className={styles.stockingMain}
          key="plaid-pattern"
          color={stockingOptions.colorSelected}
        />
      ),
    },
    {
      name: 'crosshatch',
      component: (
        <StockingCrosshatch
          className={styles.stockingMain}
          key="crosshatch-pattern"
          color={stockingOptions.colorSelected}
        />
      ),
    },
    {
      name: 'houndstooth',
      component: (
        <StockingHoundstooth
          className={styles.stockingMain}
          key="houndstooth-pattern"
          color={stockingOptions.colorSelected}
        />
      ),
    },
    {
      name: 'heart',
      component: (
        <StockingHeart
          className={styles.stockingMain}
          key="heart-pattern"
          color={stockingOptions.colorSelected}
        />
      ),
    },
    {
      name: 'zigzag',
      component: (
        <StockingZigzag
          className={styles.stockingMain}
          key="zigzag-pattern"
          color={stockingOptions.colorSelected}
        />
      ),
    },
  ];

  return (
    <div
      className={`${styles.stockingContainer} ${className} ${
        clickable ? styles.clickable : ''
      }`}
    >
      {stockingThumbnailList.map((stockingThumbnail) => {
        if (stockingThumbnail.name === stockingOptions.patternSelected) {
          return stockingThumbnail.component;
        }
      })}
      {stockingOptions.itemsSelected?.map((item: string, index: number) => {
        const itemSelected = itemOptions.filter(
          (itemOption) => itemOption.id === item,
        )[0];

        if (stockingOptions.itemsSelected?.length === 1) {
          return (
            <img
              src={itemSelected?.image}
              key={`item${index}`}
              style={{
                position: 'absolute',
                ...itemStyles?.oneItem[index],
              }}
            />
          );
        } else if (stockingOptions.itemsSelected?.length === 2) {
          return (
            <img
              src={itemSelected?.image}
              key={`item${index}`}
              style={{
                position: 'absolute',
                ...itemStyles?.twoItems[index],
              }}
            />
          );
        } else if (stockingOptions.itemsSelected?.length === 3) {
          return (
            <img
              src={itemSelected?.image}
              key={`item${index}`}
              style={{
                position: 'absolute',
                ...itemStyles?.threeItems[index],
              }}
            />
          );
        }
      })}
    </div>
  );
};

export default Stocking;
