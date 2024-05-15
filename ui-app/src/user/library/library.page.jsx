import React, { useState, useEffect } from 'react';

function GameDataReceiver() {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Асинхронна функція для отримання даних про гру
  const fetchGameData = async () => {
    try {
      const response = await fetch('https://example.com/api/games', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setGameData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Використовуємо useEffect для виклику fetchGameData при завантаженні компонента
  useEffect(() => {
    fetchGameData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {gameData ? (
        <div>
          <h1>{gameData.title}</h1>
          <p>{gameData.description}</p>
          {/* Додаткові дані про гру */}
        </div>
      ) : (
        <div>No game data found.</div>
      )}
    </div>
  );
}

export default GameDataReceiver;
