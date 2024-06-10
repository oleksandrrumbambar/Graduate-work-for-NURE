import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './library.page.css';
import Sidebar from './sidebar/sidebar';
import LibraryGrid from './grid/grid';

function LibraryPage() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Replace `id` with the actual user ID
        const id = 123; // Example user ID
        const userGamesResponse = await axios.get(`http://localhost:8070/user/games?user_id=${localStorage.getItem('id_user')}`);
        const userLibrary = userGamesResponse.data;

        if (!userLibrary || userLibrary.length === 0) {
          setGames([]); // If userLibrary is empty or undefined, clear the games list
          return;
        }

        const gamePromises = userLibrary.games.map((gameId) => (
          axios.get(`http://localhost:8050/game?id=${gameId}`)
        ));
        const gameResponses = await Promise.all(gamePromises);
        const gameData = gameResponses.map((response) => response.data);
        setGames(gameData);
      } catch (error) {
        setGames([]);
        console.error('Error fetching games:', error);
      }
    };
    fetchGames();
    }, []); // Empty dependency array to fetch games only once on component mount
    
    console.log(games);
  return (
    <div className='library'>
      <Sidebar games={games}/>
      <LibraryGrid games={games} />
    </div>
  );
}

export default LibraryPage;
