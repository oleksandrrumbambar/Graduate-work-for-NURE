// Header.jsx
import React from 'react';
import './header.css';
import { Link } from "react-router-dom";

function Header({ userRole }) {
  return (
    <header className="header">
      <div className="header__logo">
      {/*<img src="https://store.akamai.steamstatic.com/public/shared/images/header/logo_steam.svg" alt="Steam Logo" />*/}
      </div>
      <nav className="header__nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          { /*{userRole === 'user' && <li><Link to="/user">username</Link></li>}
          {userRole === 'user' && <li><Link to="/library">Library</Link></li>}
          {userRole === 'admin' && <li><Link to="/dashboard">Dashboard</Link></li>}
          {userRole === 'publisher' && <li><Link to="/statistic">Statistics</Link></li>} */}
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
