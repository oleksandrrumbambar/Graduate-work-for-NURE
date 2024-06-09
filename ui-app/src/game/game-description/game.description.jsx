import React from 'react';
import GameGallery from '../game-gallery/game.gallery';
import '../game.page.css';

const GameDescription = ({ gameData }) => {
  return (
    <div className="game-description">
      <GameGallery gallery={gameData.gallery} title={gameData.title} />
      <div className='game-description-text'>
        <p>Жанр: {gameData.genre && gameData.genre.join(', ')}</p>
        <h2>Опис</h2>
        <p>{gameData.description}</p>
      </div>
    </div>
  );
};

export default GameDescription;
