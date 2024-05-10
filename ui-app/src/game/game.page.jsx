import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

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

function Game() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  window.onload = function () {
    var iframe = document.getElementById('myIframe');
    if (iframe) {
      iframe.onload = function () {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      };
    } else {
      console.error("Не вдалося знайти іфрейм з ідентифікатором 'myIframe'.");
    }
  };

  return (
    <div className="game-page">
      <h1>Yakuza 0</h1>
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
              <SwiperSlide className="gallery-slide">
                <video controls>
                  <source src="https://cdn.akamai.steamstatic.com/steam/apps/256724036/movie480.webm?t=1533131986" type="video/mp4" />
                  Ваш браузер не підтримує відео в HTML5.
                </video></SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_673bf61e19a07e6e0301b71b26d121281822c782.1920x1080.jpg?t=1713430221" alt="Yakuza 0" allowFullScreen /></SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_0b59c9984364e73a4d4413f50884d0ead3c81ab1.1920x1080.jpg?t=1713430221" alt="Yakuza 0" /></SwiperSlide>
              <SwiperSlide className="gallery-slide">
                <div className="div-suka" >
                  <img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_644c85a24f6d2710acc927072a30f70841ea955f.1920x1080.jpg?t=1713430221" alt="Yakuza 0" />
                </div>
              </SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_8c1431af6d1ae4a6ee3bdd10e326a7822713b24f.1920x1080.jpg?t=1713430221" alt="Yakuza 0" /></SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_bcda5d10659c03acb555330d6059681c3cdc72ee.1920x1080.jpg?t=1713430221" alt="Yakuza 0" /></SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_9b8553753141d10eca4a496d9187edb04221cd29.1920x1080.jpg?t=1713430221" alt="Yakuza 0" /></SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_3bcb648adcef82e720f8e678dbe98c9a189cdb77.1920x1080.jpg?t=1713430221" alt="Yakuza 0" /></SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_c2d149633c58b59db5c8947cb8f710d437e86e8d.1920x1080.jpg?t=1713430221" alt="Yakuza 0" /></SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_6a9abd6c744125f0bd9958cd017e2cffcdf79a8f.1920x1080.jpg?t=1713430221" alt="Yakuza 0" /></SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_0dc6c8021bef526e49c3a552f71542cc5842003d.1920x1080.jpg?t=1713430221" alt="Yakuza 0" /></SwiperSlide>
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
              <SwiperSlide className="gallery-slide">
                <video controls>
                  <source src="https://cdn.akamai.steamstatic.com/steam/apps/256724036/movie480.webm?t=1533131986" type="video/mp4" />
                  Ваш браузер не підтримує відео в HTML5.
                </video></SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_673bf61e19a07e6e0301b71b26d121281822c782.1920x1080.jpg?t=1713430221" alt="Yakuza 0" allowFullScreen /></SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_0b59c9984364e73a4d4413f50884d0ead3c81ab1.1920x1080.jpg?t=1713430221" alt="Yakuza 0" /></SwiperSlide>
              <SwiperSlide className="gallery-slide">
                <div className="div-suka" >
                  <img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_644c85a24f6d2710acc927072a30f70841ea955f.1920x1080.jpg?t=1713430221" alt="Yakuza 0" />
                </div>
              </SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_8c1431af6d1ae4a6ee3bdd10e326a7822713b24f.1920x1080.jpg?t=1713430221" alt="Yakuza 0" /></SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_bcda5d10659c03acb555330d6059681c3cdc72ee.1920x1080.jpg?t=1713430221" alt="Yakuza 0" /></SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_9b8553753141d10eca4a496d9187edb04221cd29.1920x1080.jpg?t=1713430221" alt="Yakuza 0" /></SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_3bcb648adcef82e720f8e678dbe98c9a189cdb77.1920x1080.jpg?t=1713430221" alt="Yakuza 0" /></SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_c2d149633c58b59db5c8947cb8f710d437e86e8d.1920x1080.jpg?t=1713430221" alt="Yakuza 0" /></SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_6a9abd6c744125f0bd9958cd017e2cffcdf79a8f.1920x1080.jpg?t=1713430221" alt="Yakuza 0" /></SwiperSlide>
              <SwiperSlide className="gallery-slide"><img loading="lazy" src="https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_0dc6c8021bef526e49c3a552f71542cc5842003d.1920x1080.jpg?t=1713430221" alt="Yakuza 0" /></SwiperSlide>
            </Swiper>
          </div>
          <div className='game-description-text'>
            <p>Жанр: Екшен, Пригодницька, Рольова гра</p>
            <h2>Опис</h2>
            <p>Блиск, гламур і нестримний декаданс 80-х повернулися в Yakuza 0.
              Пройдіться по Токіо та Осаці разом з головним героєм Кадзумою Кірю та постійним учасником серіалу Горо Мадзімою. Грайте за Кадзуму Кірю і дізнайтеся, як він потрапляє у світ неприємностей, коли просте стягнення боргу йде не так, як треба, а його мішень вбивають. Потім взуйте сріблясті черевики Горо Мадзіми і досліджуйте його "нормальне" життя власника кабаре-клубу.
              Миттєво перемикайтеся між трьома різними бойовими стилями і бийте всіляких бандитів, головорізів, хуліганів і покидьків. Виведіть бій на новий рівень, використовуючи об'єкти навколишнього середовища, такі як велосипеди, вивіски та двері автомобілів, для проведення комбінацій, що хрумтять кістками, і жорстоких нокаутів.
              Бійки - не єдиний спосіб вбити час у Японії 1988 року: від дискотек і клубів для дівчат до класичних аркад SEGA - у детально опрацьованому, освітленому неоновим світлі є безліч розваг, що відволікають увагу.
              Спілкуйтеся з колоритними мешканцями кварталу червоних ліхтарів: допоможіть домінатрікс садо-мазо освоїти свою професію або ж допоможіть вуличній артистці вчасно дістатися до туалету - на вас чекає 100 неймовірних історій.
            </p>
          </div>

        </div>
        <div className="game-header">
          <div className="game-info">
            <div className="game-image-buy">
              <img src="https://cdn.akamai.steamstatic.com/steam/apps/638970/header.jpg?t=1637700731" alt="Yakuza 0" />
              <div className="game-buy">
                <h2>Ціна 499 UAH</h2>
                <button className="button-add-to-cart">До кошика</button>
                <button className="button-add-to-wishlist">До списку бажаного</button>
              </div>
            </div>
            <div className="game-details">
              <p>Розробник: SEGA</p>
              <p>Видавець: SEGA</p>
              <p>Дата виходу: 1 серпня 2018</p>

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
              <div className="photo-wrapper">
                <img src="https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/2543050/46f19cb9da5693db5b5a46adf75c1779362bac27.gif" alt="Image 1" />
              </div>
              <div className="photo-wrapper">
                <img src="https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/2543050/46f19cb9da5693db5b5a46adf75c1779362bac27.gif" alt="Image 2" />
              </div>
              <div className="photo-wrapper">
                <img src="https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/2543050/46f19cb9da5693db5b5a46adf75c1779362bac27.gif" alt="Image 3" />
              </div>
              <div className="photo-wrapper">
                <img src="https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/2543050/46f19cb9da5693db5b5a46adf75c1779362bac27.gif" alt="Image 4" />
              </div>
              <div className="photo-wrapper">
                <img src="https://avatars.akamai.steamstatic.com/b6e7994994319dceaccb0906e717acb93777a948_full.jpg" alt="Image 5" />
              </div>
              <div className="photo-wrapper">
                <img src="https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/2543050/46f19cb9da5693db5b5a46adf75c1779362bac27.gif" alt="Image 6" />
              </div>
            </div>
            <h4>Ця гра є у бажаному друзів</h4>
            <div className="friend-grid">
              <div className="photo-wrapper">
                <img src="https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/2543050/46f19cb9da5693db5b5a46adf75c1779362bac27.gif" alt="Image 1" />
              </div>
              <div className="photo-wrapper">
                <img src="https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/2543050/46f19cb9da5693db5b5a46adf75c1779362bac27.gif" alt="Image 2" />
              </div>
              <div className="photo-wrapper">
                <img src="https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/2543050/46f19cb9da5693db5b5a46adf75c1779362bac27.gif" alt="Image 5" />
              </div>
              <div className="photo-wrapper">
                <img src="https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/2543050/46f19cb9da5693db5b5a46adf75c1779362bac27.gif" alt="Image 6" />
              </div>
            </div>
          </div>
        </div>
        <div className="half-width">
          <div className="container">
            <div className="half-width">
              <div className="assessment-div">
                <Box position="relative" display="inline-flex">
                  <CircularProgress determinate value={90} color="success" size="lg" variant="soft" />
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
                    <Typography variant="caption" component="div" color="textSecondary">
                      90
                    </Typography>
                  </Box>
                </Box>
                <p>Оцінка від крамниці</p>
              </div>
              <div className="assessment-div">
                <Box position="relative" display="inline-flex">
                  <CircularProgress determinate value={100} color="success" size="lg" variant="soft" />
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
                    <Typography variant="caption" component="div" color="textSecondary">
                      100
                    </Typography>
                  </Box>
                </Box>
                <p>Оцінка від друзів</p>
              </div>
              <div className="assessment-div">
                <Box position="relative" display="inline-flex">
                  <CircularProgress determinate value={82} color="success" size="lg" variant="soft" />
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
                    <Typography variant="caption" component="div" color="textSecondary">
                      82
                    </Typography>
                  </Box>
                </Box>
                <p>Оцінка від cпільноти</p>
              </div>
            </div>
            <div className="half-width">
              <img src='https://store.akamai.steamstatic.com/public/shared/images/game_ratings/PEGI/18.png?v=3' style={{ marginTop: "75px" }}></img>
              <p>Віковий рейтинг: 16</p>
            </div>
          </div>
        </div>
      </div>

      <hr></hr>

      <div className="game-language">
        <p>Мова голос: Японська</p>
        <p>Мова текст: Англійська, Японська</p>
      </div>
      <hr></hr>
      <div className="system-requirements">
        <div className="system-requirements-col">
          <h5>Мінімальні вимоги системи:</h5>
          <ul>
            <li>Операційна система: Windows 7</li>
            <li>Процесор: Intel Core i5-3470</li>
            <li>Оперативна пам'ять: 4 GB RAM</li>
            <li>Відеокарта: NVIDIA GeForce GTX 560</li>
            <li>Вільне місце на диску: 30 GB</li>
            <li>Додаткові примітки: DirectX 11</li>
          </ul>
        </div>
        <div className="system-requirements-col">
          <h5>Рекомендовані вимоги системи:</h5>
          <ul>
            <li>Операційна система: Windows 10</li>
            <li>Процесор: Intel Core i7-6700</li>
            <li>Оперативна пам'ять: 8 GB RAM</li>
            <li>Відеокарта: NVIDIA GeForce GTX 1070</li>
            <li>Вільне місце на диску: 30 GB</li>
            <li>Додаткові примітки: DirectX 11</li>
          </ul>
        </div>
        <div className="system-requirements-col">
          <h5>Ультра вимоги системи:</h5>
          <ul>
            <li>Операційна система: Windows 10</li>
            <li>Процесор: Intel Core i9-9900K</li>
            <li>Оперативна пам'ять: 16 GB RAM</li>
            <li>Відеокарта: NVIDIA GeForce RTX 3080</li>
            <li>Вільне місце на диску: 30 GB</li>
            <li>Додаткові примітки: DirectX 12</li>
          </ul>
        </div>
      </div>
      <hr></hr>
      <div>
        <div className='game-reviews'>
          <h3>Рецензії від друзів</h3>
          <Card>
            <CardHeader
              avatar={<Avatar src="https://avatars.akamai.steamstatic.com/b6e7994994319dceaccb0906e717acb93777a948_full.jpg" />}
              title='VDA_132'
              subheader='Рекомендовано'
            />
            <CardContent>
              <Typography variant="body1" component="p">
                Я в Слов'янську жив як Кірю
              </Typography>
            </CardContent>
          </Card>
        </div>
        <hr></hr>
        <div className='game-reviews'>
          <h3>Рецензії від спільноти</h3>

        </div>
      </div>
    </div>
  );
}

export default Game;