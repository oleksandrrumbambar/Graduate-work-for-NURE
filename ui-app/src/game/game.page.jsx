import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import './game.page.css';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Grid from '@mui/material/Grid';

import GameGallery from './game-gallery/game.gallery';
import GameDescription from './game-description/game.description';
import GameHeader from './game-header/game.header';
import FriendActivity from './friend-activity/friend.activity';
import GameRating from './game-rating/game.rating';
import GameLanguage from './game-language/game.language';
import SystemRequirements from './system-requirements/system.requirements';

const Game = () => {
  const [gameData, setGameData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8050/game?id=${id}`)
      .then(response => {
        setGameData(response.data);
        setIsLoading(false);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching game data:', error);
        setIsLoading(false);
      });
  }, [id]);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!gameData) {
    return <div>Failed to load game data</div>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="game-page">
        <h1>{gameData.title}</h1>
        <div className="game-main-information">
          <GameDescription gameData={gameData} />
          <GameHeader gameData={gameData} />
        </div>
        <hr />
        <div>
          <Grid container>
            <Grid item xs={12} md={6}>
              <FriendActivity friendActivity={gameData.friend_activity} />
            </Grid>
            <Grid item xs={12} md={6}>
              <GameRating rating={gameData.rating} ageRatingImage={gameData.age_rating_image} ageRating={gameData.age_rating} />
            </Grid>
          </Grid>
        </div>
        <hr />
        <GameLanguage languages={gameData.languages} />
        <hr />
        <SystemRequirements systemRequirements={gameData.system_requirements} />
      </div>
    </ThemeProvider>
  );
};

export default Game;
