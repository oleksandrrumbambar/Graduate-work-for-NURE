import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Pagination, Navigation, Thumbs, FreeMode } from 'swiper/modules';
import '../game.page.css';
const GameGallery = ({ gallery, title }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
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
        className="gallery-swiper"
      >
        {gallery?.map((mediaItem, index) => (
          <SwiperSlide key={index} className="gallery-slide">
            {mediaItem.type === 'video' ? (
              <video controls>
                <source src={mediaItem.url} type="video/mp4" />
                Ваш браузер не підтримує відео в HTML5.
              </video>
            ) : (
              <img loading="lazy" src={mediaItem.url} alt={title} />
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
        {gallery?.map((mediaItem, index) => (
          <SwiperSlide key={index} className="gallery-slide">
            {mediaItem.type === 'video' ? (
              <video controls>
                <source src={mediaItem.url} type="video/mp4" />
                Ваш браузер не підтримує відео в HTML5.
              </video>
            ) : (
              <img loading="lazy" src={mediaItem.url} alt={title} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default GameGallery;
