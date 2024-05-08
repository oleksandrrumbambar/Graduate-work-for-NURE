import React from 'react';

function Profile() {
    return ( 
        <div className="user-profile">
        <div className="user-header">
          <img src="https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/2543050/46f19cb9da5693db5b5a46adf75c1779362bac27.gif" alt="User Avatar" />
          <div className="user-info">
            <h1>Slava_Ukrain_Hero_Slava</h1>
            <p>Status: Online</p>
            <p>Level: 50</p>
          </div>
        </div>
        <div className="user-games">
          <h2>Recent Games</h2>
          <ul>
            <li>Counter-Strike: Global Offensive</li>
            <li>PlayerUnknown's Battlegrounds</li>
            <li>Grand Theft Auto V</li>
          </ul>
        </div>
        </div>
    );
}

export default Profile;