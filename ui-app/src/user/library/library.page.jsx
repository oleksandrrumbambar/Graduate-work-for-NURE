import React, { useState, useEffect } from 'react';
import './library.page.css'; // Додамо файл стилів для оформлення
import Sidebar from './sidebar/sidebar';
import LibraryGrid from './grid/grid';

const games = [
  { id: 1, name: 'The Witcher 3', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg?t=1716793585', completion: '100%' },
  { id: 2, name: 'Cyberpunk 2077', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg?t=1715334241', completion: '100%' },
  { id: 3, name: 'Hades', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145360/header.jpg?t=1715722799', completion: '100%' },
  { id: 4, name: 'Half-Life 2', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/220/header.jpg?t=1699003213', completion: '100%' },
  { id: 5, name: 'Hotline Miami', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/219150/header.jpg?t=1686261983', completion: '100%' },
  // Додайте інші ігри за потребою
];

function LibraryPage() {
  return (
    <div className='library'>
      <Sidebar />
      <LibraryGrid />
    </div>
  );
}

export default LibraryPage;

