import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { styled } from '@mui/joy';

const useStyles = makeStyles({
    galleryContainer: {
        width: '100%',
        marginTop: '20px',
    },
    mainImage: {
        width: '100%',
        height: 'auto',
    },
    secondaryImage: {
        width: '100%',
        height: '100%',
    },
    carouselContainer: {
        width: '100%',
    },
    rightColumn: {
        paddingLeft: '10px',
    },
    sideImages: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    sideImage: {
        display: 'block',
        margin: 'auto',
        height: '120px',
        width: '100%',
        objectFit: 'cover'
    },
});

function TopSlider() {
    const classes = useStyles();
    const [topGames, setTopGames] = useState([]);

    useEffect(() => {
        // Викликати запит до сервера для отримання списку ігор
        fetch('http://localhost:8050/topgames')
            .then(response => response.json())
            .then(data => setTopGames(data))
            .catch(error => console.error('Помилка отримання ігор:', error));
    }, []);

    return (
        <div className={classes.galleryContainer}>
            <Carousel className={classes.carouselContainer} showArrows autoPlay infiniteLoop>
                {topGames.map((game, index) => (
                    <div key={game.id}>
                        <Grid container style={{ paddingLeft: '90px' }}>
                            <Grid item xs={12} md={4}>
                                <Link to={`/game/${game.id}`}>
                                    <Paper className={classes.gridItem}>
                                        <img src={game.header_image} alt={game.name} className={classes.mainImage} />
                                        <Typography variant="h6">{game.name}</Typography>
                                        <Typography variant="body1">{game.genre.join(', ')}</Typography>
                                        <Typography variant="h6">{game.price}</Typography>
                                    </Paper>
                                </Link>
                            </Grid>
                            <Grid container item xs={12} md={8} style={{ paddingLeft: '20px' }}>
                                <Grid item xs={12} md={9}>
                                    {game.gallery.slice(2, 3).map((item, idx) => (
                                        <img src={item.url} alt={`Gallery item ${idx}`} style={{ display: 'block', margin: 'auto', height: '380px', width: '100%', objectFit: 'cover' }} />
                                    ))}
                                </Grid>
                                <Grid item xs={12} md={3} className={classes.rightColumn}>
                                    <Grid className={classes.sideImages}>
                                        {game.gallery.slice(3, 6).map((item, idx) => (
                                            <Grid item xs={8} key={idx}>
                                                <Paper className={classes.gridItem}>
                                                    <img src={item.url} alt={`Gallery item ${idx}`} className={classes.sideImage} />
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}

export default TopSlider;
