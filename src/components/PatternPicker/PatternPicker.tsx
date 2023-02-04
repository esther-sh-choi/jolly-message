import React, { useState } from 'react';

import styles from './PatternPicker.module.scss';

interface PatternPickerProps {
  onPatternChange: (arg: string) => void;
  colorSelected?: string;
}

const patternOptions = [
  { id: 'solid', image: '', selected: true },
  { id: 'snowflake', image: '/images/pattern-snowflake.svg', selected: false },
  {
    id: 'stripe',
    image: '/images/pattern-stripe.svg',
    selected: false,
  },
  { id: 'dot', image: '/images/pattern-dot.svg', selected: false },
  { id: 'moroccan', image: '/images/pattern-moroccan.svg', selected: false },
  {
    id: 'plaid',
    image: '/images/pattern-plaid.svg',
    selected: false,
  },
  {
    id: 'crosshatch',
    image: '/images/pattern-crosshatch.svg',
    selected: false,
  },
  {
    id: 'houndstooth',
    image: '/images/pattern-houndstooth.svg',
    selected: false,
  },
  {
    id: 'heart',
    image: '/images/pattern-heart.svg',
    selected: false,
  },
  {
    id: 'zigzag',
    image: '/images/pattern-zigzag.svg',
    selected: false,
  },
];

const PatternPicker: React.FC<PatternPickerProps> = ({
  onPatternChange,
  colorSelected,
}) => {
  const [patterns, setPatterns] = useState(patternOptions);

  const handlePatternChange = (event: any) => {
    onPatternChange(event.target.id);

    setPatterns((current) =>
      current.map((pattern) => {
        if (pattern.id === event.target.id) {
          pattern.selected = true;
        } else {
          pattern.selected = false;
        }
        return pattern;
      }),
    );
  };

  return (
    <div className={styles.patternPicker}>
      {patterns.map((pattern) => (
        <div
          onClick={handlePatternChange}
          key={pattern.id}
          id={pattern.id}
          title={pattern.id}
          className={styles.pattern}
          style={{
            backgroundColor: colorSelected,
            backgroundImage: `url(${pattern.image})`,
            border: pattern.selected
              ? '2px solid #001689'
              : '2px solid #fafafa',
          }}
        ></div>
      ))}
    </div>
  );
};

export default PatternPicker;
