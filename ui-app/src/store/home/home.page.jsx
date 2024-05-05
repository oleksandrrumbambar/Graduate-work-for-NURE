// Home.jsx
import React from 'react';
import './home.page.css';

const getRandomImage = () => {
  const images = [
    'https://cdn.akamai.steamstatic.com/steam/apps/1774580/header.jpg?t=1701206599',
    'https://cdn.akamai.steamstatic.com/steam/apps/275850/header.jpg?t=1701206599',
    'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg?t=1701206599',
    'https://cdn.akamai.steamstatic.com/steam/apps/381210/header.jpg?t=1701206599',
    'https://cdn.akamai.steamstatic.com/steam/apps/275850/header.jpg?t=1701206599', // Просто додавання кількох посилань для прикладу
  ];
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

function Home() {
  return (
    <div className="home">
        <div className="search-container">
            <input type="text" placeholder="Пошук..." />
            <button>Пошук</button>
        </div>
        <section className="home-section">
            <h2>Топ 10 ігор по знижках</h2>
            <div className="games-list">
                {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="game-item">
                    <img src={getRandomImage()} alt={`Game ${i + 1}`} />
                    <p>Назва гри {i + 1}</p>
                    <p>Знижка: 50%</p>
                </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2>Топ 10 ігор по популярності</h2>
        <div className="games-list">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="game-item">
              <img src={getRandomImage()} alt={`Game ${i + 1}`} />
              <p>Назва гри {i + 1}</p>
              <p>Рейтинг: 4.5</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2>Топ 10 ігор по смаках користувача</h2>
        <div className="games-list">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="game-item">
              <img src={getRandomImage()} alt={`Game ${i + 1}`} />
              <p>Назва гри {i + 1}</p>
              <p>Категорія: Екшен</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
