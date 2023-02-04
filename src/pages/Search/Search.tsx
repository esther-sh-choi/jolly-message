import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Box, Typography } from '@mui/material';

import Header from '../../components/Header';
import SMSTabs from '../../components/SMSTabs';
import StockingList from '../../components/StockingList';
import SearchBar from '../../components/SearchBar';

import { stockingsData } from '../../stockingsData';

import styles from './Search.module.scss';

const Search = () => {
  const location = useLocation();
  const mode = location.pathname.slice(1);

  const [filter, setFilter] = useState('all');
  const [value, setValue] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchSubmit, setSearchSubmit] = useState(false);
  const [stockingsInfo, setStockingsInfo] = useState(stockingsData);

  const [filteredStockings, setFilteredStockings] = useState(stockingsInfo);

  const handleFavoriteClick = (id: string) => {
    setStockingsInfo((current) =>
      current.map((stocking) => {
        if (stocking.id === id) {
          stocking.favorite = !stocking.favorite;
        }
        return stocking;
      }),
    );
  };

  const handleStockingListClick = (id: string) => {
    //!!!!This should be handled when the message opens and unread becomes false in the server!!!!
    //Because this is handled now, the stocking is set to 'read' once the list item is clicked
    //So when the message opens, users will not be able to see the stocking.
    setStockingsInfo((current) =>
      current.map((stocking) => {
        if (stocking.id === id) {
          stocking.unread = false;
        }
        return stocking;
      }),
    );
  };

  const handleSelectFilter = (filterCategory: string) => {
    setFilter(filterCategory);
  };

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setValue(event.target.value);
    setSearchText(event.target.value.trim());
  };

  useEffect(() => {
    // Filter based on search text. If search text exists, return the filtered array of stockings. If it doesn't exist, filter based on the filter tab (all, unread, read, favorite).
    if (filter === 'all') {
      setFilteredStockings(
        stockingsInfo?.filter((stocking) => {
          return searchText
            ? (mode === 'inbox' ? stocking.userFrom : stocking.userTo)
                ?.toLowerCase()
                .includes(searchText.toLowerCase()) ||
                stocking.message
                  ?.toLowerCase()
                  .includes(searchText.toLowerCase())
            : stockingsInfo;
        }),
      );
    } else if (filter === 'unread') {
      setFilteredStockings(
        stockingsInfo
          ?.filter((stocking) => {
            return searchText
              ? (mode === 'inbox' ? stocking.userFrom : stocking.userTo)
                  ?.toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                  stocking.message
                    ?.toLowerCase()
                    .includes(searchText.toLowerCase())
              : stocking;
          })
          ?.filter((stocking) => {
            return stocking.unread === true;
          }),
      );
    } else if (filter === 'read') {
      setFilteredStockings(
        stockingsInfo
          ?.filter((stocking) => {
            return searchText
              ? (mode === 'inbox' ? stocking.userFrom : stocking.userTo)
                  ?.toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                  stocking.message
                    ?.toLowerCase()
                    .includes(searchText.toLowerCase())
              : stocking;
          })
          ?.filter((stocking) => {
            return stocking.unread === false;
          }),
      );
    } else if (filter === 'liked') {
      setFilteredStockings(
        stockingsInfo
          ?.filter((stocking) => {
            return searchText
              ? (mode === 'inbox' ? stocking.userFrom : stocking.userTo)
                  ?.toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                  stocking.message
                    ?.toLowerCase()
                    .includes(searchText.toLowerCase())
              : stocking;
          })
          ?.filter((stocking) => {
            return stocking.favorite === true;
          }),
      );
    }
  }, [filter, stockingsInfo, searchText, searchSubmit]);

  const filterCategories = [
    {
      type: 'all',
      label: 'All',
    },
    {
      type: 'read',
      label: 'Read',
    },
    {
      type: 'unread',
      label: 'Unread',
    },
    {
      type: 'liked',
      label: 'Liked',
    },
  ];

  return (
    <div className={styles.searchPage}>
      <Header mode={'back'} color="#ffffff"></Header>
      <div className={styles.searchMain}>
        <section className={styles.searchHeader}>
          <Typography variant="h4">
            {mode === 'inbox' ? 'Search Inbox' : 'Stockings Sent'}
          </Typography>
        </section>
        <section className={styles.searchBody}>
          {mode === 'inbox' && (
            <SMSTabs
              className={styles.SMSTabs}
              selectedCategory={filter}
              onSelectFilter={handleSelectFilter}
              tabCategories={filterCategories}
              unreadCount={
                stockingsInfo.filter((stocking) => stocking.unread).length
              }
            />
          )}
          <SearchBar
            className={styles.searchBar}
            onChange={handleSearchChange}
            value={value}
            onCancelSearch={() => {
              setValue('');
              setSearchText('');
            }}
          />
          <Box className={styles.displayStockingCount}>
            <h6>Displaying&nbsp;</h6>
            <h6>{filteredStockings?.length}</h6>
            <h6>&nbsp;of {stockingsInfo.length} stockings</h6>
          </Box>
          <div className={styles.stockingList}>
            <StockingList
              filteredStockings={filteredStockings}
              onFavoriteClick={handleFavoriteClick}
              onStockingListClick={handleStockingListClick}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Search;
