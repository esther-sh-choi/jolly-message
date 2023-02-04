import React, { MouseEventHandler } from 'react';

import { Box, IconButton, Typography } from '@mui/material';
import { CloseRounded } from '@mui/icons-material';

import styles from './SMSModal.module.scss';

interface SMSModalProps {
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  children?: any;
  className?: string;
  mainIcon?: any;
  open: boolean;
  replyButtons?: JSX.Element;
  title?: string;
  closeButton?: boolean;
  childrenPaddingBottom?: number;
  onClose?: MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
}

const style = {
  boxShadow: 24,
  bgcolor: 'background.paper',
};

const SMSModal: React.FC<SMSModalProps> = ({
  children,
  className,
  mainIcon,
  open,
  replyButtons,
  title,
  closeButton = true,
  childrenPaddingBottom = 2,
  align = 'center',
  onClose,
}) => {
  return (
    <div
      className={`${className} ${styles.modalContainer} ${
        styles[!open ? 'close' : '']
      }`}
    >
      <div className={styles.backdrop} onClick={onClose}></div>
      <Box sx={style} className={styles.modal}>
        {closeButton && (
          <IconButton
            onClick={onClose}
            size="large"
            sx={{
              alignSelf: 'flex-end',
              p: '10px',
              m: '5px',
              mb: '0',
            }}
          >
            <CloseRounded sx={{ fontSize: '30px', color: '#001689' }} />
          </IconButton>
        )}
        <div
          className={styles.modalMainContainer}
          style={{
            paddingTop: closeButton ? 0 : 4,
          }}
        >
          <div className={styles.modalMainBody}>
            {mainIcon}
            <h1 id="modal-title" className={styles.modalTitle}>
              {title}
            </h1>
            <Typography
              gutterBottom
              id="modal-description"
              align={align}
              variant="subtitle1"
              paddingBottom={childrenPaddingBottom}
            >
              {children}
            </Typography>
          </div>
          <div className={styles.modalReplyButtons}>{replyButtons}</div>
        </div>
      </Box>
    </div>
  );
};

export default SMSModal;
