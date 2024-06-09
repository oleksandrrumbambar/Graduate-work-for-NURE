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
import GameStatisticsPage from './store/statistic/statistic.store.page';
import PublisherPage from './publisher/publisher.page';
import LibraryPage from './user/library/library.page';
import Friend from './user/friend/friends.page';
import CartPage from './store/basket/basket';
import WishListPage from './store/wishlist/wishlist.page';
import NotFoundPage from './store/404/404';
import BackgroundVideo from './BackgroundVideo';
import PaymentConfirmationPage from './payment/payment.confirmation.page';

function AppRouter() {
  return (
    <div>
      <BackgroundVideo>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Authorisation />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/game/:id" element={<Game />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/friend" element={<Friend />} />
          <Route path='/search' element={<Search />} />
          <Route path='/payment' element={<PaymentPage />} />
          <Route path='/statisticstore' element={<GameStatisticsPage />} />
          <Route path='/publisher/:id' element={<PublisherPage />} />
          <Route path='/library' element={<LibraryPage />} />
          <Route path='/basket' element={<CartPage />} />
          <Route path='/wishlist' element={<WishListPage />} />
          <Route path='/confirmpay' element={<PaymentConfirmationPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </BackgroundVideo>
    </div>
  );
}

export default AppRouter;
