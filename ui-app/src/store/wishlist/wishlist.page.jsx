import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Button, Card, CardMedia, CardContent, CardActions, TextField, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Link, useNavigate  } from "react-router-dom";
import axios from 'axios'; // Імпортуйте axios

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#188a8d',
        },
    },
    typography: {
        h6: {
            fontWeight: 'bold',
        },
    },
});

function WishListPage() {
    const [wishlist, setWishlist] = useState([]);
    const [gamesInfo, setGamesInfo] = useState([]);
    const [userAvatar, setUserAvatar] = useState(""); 
    const [userName, setUserName] = useState(""); 
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('id_user');

        fetch(`http://localhost:8070/user/gamesWishlist?user_id=${userId}`)
            .then(response => response.json())
            .then(data => setWishlist(data.games))
            .catch(error => console.error('Error fetching wishlist:', error));

        // Запит на сервер для отримання даних користувача та встановлення аватара
        axios.get(`http://localhost:8070/user?user_id=${userId}`)
            .then(response => {
                const userData = response.data;
                setUserAvatar(userData.avatar);
                setUserName(userData.game_name);
            })
            .catch(error => console.error('Error fetching user data:', error));
    }, []);

    useEffect(() => {
        const fetchGameInfo = async () => {
            const promises = wishlist.map(gameId =>
                fetch(`http://localhost:8050/game?id=${gameId}`)
                    .then(response => response.json())
            );
            const gamesData = await Promise.all(promises);
            setGamesInfo(gamesData);
        };

        fetchGameInfo();
    }, [wishlist]);

    const handleRemoveFromWishlist = (gameId) => {
        const userId = localStorage.getItem('id_user');
        fetch(`http://localhost:8070/wishlist/remove?user_id=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ game_id: gameId }),
        })
        .then(response => response.json())
        .then(() => {
            // Оновлення списку бажаного після видалення гри
            const updatedWishlist = wishlist.filter(id => id !== gameId);
            setWishlist(updatedWishlist);
        })
        .catch(error => console.error('Error removing game from wishlist:', error));
    };

    const handleAddToBasket = (gameId) => {
        const userId = localStorage.getItem('id_user');
        fetch(`http://localhost:8070/basket?user_id=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ game_id: gameId }),
        })
            .then(() => {
                navigate(`/basket`);
            })
            .catch(error => console.error('Error adding to basket:', error));
    };

    // Функція для фільтрації списку ігор за текстом пошуку
    const filterGamesBySearchText = (games) => {
        return games.filter(game =>
            game.name.toLowerCase().includes(searchText.toLowerCase())
        );
    };
    
    return (
        <ThemeProvider theme={darkTheme}>
            <Container maxWidth="lg">
                <Box display="flex" alignItems="center" marginTop="20px">
                    <img src={userAvatar} alt="Profile" style={{ borderRadius: '50%', marginRight: '20px', width: '80px' }} />
                    <Typography variant="h4" gutterBottom color={"white"}>
                        СПИСОК БАЖАНОГО {userName}
                    </Typography>
                </Box>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Шукати за назвою"
                    margin="normal"
                    InputProps={{
                        style: { backgroundColor: '#2f2f2f', borderRadius: '4px' }
                    }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)} // Оновлення тексту пошуку при зміні введення користувача
                />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        {filterGamesBySearchText(gamesInfo).map((game) => (
                            <Card key={game.id} sx={{ display: 'flex', marginBottom: '20px' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 300 }}
                                    image={game.header_image}
                                    alt={game.name}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <CardContent>
                                        <Typography component="h4" variant="h4">
                                            {game.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {game.reviews}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            ДАТА ВИХОДУ: {game.release_date}
                                        </Typography>
                                    </CardContent>
                                    <CardActions disableSpacing>
                                        <Typography variant="h4" color="textSecondary">
                                            <span style={{ marginLeft: '10px' }}>{game.price}₴</span>
                                        </Typography>
                                        <div style={{ marginLeft: 'auto' }}>
                                            <Button size="small" color="primary"
                                                onClick={() => handleAddToBasket(game.id)}
                                            >До кошика</Button>
                                            <Button 
                                                size="small" 
                                                color="primary" 
                                                onClick={() => handleRemoveFromWishlist(game.id)}
                                            >
                                                Вилучити
                                            </Button>
                                        </div>
                                    </CardActions>
                                </div>
                            </Card>
                        ))}
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default WishListPage;