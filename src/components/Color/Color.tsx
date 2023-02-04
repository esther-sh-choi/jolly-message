import React, { SyntheticEvent } from 'react';

import styles from './Color.module.scss';

interface ColorProps {
  className?: string;
  background: string | undefined;
  selected?: boolean;
  selectedStyle?: object;
  onClick?: any;
}

const Color: React.FC<ColorProps> = ({
  className,
  background,
  selected,
  selectedStyle,
  onClick,
}) => {
  const handleClick = (event: SyntheticEvent<HTMLDivElement>) => {
    onClick((event.target as HTMLDivElement).id, 'preset');
  };

  return (
    <div
      className={`${className} ${styles.color}`}
      onClick={handleClick}
      id={background}
      style={{
        background: background,
        ...(selected && selectedStyle),
      }}
    ></div>
  );
};

export default Color;
