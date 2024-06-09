import React from 'react';
import '../game.page.css';

const FriendActivity = ({ friendActivity }) => {
  return (
    <div>
      <div className="game-friend-activity">
        <h4>Ця гра є у ваших друзів</h4>
        <div className="friend-grid">
          {friendActivity.own?.map((friend, index) => (
            <div key={index} className="photo-wrapper">
              <img src={friend} alt={`Friend ${index + 1}`} />
            </div>
          ))}
        </div>
        <h4>Ця гра є у бажаному друзів</h4>
        <div className="friend-grid">
          {friendActivity.wishlist?.map((friend, index) => (
            <div key={index} className="photo-wrapper">
              <img src={friend} alt={`Friend ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendActivity;
