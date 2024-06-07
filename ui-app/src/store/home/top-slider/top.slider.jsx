import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

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
        height: '70%',
        objectFit: 'cover',
    },
});

function TopSlider() {
    const classes = useStyles();
    const [games, setGames] = useState([]);
    const [topGames, setTopGames] = useState([]);

    useEffect(() => {
        // Fetch games data
        fetch('http://localhost:8050/games')
          .then(response => response.json())
          .then(data => {
            // Log the raw data for debugging
            console.log('Fetched data:', data);
    
            // Convert copies_sold to numbers if needed and sort the games
            const sortedGames = data.sort((a, b) => {
              const copiesSoldA = parseInt(a.copies_sold, 10);
              const copiesSoldB = parseInt(b.copies_sold, 10);
              return copiesSoldB - copiesSoldA;
            });
    
            // Log the sorted data for debugging
            console.log('Sorted games:', sortedGames);
    
            // Get top 5 best-selling games
            const topFiveGames = sortedGames.slice(0, 5);
            setTopGames(topFiveGames);
    
            // Log the top 5 games for debugging
            console.log('Top 5 games:', topFiveGames);
          })
          .catch(error => console.error('Error fetching games:', error));
      }, []);

    return (
        <div className={classes.galleryContainer}>
            <Carousel className={classes.carouselContainer} showArrows autoPlay /*infiniteLoop*/>
                {topGames.map((game, index) => (
                    <div key={game.id}>
                        <Grid container style={{ paddingLeft: '40px' }}>
                            <Grid item xs={12} md={4}>
                                <Paper className={classes.gridItem}>
                                    <img src={game.header_image} alt={game.name} className={classes.mainImage} />
                                    <Typography variant="h6">{game.name}</Typography>
                                    <Typography variant="body1">{game.genre.join(', ')}</Typography>
                                    <Typography variant="h6">{game.price}</Typography>
                                </Paper>
                            </Grid>
                            <Grid container item xs={12} md={8} style={{ paddingLeft: '20px' }}>
                                <Grid item xs={12} md={9}>
                                    <Grid item xs={8}>
                                        {game.gallery.slice(2, 3).map((item, idx) => (
                                            <img src={item.url} alt={`Gallery item ${idx}`} />
                                        ))}
                                    </Grid>
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
