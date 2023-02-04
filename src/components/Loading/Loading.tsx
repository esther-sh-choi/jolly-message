import React from 'react';

import styles from './Loading.module.scss';

interface LoadingProps {
  loading?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ loading = false, className }) => {
  return (
    <div
      className={`${className} ${styles.loadingScreen}`}
      style={{ display: loading ? '' : 'none' }}
    >
      <span className={styles.stocking1}></span>
      <span className={styles.stocking2}></span>
      <span className={styles.stocking3}></span>
    </div>
  );
};

export default Loading;
