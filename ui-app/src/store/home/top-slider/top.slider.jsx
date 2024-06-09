import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#188a8d',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: '#aaaaaa',
        },
    },
});

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
    const [activeMainImage, setActiveMainImage] = useState({});

    useEffect(() => {
        // Fetch the top games data
        fetch('http://localhost:8050/topgames')
            .then(response => response.json())
            .then(data => {
                setTopGames(data);
                const initialImages = {};
                data.forEach(game => {
                    initialImages[game.id] = game.gallery[2].url;
                });
                setActiveMainImage(initialImages);
            })
            .catch(error => console.error('Error fetching top games:', error));
    }, []);

    const handleMouseEnter = (gameId, imageUrl) => {
        setActiveMainImage(prevState => ({
            ...prevState,
            [gameId]: imageUrl,
        }));
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <div className={classes.galleryContainer}>
                <Carousel className={classes.carouselContainer} showArrows autoPlay infiniteLoop>
                    {topGames.map((game) => (
                        <div key={game.id}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={8}>
                                    <Link to={`/game/${game.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                        <Card style={{ paddingLeft: "40px"}}>
                                            <CardMedia
                                                component="img"
                                                alt={game.name}
                                                height="405px"
                                                image={activeMainImage[game.id]}
                                                title={game.name}
                                            />
                                        </Card>
                                    </Link>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card style={{ paddingRight: "30px"}}>
                                        <CardContent>
                                            <Typography variant="h5" color="textPrimary" style={{ color: 'white' }}>
                                                {game.name}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" style={{ color: 'white' }}>
                                                {game.genre.join(', ')}
                                            </Typography>
                                            <Typography variant="h6" color="textPrimary" gutterBottom style={{ color: 'white' }}>
                                                {game.price}
                                            </Typography>
                                            <Grid container spacing={1}>
                                                {game.gallery.slice(2, 6).map((item, idx) => (
                                                    <Grid item xs={6} key={idx}>
                                                        <img
                                                            src={item.url}
                                                            alt={`Gallery item ${idx}`}
                                                            className={classes.sideImage}
                                                            onMouseEnter={() => handleMouseEnter(game.id, item.url)}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                            <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px', color: 'white' }}>
                                                Новинка
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    ))}
                </Carousel>
            </div>
        </ThemeProvider>
    );
}

export default TopSlider;
