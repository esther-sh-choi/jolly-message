import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Avatar } from '@mui/material';

import Header from '../../components/Header';
import Countdown from '../../components/Countdown';
import HangingStockings from '../../components/HangingStockings';
import SMSModal from '../../components/SMSModal';
import SMSButton from '../../components/SMSButton';
import Loading from '../../components/Loading';

import { currentUser, isLoggedIn } from '../../stores/auth';
import {
  Fireplace as FireplaceData,
  fireplacesApi,
  Stocking,
} from '../../services/fireplaces';
import { setFireplace } from '../../stores/fireplaces';

import styles from './Fireplace.module.scss';
import { setAppTimeOut } from '../../stores/app';

const Fireplace = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pagePath = location.pathname.split('/')[1];
  const isMyFireplace = pagePath === 'myfireplace';
  const dispatch = useDispatch();
  const user = useSelector(currentUser);
  const [openShareLinkModal, setOpenShareLinkModal] = useState(false);
  const loggedIn = user !== null;
  const openingDate = new Date('December 25, 2022 00:00');
  // const openingDate = new Date('December 24, 2022 04:04');
  const [timeOut, setTimeOut] = useState(new Date() > openingDate);
  const [openLoginReminder, setOpenLoginReminder] = useState(false);

  const [openRestrictedAlert, setOpenRestrictedAlert] = useState(false);
  const [copiedButtonMessage, setCopiedButtonMessage] = useState('Copy');

  const [stockings, setStockings] = useState<Stocking[]>([]);
  const [
    getFireplace,
    { isLoading, data: fireplaceData, isError, isSuccess, error },
  ] = fireplacesApi.useGetFireplaceMutation();

  const handleTimeout = (isTimeout: boolean) => {
    setTimeOut(isTimeout);
    dispatch(setAppTimeOut(isTimeout));
  };

  const handleShareLink = () => {
    //open modal
    setOpenShareLinkModal(true);
  };

  const handleNewStocking = () => {
    if (!loggedIn) {
      setOpenLoginReminder(true);
    } else {
      navigate('new');
    }
  };

  const handleOpenRestrictedAlert = (openRestrictedAlert: boolean) => {
    setOpenRestrictedAlert(openRestrictedAlert);
  };

  const handleCopyLink = async () => {
    const fireplaceId = user?.fireplaceId;

    if (!fireplaceId) {
      // 잘못된 접근
    }

    if (!navigator?.clipboard) {
      // 웹 브라우저에서 지원하지 않음(예: 카카오톡 내부 웹브라우저)
    }

    // @todo: 도메인은 실행환경에 따라 달라져야함. (제가 할게요!)
    const linkToShare =
      process.env.NODE_ENV !== 'production'
        ? `http://localhost:3000/fireplaces/${fireplaceId}`
        : `https://jollymessage.com/fireplaces/${fireplaceId}`;
    try {
      await navigator.clipboard.writeText(linkToShare);
      // 클립보드에 복사된 후 처리할 일!
      setCopiedButtonMessage('Copied!');
      // setOpenShareLinkModal(false);
    } catch (err) {
      // 에러
      console.log(err);
    }
  };

  const handlePageChange = (page: number) => {
    // console.log({
    //   page,
    // });
  };

  const refineStokingNumber = (stockingNumber: number | undefined) => {
    const count = stockingNumber || 0;
    if (count > 999) {
      return '999+';
    }

    return String(count).padStart(3, '0');
  };

  const fetchFireplaceData = async () => {
    try {
      const pathVariableId = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
      );
      const fireplaceId =
        pathVariableId === 'myfireplace' ? user?.fireplaceId : pathVariableId;

      if (!fireplaceId) {
        return;
      }

      const fireplace: FireplaceData = await getFireplace({
        id: fireplaceId,
        owner: isMyFireplace,
      }).unwrap();
      setStockings(fireplace.data);
      dispatch(setFireplace(fireplace));
    } catch (err) {
      console.log(err);
      // @ts-ignore
      if (err.status === 404) {
        navigate('/');
      }
    }
  };

  // useEffect(() => {
  //   if (pagePath !== 'myfireplace') {
  //     const pathVariableId = location.pathname.substring(
  //       location.pathname.lastIndexOf('/') + 1,
  //     );
  //     if (pathVariableId === user?.fireplaceId) {
  //       navigate('/myfireplace');
  //     }
  //   }
  // }, [pagePath]);

  useEffect(() => {
    fetchFireplaceData();
    dispatch(setAppTimeOut(timeOut));
  }, []);

  return (
    <>
      <div id='fireplace-page' className={styles.fireplacePage}>
        <Header
          mode='main'
          bgColor='#d4243b'
          color='#ffffff'
          loggedIn={loggedIn}
        />
        <div id='fireplace-body' className={styles.fireplaceMain}>
          <div className={styles.fireplaceHeader}>
            {/* 내 파이어플레이스면 */}
            {isMyFireplace && (
              <>
                <div className={styles.profileContainer}>
                  {/* 프로필 이미지가 있으면 */}
                  {user?.profileImageUrl && (
                    <Avatar
                      className={styles.avatar}
                      alt='profile picture'
                      src={user?.profileImageUrl ?? '/images/guest-avatar.svg'}
                      sx={{ margin: '10px', width: '80px', height: '80px' }}
                    />
                  )}
                  {/* 프로필 이미지가 없으면 */}
                  {!user?.profileImageUrl && (
                    <div className={styles.guestAvatar}>
                      <img
                        className={styles.guestStockingImage}
                        src={'/images/guest-avatar.svg'}
                        alt='white sock'
                      />
                    </div>
                  )}
                  <div className={styles.welcomeMessage}>
                    <h6
                      style={{
                        paddingBottom: '5px',
                      }}
                    >
                      You've got
                    </h6>
                    {/* 현재까지 받은 메세지 수 */}
                    <h4 className={styles.headerMainMessage}>
                      {fireplaceData?.meta?.totalCount ?? 0} Stockings!
                    </h4>
                  </div>
                </div>
                <p className={styles.myFireplaceInstruction}>
                  You can open your stockings on December 25, 2022 at midnight
                </p>
              </>
            )}
            {/* 다른 사람의 파이어플레이스면 */}
            {!isMyFireplace && (
              <div className={styles.profileContainer}>
                {/* 프로필 이미지가 있으면 */}
                {fireplaceData?.profileImageUrl && (
                  <Avatar
                    className={styles.avatar}
                    alt='profile picture'
                    src={
                      fireplaceData?.profileImageUrl ??
                      '/images/guest-avatar.svg'
                    }
                    sx={{ margin: '10px', width: '80px', height: '80px' }}
                  />
                )}
                {/* 프로필 이미지가 없으면 */}
                {!fireplaceData?.profileImageUrl && (
                  <div className={styles.guestAvatar}>
                    <img
                      className={styles.guestStockingImage}
                      src={'/images/guest-avatar.svg'}
                      alt='white sock'
                    />
                  </div>
                )}
                <div className={styles.welcomeMessage}>
                  <h6>Welcome to</h6>
                  {/* 파이어플레이스를 소유한 유저네임 */}
                  <h4 className={styles.headerMainMessage}>
                    {fireplaceData?.username ?? 'Anonymous'}'s Fireplace
                  </h4>
                </div>
              </div>
            )}
            <div className={styles.information}>
              <div
                className={styles.infoContainer}
                style={{ marginRight: '10px' }}
              >
                {/* 내 파이어플레이스면 내가 보낸 메세지 수, 다른 사람 파이어플레이스면 그 사람이 받은 메세지 수 */}
                <p>{isMyFireplace ? 'Sent Stockings' : 'Stockings'}</p>
                <span className={styles.infoContent}>
                  {/* 스타킹 수 */}
                  {refineStokingNumber(
                    isMyFireplace
                      ? fireplaceData?.sentCount
                      : fireplaceData?.meta.totalCount
                  )}
                </span>
              </div>
              <div
                className={styles.infoContainer}
                style={{ justifyContent: timeOut ? 'center' : 'space-between' }}
              >
                {!timeOut ? (
                  <>
                    <p style={{ fontSize: '14px', padding: '0 15px' }}>
                      Closing Time Remaining
                    </p>
                    <Countdown
                      className={`${styles.infoContent} ${styles.countdown}`}
                      onTimeout={handleTimeout}
                      openingDate={openingDate}
                    />
                  </>
                ) : (
                  <h4 className={styles.merryChristmas}>Merry Christmas!</h4>
                )}
              </div>
            </div>
          </div>
          <div id='swiper' className={styles.hangingStockingsContainer}>
            <img
              className={styles.fireplaceBackground}
              src={'/images/fireplace-bg.svg'}
            />
            <img
              className={styles.fireplaceImage}
              src={'/images/fireplace-image.svg'}
            />
            <div className={styles.ropesContainer}>
              <img src={'/images/blue-line.svg'} className={styles.rope} />
              <img
                src={'/images/red-line.svg'}
                className={styles.rope}
                style={{ paddingTop: '50px' }}
              />
            </div>
            <HangingStockings
              stockings={stockings}
              onPageChange={handlePageChange}
              onOpenAlert={handleOpenRestrictedAlert}
              possibleToOpen={timeOut}
            />
          </div>
          <SMSButton
            className={styles.fireplaceButton}
            style={{
              backgroundColor: '#f6f5f2',
              height: '120px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            sx={{
              height: '49px',
              width: '80%',
            }}
            variant='contained'
            onClick={isMyFireplace ? handleShareLink : handleNewStocking}
          >
            {isMyFireplace ? 'Share my link' : 'Stuff a Stocking'}
          </SMSButton>
        </div>
        <SMSModal
          open={openShareLinkModal}
          mainIcon={
            copiedButtonMessage !== 'Copy' ? (
              <img
                src={'/images/success-icon.svg'}
                alt='white checkmark in green circle'
              />
            ) : undefined
          }
          onClose={() => {
            setCopiedButtonMessage('Copy');
            setOpenShareLinkModal(false);
          }}
          title='Click the button below to copy your fireplace link'
          replyButtons={
            <SMSButton
              variant='contained'
              onClick={handleCopyLink}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
              sx={{ height: '48px', width: '50%' }}
              upperCase
            >
              {copiedButtonMessage}
            </SMSButton>
          }
        ></SMSModal>
        <SMSModal
          open={openLoginReminder}
          onClose={() => {
            setOpenLoginReminder(false);
          }}
          mainIcon={<img src='/images/alarm-icon.svg' alt='yellow bell' />}
          title='Warning'
          replyButtons={
            <div className={styles.loginReminderButtonContainer}>
              <SMSButton
                variant='contained'
                onClick={() => {
                  navigate('/login');
                }}
                sx={{ marginBottom: '8px' }}
              >
                Login
              </SMSButton>
              <SMSButton
                variant='outlined'
                onClick={() => {
                  navigate('/signup');
                }}
              >
                Sign Up
              </SMSButton>
              <SMSButton
                variant='text'
                onClick={() => {
                  navigate('new');
                }}
                sx={{ display: 'flex' }}
              >
                Continue as
                <p
                  style={{
                    paddingLeft: '5px',
                    fontWeight: 'bold',
                    color: '#001689',
                  }}
                >
                  Guest 〉
                </p>
              </SMSButton>
            </div>
          }
        >
          <p className={styles.modalMessage}>
            Log in to read, delete, or edit your stocking afer sending it. You
            will NOT be able to delete or edit your stocking once you submit it.
            <br />
            <br />
            By signing up, you can get your very own virtual fireplace!
          </p>
        </SMSModal>
        <SMSModal
          open={openRestrictedAlert}
          onClose={() => {
            setOpenRestrictedAlert(false);
          }}
          replyButtons={
            <SMSButton
              variant='contained'
              onClick={() => {
                setOpenRestrictedAlert(false);
              }}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
              sx={{ height: '48px', width: '40%' }}
              upperCase
            >
              OK
            </SMSButton>
          }
        >
          <p className={styles.modalMessage} style={{ paddingBottom: '20px' }}>
            {isMyFireplace
              ? 'You can open your stockings on December 25, 2022 at midnight'
              : "You cannot read other people's messages."}
          </p>
        </SMSModal>
        <Loading loading={isLoading} />
      </div>
      {/* {timeOut && (
        <Snowfall
          style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            zIndex: 10000,
          }}
          snowflakeCount={100}
        />
      )} */}
    </>
  );
};

export default Fireplace;
