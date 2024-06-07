// Header.jsx
import React, { useState } from 'react';
import './header.css';
import { Link } from "react-router-dom";
import { useAuth } from '../../user/authorisation/auth.context';

function Header() {
  const { userRole, handleSignOut } = useAuth();


  return (
    <header className="header">
      <div className="header__logo">
        {/*<img src="https://store.akamai.steamstatic.com/public/shared/images/header/logo_steam.svg" alt="Steam Logo" />*/}
      </div>
      <nav className="header__nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          {userRole === 'authorized' ? (
            <>
              <li><Link to={`/profile/${localStorage.getItem('id_user')}`}>{localStorage.getItem('user_name')}</Link></li>
              <li><Link to="/library">Library</Link></li>
              <li><Link to="/friend">Friend</Link></li>
              <li><Link to="/"><button onClick={handleSignOut}>Sign Out</button></Link></li>
            </>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
         <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
