import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Button, Card, CardMedia, CardContent, CardActions, Select, MenuItem, Divider } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios'; // Імпортуйте axios
import { useLocation } from 'react-router-dom';

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

function CartPage() {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [basket, setBasket] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    useEffect(() => {
        const userId = localStorage.getItem('id_user');

        fetch(`http://localhost:8070/user/gamesBasket?user_id=${userId}`)
            .then(response => response.json())
            .then(data => setBasket(data.games))
            .catch(error => console.error('Error fetching wishlist:', error));
    }, []);

    useEffect(() => {
        const fetchGameInfo = async () => {
            const promises = basket.map(gameId =>
                fetch(`http://localhost:8050/game?id=${gameId}`)
                    .then(response => response.json())
            );
            const gamesData = await Promise.all(promises);
            setProducts(gamesData);
        };
        setTotalPrice(parseInt(products.reduce((acc, curr) => acc + parseInt(curr.price), 0), 10));
        fetchGameInfo();
    }, [basket]);

    const handleRemoveFromCart = (gameId) => {
        const userId = localStorage.getItem('id_user');
        fetch(`http://localhost:8070/basket/remove?user_id=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ game_id: gameId }),
        })
            .then(() => {
                // Оновлення списку бажаного після видалення гри
                const updatedBasket = basket.filter(id => id !== gameId);
                setBasket(updatedBasket);
            })
            .catch(error => console.error('Error removing game from basket:', error));
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Container maxWidth="lg" sx={{ marginTop: '20px' }}>
                <Typography variant="h4" color={"white"} gutterBottom>
                    Ваш кошик
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        {products.map((product) => (
                            <Card key={product.id} sx={{ display: 'flex', marginBottom: '40px' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 300 }}
                                    image={product.header_image}
                                    alt={product.name}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <CardContent>
                                        <Typography component="h5" variant="h6">
                                            {product.name}
                                        </Typography>
                                    </CardContent>
                                    <CardActions style={{ justifyContent: 'space-between' }}>
                                        <Typography variant="h5" color="textSecondary">
                                            {product.price}₴
                                        </Typography>
                                        <div>
                                            <Button size="small" color="primary" onClick={() => handleRemoveFromCart(product.id)}>Вилучити</Button>
                                        </div>
                                    </CardActions>
                                </div>
                            </Card>
                        ))}
                        <Button component={RouterLink} to="/" variant="contained" color="primary" style={{ marginTop: '20px', marginBottom: '400px' }}>
                            Назад до крамниці
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Попередній підсумок
                                </Typography>
                                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                                    Загальна вартість: {parseInt(products.reduce((acc, curr) => acc + parseInt(curr.price), 0), 10)}₴
                                </Typography>
                            </CardContent>
                        </Card>
                        <Button
                            component={RouterLink}
                            to={{ pathname: "/payment" }}
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                localStorage.setItem('basket', JSON.stringify(basket));
                                localStorage.setItem('price', parseInt(products.reduce((acc, curr) => acc + parseInt(curr.price), 0), 10));
                            }}
                            style={{ marginTop: '20px' }}
                        >
                            Оплатити
                        </Button>
                    </Grid>
                </Grid>
            </Container>
            <hr style={{marginTop: '20px'}}></hr>
        </ThemeProvider>
    );
}

export default CartPage;
