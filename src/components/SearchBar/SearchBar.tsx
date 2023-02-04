import React, { ChangeEventHandler } from 'react';

import { IconButton } from '@mui/material';
import { CloseRounded } from '@mui/icons-material';

import styles from './SearchBar.module.scss';

interface SearchBarProps {
  className?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
  onCancelSearch?: React.MouseEventHandler<HTMLButtonElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  onChange,
  value,
  onCancelSearch,
}) => {
  return (
    <div className={`${styles.searchFieldContainer} ${className}`}>
      <label className={styles.searchLabel}>Search</label>
      <input
        className={styles.searchInputField}
        type="text"
        placeholder="Type username or messages"
        onChange={onChange}
        value={value}
        name="searchBar"
        aria-label="search messages"
      />
      <button
        className={`${styles.cancelButton} ${value && styles.active}`}
        aria-label="cancel"
        onClick={onCancelSearch}
      >
        <CloseRounded />
      </button>
    </div>
  );
};

export default SearchBar;
