import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowBackIosNewRounded, Login, Person } from '@mui/icons-material';

import MenuComponent from '../../components/Menu';

import styles from './Header.module.scss';
import { useSelector } from 'react-redux';
import { currentUser, isLoggedIn } from '../../stores/auth';

interface HeaderProps {
  color?: string;
  bgColor?: string;
  title?: string | undefined;
  mode: 'main' | 'back' | 'logo';
  loggedIn?: boolean;
  extraButtons?: {
    icon: JSX.Element;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
  }[];
  logoClickAllowed?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  bgColor = 'transparent',
  color,
  mode,
  loggedIn,
  extraButtons,
  logoClickAllowed = true,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // 헤더가 여러 페이지에 각각 포함되어 있기 때문에 Prop으로 전달되는 loggedIn은 사용하기가 어려움. 따라서 Redux 스테이트를 이용.
  const isUserLoggedIn = useSelector(isLoggedIn);
  const user = useSelector(currentUser);

  const menuItemsUser = [
    {
      id: 'myfireplace',
      name: 'My Fireplace',
      url: '/myfireplace',
      icon: <img src={'/images/inbox-icon.svg'} alt='icon with fire' />,
      onClick: () => {
        navigate('/myfireplace');
      },
    },
    // {
    //   id: 'inbox',
    //   name: 'Inbox',
    //   url: '/inbox',
    //   icon: <img src={'/images/inbox-icon.svg'} alt="icon with fire" />,
    // },
    // {
    //   id: 'sent',
    //   name: 'Sent',
    //   url: '/sent',
    //   icon: <img src={'/images/sent-icon.svg'} alt="icon with stocking" />,
    // },
    {
      id: 'support',
      name: 'support@jollymessage.com',
      url: 'mailto: support@jollymessage.com',
      icon: (
        <img src={'/images/support-icon.svg'} alt='icon with question mark' />
      ),
    },
  ];

  const menuItemsGuest = [
    { id: 'login', name: 'Log in', url: '/login', icon: <Login /> },
    { id: 'signup', name: 'Sign up', url: '/signup', icon: <Person /> },
  ];

  const handleClose = () => {
    setMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (!logoClickAllowed) {
      return;
    }
    if (isUserLoggedIn) {
      navigate('/myfireplace');
    } else {
      navigate('/');
    }
  };

  return (
    <div className={styles.headerContainer}>
      <div
        className={styles.header}
        style={{
          backgroundColor: bgColor,
          color: color,
        }}
      >
        {mode === 'main' && (
          <>
            <section className={styles.mainLeft}>
              <button className={styles.logoButton} onClick={handleLogoClick}>
                <img src={'/images/logo.svg'} className={styles.logo} />
              </button>
            </section>
            <section className={styles.mainRight}>
              <button
                className={styles.menuButton}
                aria-label='menu'
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <img
                  src={'/images/menu-icon.svg'}
                  alt='hamburger menu'
                  style={{ height: '21px' }}
                />
              </button>
              {extraButtons?.map((extraButton, index) => (
                <button
                  className={styles.extraButton}
                  key={`${extraButton.icon}${index}`}
                  onClick={extraButton.onClick}
                  style={{ color: color }}
                >
                  {extraButton.icon}
                </button>
              ))}
            </section>
          </>
        )}
        {mode === 'back' && (
          <>
            <section className={styles.backLeft}>
              <button
                className={styles.backButton}
                aria-label='back'
                onClick={() => {
                  // const mode = location.pathname.split('/')[1];
                  // if (mode === 'myfireplace') {

                  // }
                  navigate(-1);
                }}
              >
                <ArrowBackIosNewRounded sx={{ color: color }} />
              </button>
            </section>
            <section className={styles.backRight}>
              {extraButtons?.map((extraButton, index) => (
                <button
                  className={styles.extraButton}
                  key={`${extraButton.icon}${index}`}
                  onClick={extraButton.onClick}
                  style={{ color: color }}
                >
                  {extraButton.icon}
                </button>
              ))}
            </section>
          </>
        )}
        {mode === 'logo' && (
          <button className={styles.logoButton} onClick={handleLogoClick}>
            <img src={'/images/logo.svg'} className={styles.logo} />
          </button>
        )}
      </div>
      <div
        className={`${styles.backdrop} ${styles[!menuOpen ? 'close' : '']}`}
        onClick={handleClose}
        style={{ opacity: menuOpen ? '1' : '0' }}
      ></div>
      <MenuComponent
        className={`${styles.menuContainer} ${menuOpen ? styles.open : ''}`}
        variant='persistent'
        anchor='right'
        menuItems={isUserLoggedIn ? menuItemsUser : menuItemsGuest}
        loggedIn={isUserLoggedIn}
        avatarSize='90px'
        transitionDuration={1000}
        username={user?.username}
        email={user?.email}
        onClose={handleClose}
      />
    </div>
  );
};

export default Header;
