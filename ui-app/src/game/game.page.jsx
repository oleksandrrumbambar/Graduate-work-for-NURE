import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './game.page.css';
// import required modules
import { Keyboard, Pagination, Navigation, Thumbs, FreeMode } from 'swiper/modules';
import { Card, CardContent, CardHeader, Avatar, Typography } from '@mui/material';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

function Game() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [gameData, setGameData] = useState({
    _id: {
      $oid: ""
    },
    name: "",
    genre: [],
    description: "",
    short_description: "",
    price: "",
    developer: "",
    publisher: "",
    release_date: "",
    rating: {
      store: 0,
      friends: 0,
      community: 0
    },
    age_rating: "",
    age_rating_image: "",
    languages: {
      voice: [],
      text: []
    },
    system_requirements: {
      minimum: {
        os: "",
        processor: "",
        memory: "",
        graphics: "",
        storage: "",
        notes: ""
      },
      recommended: {
        os: "",
        processor: "",
        memory: "",
        graphics: "",
        storage: "",
        notes: ""
      },
      ultra: {
        os: "",
        processor: "",
        memory: "",
        graphics: "",
        storage: "",
        notes: ""
      }
    },
    gallery: [],
    header_image: "",
    friend_activity: {
      own: [],
      wishlist: []
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8050/game?id=66689e219efeca30d2bf76eb')
      .then(response => {
        setGameData(response.data);
        setIsLoading(false);
        })
      .catch(error => {
        console.error('Error fetching game data:', error);
        setIsLoading(false);
      });
  }, []);
  console.log(gameData);
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
    <div className="game-page">
      <h1>{gameData.title}</h1>
      <div className="game-main-information">
        <div className="game-description">
          <div className="game-gallery">
            <Swiper
              style={{
                '--swiper-navigation-color': '#fff',
                '--swiper-pagination-color': '#fff',
              }}
              loop={true}
              slidesPerView={1}
              spaceBetween={30}
              keyboard={{
                enabled: true,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              modules={[Keyboard, Pagination, Navigation, Thumbs]}
              className="gallery-swiper">
              {gameData.gallery?.map((mediaItem, index) => (
                <SwiperSlide key={index} className="gallery-slide">
                  {mediaItem.type === 'video' ? (
                    <video controls>
                      <source src={mediaItem.url} type="video/mp4" />
                      Ваш браузер не підтримує відео в HTML5.
                    </video>
                  ) : (
                    <img loading="lazy" src={mediaItem.url} alt={gameData.title} />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
            <Swiper
              onSwiper={setThumbsSwiper}
              loop={true}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="gallery-swiper"
            >
              {gameData.gallery?.map((mediaItem, index) => (
                <SwiperSlide key={index} className="gallery-slide">
                  {mediaItem.type === 'video' ? (
                    <video controls>
                      <source src={mediaItem.url} type="video/mp4" />
                      Ваш браузер не підтримує відео в HTML5.
                    </video>
                  ) : (
                    <img loading="lazy" src={mediaItem.url} alt={gameData.title} />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className='game-description-text'>
            <p>Жанр: {gameData.genre && gameData.genre.join(', ')}</p>
            <h2>Опис</h2>
            <p>{gameData.description}</p>
          </div>
        </div>
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
              <p>Розробник: {gameData.developer}</p>
              <p>Видавець: {gameData.publisher}</p>
              <p>Дата виходу: {gameData.release_date}</p>
            </div>
          </div>
        </div>
      </div>
      <hr></hr>
      <div className="container">
        <div className="half-width">
          <div className="game-friend-activity">
            <h4>Ця гра є у ваших друзів</h4>
            <div className="friend-grid">
              {gameData.friend_activity.own?.map((friend, index) => (
                <div key={index} className="photo-wrapper">
                  <img src={friend} alt={`Friend ${index + 1}`} />
                </div>
              ))}
            </div>
            <h4>Ця гра є у бажаному друзів</h4>
            <div className="friend-grid">
              {gameData.friend_activity.wishlist?.map((friend, index) => (
                <div key={index} className="photo-wrapper">
                  <img src={friend} alt={`Friend ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="half-width">
          <div className="container">
            <div className="half-width">
              <div className="assessment-div">
                <Box position="relative" display="inline-flex">
                  <CircularProgress determinate value={gameData.rating.store} color="success" size="lg" variant="plain" />
                  <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="caption" component="div" color="white">
                      {gameData.rating.store}
                    </Typography>
                  </Box>
                </Box>
                <p>Оцінка від крамниці</p>
              </div>
              <div className="assessment-div">
                <Box position="relative" display="inline-flex">
                  <CircularProgress determinate value={gameData.rating.friends} color="success" size="lg" variant="plain" />
                  <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="caption" component="div" color="white">
                      {gameData.rating.friends}
                    </Typography>
                  </Box>
                </Box>
                <p>Оцінка від друзів</p>
              </div>
              <div className="assessment-div">
                <Box position="relative" display="inline-flex">
                  <CircularProgress determinate value={gameData.rating.community} color="success" size="lg" variant="plain" />
                  <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="caption" component="div" color="white">
                      {gameData.rating.community}
                    </Typography>
                  </Box>
                </Box>
                <p>Оцінка від cпільноти</p>
              </div>
            </div>
            <div className="half-width">
              <img src={gameData.age_rating_image} style={{ marginTop: "75px" }} alt="Age Rating" />
              <p>Віковий рейтинг: {gameData.age_rating}</p>
            </div>
          </div>
        </div>
      </div>

      <hr></hr>

      <div className="game-language">
        <p>Мова голос: {gameData.languages.voice && gameData.languages.voice.join(', ')}</p>
        <p>Мова текст: {gameData.languages.text && gameData.languages.text.join(', ')}</p>
      </div>

      <hr></hr>
      <div className="system-requirements">
        {Object.entries(gameData.system_requirements).map(([key, value]) => (
          <div className="system-requirements-col" key={key}>
            <h5>{key === 'minimum' ? 'Мінімальні вимоги системи:' : key === 'recommended' ? 'Рекомендовані вимоги системи:' : 'Ультра вимоги системи:'}</h5>
            <ul>
              {Object.entries(value).map(([requirement, detail]) => (
                <li key={requirement}>{requirement.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}: {detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <hr/>

      {/* <div className="game-reviews">
        <h4>Відгуки:</h4>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          {gameData.reviews?.map((review, index) => (
            <Card key={index} variant="outlined" sx={{ marginBottom: '20px' }}>
              <CardHeader
                avatar={<Avatar src={review.avatar} />}
                title={review.user}
                subheader={review.date}
                action={
                  <IconButton aria-label="add to favorites">
                    <FavoriteBorderRoundedIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography variant="body1">{review.content}</Typography>
              </CardContent>
            </Card>
          ))}
        </ThemeProvider>
      </div> */}
    </div>
  );
}

export default Game;
