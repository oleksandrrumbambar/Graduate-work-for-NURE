import React from 'react';
import { Container, Typography, Grid, Button, Card, CardMedia, CardContent, CardActions, Select, MenuItem, Divider } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
    typography: {
        h6: {
            fontWeight: 'bold',
        },
    },
});

const products = [
    {
        id: 1,
        name: "Street Fighter™ 6",
        image: "https://via.placeholder.com/151",
        price: 1799,
        discount: 50
    },
    {
        id: 2,
        name: "MechWarrior 5: Mercenaries",
        image: "https://via.placeholder.com/151",
        price: 379,
        discount: 60
    }
];

function CartPage() {
    // Порахуйте загальну ціну
    const totalPrice = products.reduce((acc, curr) => acc + curr.price, 0);

    const handleRemoveFromCart = (productId) => {
        // Ваш код для видалення товару з кошика
        console.log(`Товар з ID ${productId} видалено з кошика`);
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
                            <Card key={product.id} sx={{ display: 'flex', marginBottom: '20px' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 151 }}
                                    image={product.image}
                                    alt={product.name}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <CardContent>
                                        <Typography component="h5" variant="h6">
                                            {product.name}
                                        </Typography>
                                    </CardContent>
                                    <CardActions style={{ justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="textSecondary">
                                            {product.price}₴
                                        </Typography>
                                        <div>
                                            <Button size="small" color="primary" onClick={() => handleRemoveFromCart(product.id)}>Вилучити</Button>
                                        </div>
                                    </CardActions>
                                </div>
                            </Card>
                        ))}
                        <Button component={RouterLink} to="/" variant="outlined" color="primary" style={{ marginTop: '20px' }}>
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
                                    Загальна вартість: {totalPrice}₴
                                </Typography>
                            </CardContent>
                        </Card>
                        <Button component={RouterLink} to="/payment" variant="outlined" color="primary" style={{ marginTop: '20px' }}>
                            Оплатити
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default CartPage;