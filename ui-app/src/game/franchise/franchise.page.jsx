import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Typography, Grid, Card, CardHeader, CardMedia, CardContent } from '@mui/material';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#188a8d',
          },
    },
});

function FranchisePage() {
    const [games, setGames] = useState([]);
    const { id } = useParams();

    useEffect(() => {

        // Fetch all games
        fetch('http://localhost:8050/games')
            .then(response => response.json())
            .then(data => {
                // Filter games that belong to the same franchise
                const franchiseGames = data.filter(game => game.franchise === id);
                setGames(franchiseGames);
            })
            .catch(error => console.error('Error fetching games:', error));
    }, [id]);

    // Calculate the number of games and the total number of buyers
    const numberOfGames = games.length;
    const numberOfBuyers = games.reduce((total, game) => total + game.copies_sold, 0);

    if (games.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div style={{ padding: '20px' }}>
                {/* Page title */}
                <Typography variant="h3" gutterBottom align="center">
                    {id}
                </Typography>

                {/* Franchise information */}
                <Grid container spacing={3} justifyContent="center">
                    <Grid item>
                        <Typography variant="subtitle1">
                            Кількість ігор: {numberOfGames}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1">
                            Кількість покупців: {numberOfBuyers}
                        </Typography>
                    </Grid>
                </Grid>

                {/* Franchise games list */}
                <Typography variant="h5" gutterBottom style={{ marginTop: 20 }} align="center">
                    Ігри франшизи {id}:
                </Typography>
                <Grid container spacing={3} justifyContent="center" style={{ paddingBottom: '80px' }}>
                    {games.map(game => (
                        <Grid item key={game.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                            <Link to={`/game/${game.id}`} style={{ textDecoration: 'none' }}>
                                <Card>
                                    <CardHeader
                                        title={
                                            <Typography
                                                variant="h6"
                                                style={{
                                                    display: '-webkit-box',
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    WebkitLineClamp: 1,
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {game.name}
                                            </Typography>
                                        }
                                    />
                                    <CardMedia
                                        component="img"
                                        image={game.header_image}
                                        alt={game.name}
                                    />
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            style={{
                                                display: 'block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Жанр: {game.genre.join(', ')}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </div>
            <hr />
        </ThemeProvider>
    );
}

export default FranchisePage;
