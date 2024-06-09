import React from 'react';
import { Container, Typography, Grid, Button, Card, CardMedia, CardContent, CardActions, TextField, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

const games = [
    {
        id: 1,
        name: "The Walking Dead: The Telltale Definitive Series",
        image: "https://via.placeholder.com/151",
        reviews: "УСІ РЕЦЕНЗІЇ: ВИКЛЮЧНО СХВАЛЬНІ",
        releaseDate: "29 ЖОВТ. 2020",
        discount: 75,
        price: 231,
        originalPrice: 925
    },
    {
        id: 2,
        name: "Devil May Cry 4 Special Edition",
        image: "https://via.placeholder.com/151",
        reviews: "УСІ РЕЦЕНЗІЇ: ДУЖЕ СХВАЛЬНІ",
        releaseDate: "23 ЧЕРВ. 2015",
        discount: 70,
        price: 236,
        originalPrice: 789
    },
    {
        id: 3,
        name: "Life is Strange: Before the Storm",
        image: "https://via.placeholder.com/151",
        reviews: "УСІ РЕЦЕНЗІЇ: ДУЖЕ СХВАЛЬНІ",
        releaseDate: "31 СІЧ. 2021",
        discount: 60,
        price: 199.60,
        originalPrice: 499
    }
];

function WishListPage() {
    return (
        <ThemeProvider theme={darkTheme}>
            <Container maxWidth="lg">
                <Box display="flex" alignItems="center" marginTop="20px">
                    <img src="https://via.placeholder.com/50" alt="Profile" style={{ borderRadius: '50%', marginRight: '20px' }} />
                    <Typography variant="h4" gutterBottom>
                        СПИСОК БАЖАНОГО
                    </Typography>
                </Box>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Шукати за назвою чи позначкою"
                    margin="normal"
                    InputProps={{
                        style: { backgroundColor: '#2f2f2f', borderRadius: '4px' }
                    }}
                />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        {games.map((game) => (
                            <Card key={game.id} sx={{ display: 'flex', marginBottom: '20px' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 151 }}
                                    image={game.image}
                                    alt={game.name}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <CardContent>
                                        <Typography component="h5" variant="h6">
                                            {game.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {game.reviews}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            ДАТА ВИХОДУ: {game.releaseDate}
                                        </Typography>
                                    </CardContent>
                                    <CardActions style={{ justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="textSecondary">
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>-{game.discount}%</span> {game.price}₴
                                            <span style={{ textDecoration: 'line-through', marginLeft: '10px' }}>{game.originalPrice}₴</span>
                                        </Typography>
                                        <Button size="small" color="primary">До кошика</Button>
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
