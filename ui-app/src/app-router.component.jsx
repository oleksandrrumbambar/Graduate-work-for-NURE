import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './store/home/home.page';
import About from './store/about/about.page';
import Authorisation from './user/authorisation/login/authorisation.page';
import Registration from './user/authorisation/registration/registration.page';
import Game from './game/game.page';
import Profile from './user/profile/profile.page';
import Search from './store/home/search/search.page';
import { Payment } from '@mui/icons-material';
import PaymentPage from './payment/payment';

function AppRouter() {
  return (
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Authorisation />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/game" element={<Game />} />
            <Route path="/profile" element={<Profile />} />
            <Route path='/search' element={<Search />} />
            <Route path='/payment' element={<PaymentPage />} />
          </Routes>
        </div>
  );
}

export default AppRouter;
