import React, { MouseEventHandler, FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { ListItemIcon } from '@mui/material';
import { CloseRounded, KeyboardArrowRightRounded } from '@mui/icons-material';

import ProfilePic from '../../components/ProfilePic';

import styles from './Menu.module.scss';
import SMSButton from '../SMSButton';
import { authApi } from '../../services/auth';
import { useDispatch } from 'react-redux';
import { resetAuth } from '../../stores/auth';
import { resetFireplace } from '../../stores/fireplaces';
import { resetStocking } from '../../stores/stockings';

interface MenuProps {
  alt?: string;
  bgcolor?: `#${string}`;
  className?: string;
  elevation?: number;
  avatarSize?: string;
  variant?: 'permanent' | 'persistent' | 'temporary' | undefined;
  anchor?: 'left' | 'right' | 'top' | 'bottom' | undefined;
  menuItems: {
    id: string;
    name: string;
    url: string;
    icon: JSX.Element;
    onClick?: () => void;
  }[];
  loggedIn?: boolean | undefined;
  transitionDuration?:
    | number
    | { appear?: number; enter?: number; exit?: number };
  username?: string;
  email?: string;
  onClose?: MouseEventHandler<HTMLButtonElement>;
}

const Menu: FC<MenuProps> = ({
  alt,
  avatarSize,
  className,
  menuItems,
  loggedIn,
  transitionDuration,
  username,
  email,
  onClose,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout, { isLoading, data: logoutData, isError, isSuccess, error }] =
    authApi.useLogoutMutation();

  const handleLogout = async () => {
    try {
      const response = await logout().unwrap();
      dispatch(resetAuth());
      dispatch(resetFireplace());
      dispatch(resetStocking());
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={className} id="menu">
      <nav
        className={`${styles.navigationMenu}`}
        style={{
          transition: `${transitionDuration}ms`,
        }}
      >
        <button className={styles.closeButton} onClick={onClose}>
          <CloseRounded />
        </button>
        <div className={styles.profile}>
          {loggedIn ? (
            // 로그인 한 경우 프로필사진 변경 가능한 컴포넌트를 표시
            <ProfilePic alt={alt} avatarSize={avatarSize} />
          ) : (
            <span className={styles.guestAvatar}>
              <img
                className={styles.guestStockingImage}
                src={'/images/guest-avatar.svg'}
                alt="white sock"
              />
            </span>
          )}
          <h4 className={styles.username}>{loggedIn ? username : 'Guest'}</h4>
          {loggedIn && <h6 className={styles.displayEmail}>{email || ''}</h6>}
        </div>
        {loggedIn && (
          <>
            <ul className={styles.menuList}>
              {menuItems.map((menuItem) => (
                <li
                  key={menuItem.name}
                  className={styles.menuItem}
                  onClick={() => {
                    if (menuItem?.onClick) {
                      menuItem.onClick();
                      if (menuItem.id !== 'support' && onClose !== undefined) {
                        // @ts-ignore
                        onClose();
                      }
                    }
                  }}
                >
                  <a href={menuItem.url} className={styles.menuItemButton}>
                    <ListItemIcon>{menuItem.icon}</ListItemIcon>
                    <h1 style={{ flex: '1' }}>{menuItem.name}</h1>
                  </a>
                  {menuItem.id !== 'support' && (
                    <KeyboardArrowRightRounded
                      sx={{ color: '#001689', fontSize: '30px', padding: '0' }}
                    />
                  )}
                </li>
              ))}
            </ul>
            <SMSButton
              className={styles.logoutButton}
              variant="contained"
              onClick={handleLogout}
            >
              Log out
            </SMSButton>
          </>
        )}
        {!loggedIn && (
          <div className={styles.menuListGuest}>
            <SMSButton
              className={styles.menuButtonGuest}
              variant="outlined"
              onClick={() => navigate('/login')}
            >
              Login
            </SMSButton>
            <SMSButton
              className={styles.menuButtonGuest}
              variant="contained"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </SMSButton>
            <div className={styles.helpContact}>
              <p className={styles.helpTitle}>
                <img
                  className={styles.questionMark}
                  src={'/images/question-mark.svg'}
                  alt="question mark in rounded box"
                />
                <span>Need Help?</span>
              </p>
              <a
                href="mailto: support@jollymessage.com"
                className={styles.helpEmail}
              >
                support@jollymessage.com
              </a>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Menu;
