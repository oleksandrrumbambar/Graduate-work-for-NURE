import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './store/home/home.page';
import About from './store/about/about.page';
import Authorisation from './user/authorisation/login/authorisation.page';
import Registration from './user/authorisation/registration/registration.page';

function AppRouter() {
  return (
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Authorisation />} />
            <Route path="/registration" element={<Registration />} />
          </Routes>
        </div>
  );
}

export default AppRouter;
