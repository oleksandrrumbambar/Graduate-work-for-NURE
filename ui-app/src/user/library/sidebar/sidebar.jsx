import React from 'react';
import './sidebar.css';

const games = [
  { id: 1, name: 'Batman: Arkham Asylum GOTY Edition', icon: 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/35140/e52f91ecb0d3f20263e96fe188de1bcc8c91643e.jpg', category: 'БІТМІН' },
  { id: 2, name: 'Batman: Arkham City GOTY', icon: 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/200260/746ecf3ce44b2525eb7ad643e76a3b60913d2662.jpg', category: 'БІТМІН' },
  { id: 3, name: 'Batman: Arkham Knight', icon: 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/208650/f6c2ce13796844750dfbd01685fb009eeac4bf70.jpg', category: 'БІТМІН' },
  { id: 4, name: 'Відьмак 2: Вбивці королів', icon: 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/20920/62dd5c627664df1bcabc47727c7dcd7ccab353e9.jpg', category: 'ВІДЬМАК' },
  { id: 5, name: 'Відьмак 3: Дикий гін', icon: 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/292030/6e43cb881e60712c3cccdd7f871baa56acf15328.jpg', category: 'ВІДЬМАК' },
  // Додайте інші ігри за потребою
];

const groupedGames = games.reduce((acc, game) => {
  if (!acc[game.category]) {
    acc[game.category] = [];
  }
  acc[game.category].push(game);
  return acc;
}, {});

function Sidebar() {
  return (
    <div className='sidebar'>
      <div className='search-bar'>
        <input type='text' placeholder='Пошук' />
      </div>
      {Object.keys(groupedGames).map(category => (
        <div className='category' key={category}>
          <h3>{category} ({groupedGames[category].length})</h3>
          <ul>
            {groupedGames[category].map(game => (
              <li key={game.id}>
                <img src={game.icon} alt={game.name} />
                {game.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
