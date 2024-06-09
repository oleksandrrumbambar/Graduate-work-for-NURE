import React from 'react';
import '../game.page.css';

const GameLanguage = ({ languages }) => {
  return (
    <div className="game-language">
      <p>Мова голос: {languages.voice && languages.voice.join(', ')}</p>
      <p>Мова текст: {languages.text && languages.text.join(', ')}</p>
    </div>
  );
};

export default GameLanguage;
