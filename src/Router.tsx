import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Signup from './pages/Signup';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Username from './pages/Username';
import ForgotPassword from './pages/ForgotPassword';
import RenewPassword from './pages/RenewPassword';
import Search from './pages/Search';
import OpenStocking from './pages/OpenStocking/OpenStocking';
import WriteMessage from './pages/WriteMessage';
import DecorateStocking from './pages/DecorateStocking';
import Fireplace from './pages/Fireplace';
import { useSelector } from 'react-redux';
import { currentUser, isLoggedIn } from './stores/auth';
import GuardedRoute from './components/GuardedRoute/GuardedRoute';
import Snowfall from 'react-snowfall';
import { timeOut } from './stores/app';

const Router = () => {
  const user = useSelector(currentUser);
  const isUserLoggedIn = user !== null;
  const appTimeOut = useSelector(timeOut);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/login' element={<Login />} />
          <Route
            path='/signup/username'
            element={
              <GuardedRoute auth={isUserLoggedIn}>
                <Username />
              </GuardedRoute>
            }
          />
          <Route
            path='/myfireplace'
            element={
              <GuardedRoute auth={isUserLoggedIn && user.username}>
                <Fireplace />
              </GuardedRoute>
            }
          />
          <Route path='/fireplaces/:fireplaceId' element={<Fireplace />} />
          <Route
            path='/fireplaces/:fireplaceId/new'
            element={<WriteMessage />}
          />
          <Route
            path='/fireplaces/:fireplaceId/new/decorate'
            element={<DecorateStocking />}
          />
          <Route
            path='/myfireplace/stockings/:stockingId'
            element={<OpenStocking />}
          />
          <Route path='/renewpassword/:tokenId' element={<RenewPassword />} />
          {/* <Route path="/forgotpassword" element={<ForgotPassword />} />
        
        <Route path="/inbox" element={<Search />} />
        <Route path="/sent" element={<Search />} /> */}
          {/* <Route path="/inbox/:stockingId" element={<OpenStocking />} /> */}
          {/* <Route path="/sent/:stockingId" element={<OpenStocking />} /> */}
          {/* <Route
          path="/fireplaces/:fireplaceId/messages/:stockingId/edit"
          element={<WriteMessage />}
        /> */}
          {/* <Route
          path="/fireplaces/:fireplaceId/messages/:stockingId/edit/decorate"
          element={<DecorateStocking />}
        /> */}
          {/* <Route path="/sent/:stockingId/edit" element={<WriteMessage />} /> */}
        </Routes>
      </BrowserRouter>
      {appTimeOut && (
        <Snowfall
          style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            zIndex: 10000,
          }}
          snowflakeCount={100}
        />
      )}
    </>
  );
};

export default Router;
