// Header.jsx
import React from 'react';
import './header.css';

function Header({ userRole }) {
  return (
    <header className="header">
      <div className="header__logo">
        <img src="https://store.akamai.steamstatic.com/public/shared/images/header/logo_steam.svg" alt="Steam Logo" />
      </div>
      <nav className="header__nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/authorisation">Login</a></li>
          {userRole === 'user' && <li><a href="/user">username</a></li>}
          {userRole === 'user' && <li><a href="/library">Library</a></li>}
          {userRole === 'admin' && <li><a href="/dashboard">Dashboard</a></li>}
          {userRole === 'publisher' && <li><a href="/statistic">Statistics</a></li>}
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
