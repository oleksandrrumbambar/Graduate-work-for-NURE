import React from 'react';
import { Typography, Grid, Avatar, Card, CardHeader, CardMedia, CardContent } from '@mui/material';

function PublisherPage() {
    // Припустимо, що ми маємо дані про видавця та його ігри
    const publisher = {
        name: 'Sony',
        avatar: 'https://avatars.akamai.steamstatic.com/40a85b52747a78b26e393e3f9e58f319194b1b33_full.jpg',
        gameCount: 10,
        customerCount: 500000,
        games: [
            { id: 1, title: 'The Last of Us Part II', previewImage: 'https://cdn.akamai.steamstatic.com/steam/apps/1888930/header.jpg?t=1705640438' },
            { id: 2, title: 'God of War', previewImage: 'https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg?t=1695758729' },
            { id: 3, title: 'Uncharted 4: A Thief\'s End', previewImage: 'https://cdn.akamai.steamstatic.com/steam/apps/1659420/header.jpg?t=1705616565' },
            { id: 4, title: 'Horizon Zero Dawn', previewImage: 'https://cdn.akamai.steamstatic.com/steam/apps/1151640/header.jpg?t=1709156384' },
            { id: 5, title: 'Bloodborne', previewImage: 'https://cdn.akamai.steamstatic.com/steam/apps/374320/header.jpg?t=1700587390' },
            { id: 6, title: 'Spider-Man', previewImage: 'https://cdn.akamai.steamstatic.com/steam/apps/374320/header.jpg?t=1700587390' }
        ],
        // Додамо коротку інформацію про видавця
        description: 'Sony Interactive Entertainment (SIE) is a multinational video game and digital entertainment company.'
    };

    return (
        <div>
            {/* Заголовок сторінки */}
            <Typography variant="h3" gutterBottom>
                {publisher.name}
            </Typography>

            {/* Інформація про видавця */}
            <Grid container spacing={3} alignItems="center">
                <Grid item>
                    <Avatar alt={publisher.name} src={publisher.avatar} />
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1">
                        Кількість ігор: {publisher.gameCount}
                    </Typography>
                    <Typography variant="subtitle1">
                        Кількість покупців: {publisher.customerCount}
                    </Typography>
                </Grid>
            </Grid>

            {/* Коротка інформація про видавця */}
            <Typography variant="body1" style={{ marginTop: 20 }}>
                {publisher.description}
            </Typography>

            {/* Список ігор видавця */}
            <Typography variant="h5" gutterBottom style={{ marginTop: 20 }}>
                Ігри видавця {publisher.name}:
            </Typography>
            <Grid container spacing={3}>
                {publisher.games.slice(0, 5).map(game => (
                    <Grid item key={game.id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardHeader title={game.title} />
                            <CardMedia
                                component="img"
                                image={game.previewImage}
                                alt={game.title}
                            />
                            <CardContent>
                                {/* Додайте додаткову інформацію, якщо потрібно */}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default PublisherPage;
