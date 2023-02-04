import React from 'react';

import Color from '../Color';

import styles from './Palette.module.scss';

interface PaletteProps {
  colors?: {
    background?: string;
    selected?: boolean;
  }[];
  onChange: any;
  className?: string;
}

const Palette: React.FC<PaletteProps> = ({ className, colors, onChange }) => {
  const handleColorChange = (color: any, type: string) => {
    onChange(color, type);
  };

  return (
    <div className={`${className} ${styles.palette}`}>
      {colors?.map((color) => (
        <Color
          key={color.background}
          onClick={handleColorChange}
          background={color.background}
          selected={color.selected}
          className={styles.colorIcon}
          selectedStyle={{
            border: '2px solid #001689',
          }}
        />
      ))}
    </div>
  );
};

export default Palette;
