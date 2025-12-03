import React, { useState } from 'react';
import './sidebar.css';

function Sidebar({ games }) {
  const [searchTerm, setSearchTerm] = useState('');

  const groupedGames = games.reduce((acc, game) => {
    if (!acc[game.franchise]) {
      acc[game.franchise] = [];
    }
    acc[game.franchise].push(game);
    return acc;
  }, {});

  const filteredGames = Object.keys(groupedGames).reduce((acc, category) => {
    acc[category] = groupedGames[category].filter(game =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return acc;
  }, {});

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className='sidebar'>
      <div className='search-bar'>
        <input type='text' placeholder='Пошук' value={searchTerm} onChange={handleSearchChange} />
      </div>
      {Object.keys(filteredGames).map(category => (
        filteredGames[category].length > 0 && (
          <div className='category' key={category}>
            <h3>{category} ({filteredGames[category].length})</h3>
            <ul>
              {filteredGames[category].map(game => (
                <li key={game.id}>
                  {game.name}
                </li>
              ))}
            </ul>
          </div>
        )
      ))}
    </div>
  );
}

export default Sidebar;
