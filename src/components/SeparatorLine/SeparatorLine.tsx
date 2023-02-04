import React from 'react';

import { Divider } from '@mui/material';

interface SeparatorLineProps {
  className?: string | undefined;
  fontSize?: string | undefined;
  children:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal;
}

const SeparatorLine: React.FC<SeparatorLineProps> = ({
  className,
  fontSize,
  children,
}) => {
  return (
    <div className={className}>
      <Divider
        sx={{
          fontSize: `${fontSize}`,
          '::before': { borderTop: '1px solid #333333' },
          '::after': { borderTop: '1px solid #333333' },
        }}
      >
        {children}
      </Divider>
    </div>
  );
};

export default SeparatorLine;
