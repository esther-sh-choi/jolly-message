import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  FavoriteRounded,
  FavoriteBorderRounded,
  EditRounded,
} from '@mui/icons-material';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import Header from '../../components/Header';
import StockingMessage from '../../components/StockingMessage';
import SMSModal from '../../components/SMSModal';
import SMSButton from '../../components/SMSButton';
import SpeedDial from '../../components/SpeedDial';

import { currentFireplaceStockings } from '../../stores/fireplaces';

import styles from './OpenStocking.module.scss';
import './OpenStockingSwiperArrows.scss';
import Stocking from '../../components/Stocking';

const OpenStocking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.pathname.split('/')[1];
  const [chosenID, setChosenID] = useState(
    location.pathname.replace('/myfireplace/stockings/', '')
  );

  const stockingsList = useSelector(currentFireplaceStockings);
  const [chosenIndex, setChosenIndex] = useState(
    stockingsList.findIndex((stocking) => stocking.uid === chosenID)
  );

  const [chosenStocking, setChosenStocking] = useState(
    stockingsList[chosenIndex]
  );
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openDeletingModal, setOpenDeletingModal] = useState(false);
  const [openSuccessDeleteModal, setOpenSuccessDeleteModal] = useState(false);
  const [reportOption, setReportOption] = useState(
    'Harmful and dangerous content'
  );

  const [openSpeedDial, setOpenSpeedDial] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (
        !event.target.id.includes('inbox') ||
        !event.target.id.includes('sent')
      ) {
        setOpenSpeedDial(false);
      }
    };
    // Bind the event listener
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const deadline = new Date('December 25, 2022 00:00');
  // const deadline = new Date('October 25, 2022 00:00');
  const [beforeDeadline, setBeforeDeadline] = useState(new Date() < deadline);

  const handleFavoriteClick = () => {
    // setStockingsList((current) =>
    //   current.map((stocking, index) => {
    //     if (index === chosenIndex) {
    //       stocking.favorite = !stocking.favorite;
    //     }
    //     return stocking;
    //   }),
    // );
  };

  const inboxActions = [
    {
      icon: (
        <img
          src={'/images/delete-icon.svg'}
          alt='trash can shape'
          id='inbox-delete'
          // styles={{padding:}}
        />
      ),
      id: 'inbox-delete',
      name: 'Delete',
      handleClick: () => {
        handleOpenConfirmModal();
      },
    },
    {
      icon: (
        <img
          src={'/images/report-icon.svg'}
          alt='exclamation mark'
          id='inbox-report'
        />
      ),
      id: 'inbox-report',
      name: 'Report',
      handleClick: () => {
        setOpenReportModal(true);
      },
    },
  ];

  const sentActions = [
    {
      icon: (
        <img
          src={'/images/delete-icon.svg'}
          alt='trash can shape'
          id='sent-delete'
        />
      ),
      id: 'sent-delete',
      name: 'Delete',
      handleClick: () => {
        beforeDeadline ? handleOpenConfirmModal() : handleOpenErrorModal();
      },
    },
    {
      icon: <EditRounded id='sent-edit' />,
      id: 'sent-edit',
      name: 'Edit',
      handleClick: () => {
        if (beforeDeadline) {
          navigate(
            `/fireplaces/${chosenStocking.fireplaceId}/messages/${chosenStocking.uid}/edit`,
            {
              state: { chosenStocking: chosenStocking },
            }
          );
        } else {
          handleOpenErrorModal();
        }
      },
    },
  ];

  const handleOpenErrorModal = () => {
    setOpenErrorModal(true);
  };

  const handleOpenConfirmModal = () => {
    setOpenConfirmModal(true);
  };

  const handleDelete = () => {
    console.log(`Delete stocking ${chosenStocking.uid}`);
    setOpenDeletingModal(true);

    const openDeletingModalDuration = () => {
      setOpenDeletingModal(false);
      setOpenConfirmModal(false);
      setOpenSuccessDeleteModal(true);
    };

    setTimeout(openDeletingModalDuration, 2000);
  };

  const handleSuccessDelete = () => {
    setOpenSuccessDeleteModal(false);
    // setStockingsList((prev) =>
    //   prev.filter((stocking) => stocking.id !== chosenStocking.uid),
    // );

    //Redirect to previous page
  };

  const handleReportOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReportOption((event.target as HTMLInputElement).value);
  };

  const handleSubmitReport = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpenReportModal(false);
    console.log(`Submit report: ${reportOption} for stocking id ${chosenID}`);
  };

  useEffect(() => {
    setChosenStocking(stockingsList[chosenIndex]);
  }, [stockingsList]);

  const modalButtonStyle = {
    height: '48px',
    '&:hover': { color: 'inherit' },
  };

  const handleOptionClick = (e: any) => {
    const id = e.target.id;

    if (id.includes('inbox')) {
      inboxActions.map((option) => {
        if (option.id === id) {
          option.handleClick();
        }
      });
    } else {
      sentActions.map((option) => {
        if (option.id === id) {
          option.handleClick();
        }
      });
    }
  };

  return (
    <div className={styles.openStockingPage}>
      <Header mode='back' color='#ffffff' />
      <div className={styles.openStockingMain}>
        <div className={styles.openStockingHeader}>
          <Stocking
            className={styles.stocking}
            stockingOptions={{
              colorSelected: chosenStocking.color,
              patternSelected: chosenStocking.pattern,
              itemsSelected: chosenStocking.items,
            }}
          />
          <div className={styles.openStockingTitle}>
            <h6>From:</h6>
            <h1 className={styles.nickname}>{chosenStocking?.nickname}</h1>
          </div>
          {/* <div className={styles.openStockingOptionButtons}>
            {mode !== 'sent' && (
              <button
                className={styles.headerButton}
                onClick={handleFavoriteClick}
              >
                {chosenStocking?.favorite ? (
                  <FavoriteRounded sx={{ fontSize: '33px' }} />
                ) : (
                  <FavoriteBorderRounded sx={{ fontSize: '33px' }} />
                )}
              </button>
            )}
            <SpeedDial
              options={mode !== 'sent' ? inboxActions : sentActions}
              onClick={() => setOpenSpeedDial((prev) => !prev)}
              openSpeedDial={openSpeedDial}
              onOptionClick={handleOptionClick}
            ></SpeedDial>
          </div> */}
        </div>
        <Swiper
          className={styles.swiper}
          initialSlide={chosenIndex}
          onSlideChange={(stocking) => {
            setChosenIndex(stocking.activeIndex);
            setChosenID(stockingsList[stocking.activeIndex].uid);
            setChosenStocking(stockingsList[stocking.activeIndex]);

            if (mode === 'inbox') {
              navigate(`/inbox/${stockingsList[stocking.activeIndex].uid}`);
            } else if (mode === 'myfireplace') {
              navigate(
                `/myfireplace/stockings/${
                  stockingsList[stocking.activeIndex].uid
                }`,
                { replace: true }
              );
            } else if (mode === 'sent') {
              navigate(`/sent/${stockingsList[stocking.activeIndex].uid}`);
            }
          }}
          pagination={{
            dynamicBullets: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          style={{ color: '#000000' }}
        >
          {stockingsList.map((stocking) => (
            <SwiperSlide key={stocking.uid}>
              <StockingMessage stocking={stocking} mode={mode} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <SMSModal
        open={openErrorModal}
        onClose={() => setOpenErrorModal(false)}
        title='Error'
        mainIcon={
          <img
            src={'/images/warning-icon.svg'}
            alt='yellow triangular warning sign with exclamation mark'
          />
        }
        replyButtons={
          <SMSButton
            className={styles.replyButton}
            sx={{ modalButtonStyle }}
            onClick={() => setOpenErrorModal(false)}
            upperCase
          >
            Ok
          </SMSButton>
        }
      >
        <p className={styles.modalMessage}>
          You cannot edit or delete messages after 00:00:00 on December 25th,
          2022.
        </p>
      </SMSModal>
      <SMSModal
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        mainIcon={
          <img
            src={'/images/warning-icon.svg'}
            alt='yellow triangular warning sign with exclamation mark'
          />
        }
        replyButtons={
          <div className={styles.replyButtons}>
            <SMSButton
              className={styles.replyButton}
              variant='contained'
              onClick={handleDelete}
              sx={modalButtonStyle}
              upperCase
            >
              Yes
            </SMSButton>
            <SMSButton
              className={styles.replyButton}
              variant='outlined'
              onClick={() => setOpenConfirmModal(false)}
              sx={{
                ...modalButtonStyle,
                border: '1px solid #001689',
                backgroundColor: '#f6f5fb',
                marginLeft: '10px',
              }}
              upperCase
            >
              No
            </SMSButton>
          </div>
        }
      >
        <p className={styles.modalMessage} style={{ paddingBottom: '30px' }}>
          Once you delete the stocking, it will be deleted forever.
        </p>
        <p className={styles.modalMessage}>
          Are you sure you want to delete this message?
        </p>
      </SMSModal>
      <SMSModal
        className={styles.deletingModal}
        mainIcon={<CircularProgress />}
        open={openDeletingModal}
      >
        Deleting...
      </SMSModal>
      <SMSModal
        open={openSuccessDeleteModal}
        onClose={handleSuccessDelete}
        title='Success!'
        replyButtons={
          <SMSButton
            className={styles.replyButton}
            variant='contained'
            sx={{
              ...modalButtonStyle,
              justifyContent: 'center',
            }}
            style={{ display: 'flex' }}
            onClick={handleSuccessDelete}
            upperCase
          >
            Ok
          </SMSButton>
        }
      >
        <p className={styles.modalMessage}>
          Your message was successfully deleted.
        </p>
      </SMSModal>
      <SMSModal
        open={openReportModal}
        onClose={() => setOpenReportModal(false)}
        title='Report Content'
        childrenPaddingBottom={0}
      >
        <form onSubmit={handleSubmitReport}>
          <FormControl sx={{ textAlign: 'left' }}>
            <FormLabel
              id='report-button-group-label'
              sx={{ pb: '10px', textAlign: 'center' }}
            >
              Please choose one of the options below:
            </FormLabel>
            <RadioGroup
              aria-labelledby='demo-radio-buttons-group-label'
              defaultValue='Harmful and dangerous content'
              name='radio-buttons-group'
              value={reportOption}
              onChange={handleReportOptionChange}
            >
              <FormControlLabel
                value='Harmful and dangerous content'
                control={<Radio />}
                label='Harmful and dangerous content'
              />
              <FormControlLabel
                value='Violent or graphic content'
                control={<Radio />}
                label='Violent or graphic content'
              />
              <FormControlLabel
                value='Hate speech'
                control={<Radio />}
                label='Hate speech'
              />
              <FormControlLabel
                value='Harrassment & cyberbullying'
                control={<Radio />}
                label='Harrassment & cyberbullying'
              />
            </RadioGroup>
            <SMSButton
              className={styles.replyButton}
              variant='contained'
              sx={{ ...modalButtonStyle, marginTop: '20px' }}
              type='submit'
              upperCase
            >
              Submit
            </SMSButton>
          </FormControl>
        </form>
      </SMSModal>
    </div>
  );
};

export default OpenStocking;
