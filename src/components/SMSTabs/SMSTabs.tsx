import React, { useEffect, useState } from 'react';

import SMSButton from '../SMSButton';

import styles from './SMSTabs.module.scss';

interface SMSTabsProps {
  className: string;
  onSelectFilter?: any;
  unreadCount?: number;
  tabCategories?: {
    type?: string;
    label?: string;
    title?: string;
    component?: JSX.Element;
    id?: string;
  }[];
  selectedCategory?: string;
}

const SMSTabs: React.FC<SMSTabsProps> = ({
  className,
  selectedCategory,
  onSelectFilter,
  unreadCount,
  tabCategories,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    let tabButton = event.target as HTMLButtonElement;
    onSelectFilter(tabButton.id);
  };

  useEffect(() => {
    tabCategories?.forEach((category, index) => {
      if (category.type === selectedCategory) {
        setSelectedIndex(index);
      }
    });
  }, [selectedCategory]);

  return (
    <div className={`${styles.tabsContainer} ${className}`}>
      {tabCategories?.map((category) => (
        <SMSButton
          key={category.type}
          id={category.type}
          variant="text"
          onClick={handleClick}
          badgeCount={category.type === 'unread' ? unreadCount : undefined}
          displayBadge={category.type !== 'unread' ? false : true}
          sx={{
            fontSize: '15px',
            backgroundColor: 'transparent',
            fontFamily:
              selectedCategory === category.type
                ? 'HKGroteskBold'
                : 'HKGroteskLight',
          }}
          style={{ width: '100%' }}
          className={styles.tab}
        >
          {category.label}
        </SMSButton>
      ))}
      <div
        className={styles.tabIndicatorContainer}
        style={{
          width: `calc(100% / ${tabCategories?.length})`,
          left: `calc((100% / ${tabCategories?.length}) * ${selectedIndex})`,
        }}
      >
        <div className={styles.tabIndicator}></div>
      </div>
    </div>
  );
};

export default SMSTabs;
