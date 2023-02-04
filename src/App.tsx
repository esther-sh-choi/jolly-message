import React from 'react';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './stores/store';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snowfall from 'react-snowfall';

import Router from './Router';
import useWindowSize from './hooks/useWindowSize';

import styles from './App.module.scss';
import './fonts/HKGrotesk-Bold.woff';

function App() {
  const theme = createTheme();
  const windowSize = useWindowSize();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          {windowSize.width && windowSize.width > 480 && (
            <div className="snowfall">
              <Snowfall />
            </div>
          )}
          <div className={styles.app}>
            <Router />
          </div>

          <div className={styles.floor}>
            <div className={styles.items}>
              <img
                className={styles.snowman}
                src={'/images/item-snowman.svg'}
                alt="smiling snowman with red hat and buttons"
              />
              <img
                className={styles.gingerbread}
                src={'/images/item-gingerbread.svg'}
                alt="smiling gingerbread man with red hat and scarf"
              />
              <img
                className={styles.giftRed}
                src={'/images/desktop-bg-red.svg'}
                alt="red gift box with pink ribbon"
              />
              <img
                className={styles.giftGreen}
                src={'/images/desktop-bg-green.svg'}
                alt="green gift box with red ribbon"
              />
              <img
                className={styles.giftYellow}
                src={'/images/desktop-bg-yellow.svg'}
                alt="yellow gift box with purple ribbon"
              />
            </div>
          </div>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
