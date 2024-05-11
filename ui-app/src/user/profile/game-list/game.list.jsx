import React from 'react';
import { Grid, Paper, Typography, Button, Card, CardMedia, CardContent, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery';

const games = [
    {
        id: 1,
        image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg?t=1641690932',
        name: 'Dota 2',
        genre: 'MOBA',
        reviews: 'Read Reviews'
    },
    {
        id: 2,
        image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg?t=1640094991',
        name: 'Counter-Strike 2',
        genre: 'FPS',
        reviews: 'Read Reviews'
    },
    {
        id: 3,
        image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg?t=1639064063',
        name: 'Rust',
        genre: 'Survival',
        reviews: 'Read Reviews'
    },
    {
      id: 4,
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/43110/header.jpg?t=1602318335',
      name: 'Metro 2033',
      genre: 'Survival Horror',
      reviews: 'Read Reviews'
    },
    {
      id: 5,
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1235140/header.jpg?t=1631096613',
      name: 'Yakuza',
      genre: 'Action-Adventure',
      reviews: 'Read Reviews'
    },
    {
      id: 6,
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/287700/header.jpg?t=1609769085',
      name: 'Metal Gear Solid V: The Phantom Pain',
      genre: 'Action-Adventure',
      reviews: 'Read Reviews'
    },
    {
      id: 7,
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1190460/header.jpg?t=1634870671',
      name: 'Death Stranding',
      genre: 'Action',
      reviews: 'Read Reviews'
    },
    {
      id: 8,
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/773790/header.jpg?t=1702118802',
      name: 'Ostriv',
      genre: 'City Builder',
      reviews: 'Read Reviews'
    }
];

function GameList() {
    return (
        <div className='game-list'>
        <Grid container spacing={3}>
            {games.map((game) => (
                <Grid item xs={12} sm={6} md={4} key={game.id}>
                    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <CardMedia
                            component="img"
                            sx={{ width: '100%', objectFit: 'cover', maxHeight: 300 }}
                            image={game.image}
                            alt={game.name}
                        />
                    </Card>
                </Grid>
            ))}
        </Grid>
        </div>
    );
}

export default GameList;