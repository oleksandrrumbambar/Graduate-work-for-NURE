import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Typography, Grid, Avatar, Card, CardHeader, CardMedia, CardContent } from '@mui/material';

function PublisherPage() {
    const [games, setGames] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        console.log(id)

        // Виклик функції для отримання даних про видавця з сервера
        fetch(`http://localhost:8050/gamesbydeveloperorpublisher?name=${id}`)
            .then(response => response.json())
            .then(data => setGames(data))
            .catch(error => console.error('Error fetching publisher data:', error));
    }, []);

    if (!games) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* Заголовок сторінки */}
            <Typography variant="h3" gutterBottom>
                {id}
            </Typography>

            {/* Інформація про видавця */}
            <Grid container spacing={3} alignItems="center">
                <Grid item>
                    <Avatar alt={id} />
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1">
                        Кількість ігор: 4
                    </Typography>
                    <Typography variant="subtitle1">
                        Кількість покупців: 4
                    </Typography>
                </Grid>
            </Grid>

            {/* Коротка інформація про видавця */}
            <Typography variant="body1" style={{ marginTop: 20 }}>
                4
            </Typography>

            {/* Список ігор видавця */}
            <Typography variant="h5" gutterBottom style={{ marginTop: 20 }}>
                Ігри видавця {id}:
            </Typography>
            <Grid container spacing={3}>
                {games.map(game => (
                    <Grid item key={game.id} xs={12} sm={6} md={4}>
                        <Link to={`/game/${game.id}`}>
                        <Card>
                            <CardHeader title={game.name} />
                            <CardMedia
                                component="img"
                                image={game.header_image}
                                alt={game.name}
                            />
                            <CardContent>
                                <Typography variant="body2">
                                    Жанр: {game.genre.join(', ')}
                                </Typography>
                            </CardContent>
                        </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default PublisherPage;
