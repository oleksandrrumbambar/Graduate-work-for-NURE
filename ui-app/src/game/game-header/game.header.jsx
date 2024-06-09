import React from 'react';
import { Link } from 'react-router-dom';
import '../game.page.css';

const GameHeader = ({ gameData }) => {
  return (
    <div className="game-header">
      <div className="game-info">
        <div className="game-image-buy">
          <img src={gameData.header_image} alt={gameData.title} />
          <div className="game-buy">
            <h2>Ціна {gameData.price} UAH</h2>
            <button className="button-add-to-cart">До кошика</button>
            <button className="button-add-to-wishlist">До списку бажаного</button>
          </div>
        </div>
        <div className="game-details">
          <p>{gameData.short_description}</p>
          <p>
            Розробник: <Link to={`/publisher/${gameData.developer}`}>{gameData.developer}</Link>
          </p>
          <p>
            Видавець: <Link to={`/publisher/${gameData.publisher}`}>{gameData.publisher}</Link>
          </p>
          <p>Дата виходу: {gameData.release_date}</p>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
