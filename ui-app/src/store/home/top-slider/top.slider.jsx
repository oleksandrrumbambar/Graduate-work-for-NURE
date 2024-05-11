import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { makeStyles } from '@mui/styles';
import { Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';
import "./top.slider.css"

function TopSlider({ games }) {
    return (
        <div className="swiper-container">
            <Swiper slidesPerView={1} spaceBetween={10}>
                {games.map((game, index) => (
                    <SwiperSlide key={index}>
                        <Card className="swiper-root">
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <CardMedia
                                        className="swiper-media"
                                        image={game.bigPreview}
                                        title={game.title}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CardContent className="swiper-content">
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {game.title}
                                        </Typography>
                                        <Grid container spacing={1} className="small-previews">
                                            {game.smallPreviews.map((preview, idx) => (
                                                <Grid key={idx} item xs={3}>
                                                    <img src={preview} alt={`Preview ${idx + 1}`} className="small-preview" />
                                                </Grid>
                                            ))}
                                        </Grid>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            Price: {game.price}
                                        </Typography>
                                    </CardContent>
                                </Grid>
                            </Grid>
                        </Card>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default TopSlider;
