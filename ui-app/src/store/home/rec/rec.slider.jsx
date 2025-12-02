import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
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
    carouselContainer: {
        width: '100%',
    },
    sideImage: {
        display: 'block',
        margin: 'auto',
        height: '195px',
        width: '100%',
        objectFit: 'cover'
    },
});


function RecSliderRecommendations() {
    const classes = useStyles();
    const userId = localStorage.getItem('id_user');

    const [recommendedGames, setRecommendedGames] = useState([]);
    const [activeMainImage, setActiveMainImage] = useState({});

    useEffect(() => {
        if (!userId) return;

        fetch(`http://localhost:8030/user/recommendations?user_id=${userId}`)
            .then(response => response.json())
            .then(data => {
                setRecommendedGames(data);

                const imgMap = {};
                data.forEach(game => {
                    const images = game.gallery?.filter(g => g.type === "image") || [];
                    if (images.length > 0) {
                        imgMap[game.id] = images[0].url;
                    }
                });

                setActiveMainImage(imgMap);
            })
            .catch(err =>
                console.error("Error fetching recommendations:", err)
            );
    }, [userId]);


    const handleMouseEnter = (gameId, imageUrl) => {
        setActiveMainImage(prev => ({
            ...prev,
            [gameId]: imageUrl,
        }));
    };
    console.log('useid', userId)
    console.log('recommendedGames', recommendedGames)

    return (
        <ThemeProvider theme={darkTheme}>
            <div className={classes.galleryContainer}>
                <Carousel className={classes.carouselContainer} showArrows autoPlay infiniteLoop>
                    {recommendedGames.map((game) => {
                        const onlyImages = game.gallery?.filter(g => g.type === "image") || [];

                        return (
                            <div key={game.id}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={8}>
                                        <Link to={`/game/${game.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                            <Card style={{ paddingLeft: "40px" }}>
                                                <CardMedia
                                                    component="img"
                                                    alt={game.name}
                                                    height="559px"
                                                    image={activeMainImage[game.id] || onlyImages[0]?.url}
                                                    title={game.name}
                                                />
                                            </Card>
                                        </Link>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Card style={{ paddingRight: "30px" }}>
                                            <CardContent>
                                                <Typography variant="h5" style={{ color: 'white' }}>
                                                    {game.name}
                                                </Typography>

                                                <Typography variant="body2" style={{ color: 'white' }}>
                                                    {game.genre?.join(', ') || "Жанр не вказано"}
                                                </Typography>

                                                <Typography variant="h6" gutterBottom style={{ color: 'white' }}>
                                                    {game.price ? `${game.price} ₴` : "Безкоштовно"}
                                                </Typography>

                                                <Grid container spacing={1}>
                                                    {onlyImages.slice(0, 4).map((item, idx) => (
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

                                                <Typography variant="body2" style={{ marginTop: '10px', color: 'white' }}>
                                                    Рекомендація для вас
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </div>
                        );
                    })}

                </Carousel>
            </div>
        </ThemeProvider>
    );
}

export default RecSliderRecommendations;
