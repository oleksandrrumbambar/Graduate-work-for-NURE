import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Grid, Paper, Typography, Button, Card, CardMedia, CardContent, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery';

function GameList({ userLibrary }) {

    console.log(userLibrary)
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                if (!userLibrary || userLibrary.length === 0) {
                    return; // Перевірка, чи існує userLibrary та чи має воно елементи
                }
                //debugger
                const gamePromises = userLibrary.games.map((gameId) => (
                    axios.get(`http://localhost:8050/game?id=${gameId}`)
                ));
                const gameResponses = await Promise.all(gamePromises);
                const gameData = gameResponses.map((response) => response.data);
                setGames(gameData);
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };

        fetchGames();
    }, [userLibrary]);
    console.log(games)
    return (
        <div className='game-list'>
            <Grid container spacing={3}>
                {games.map((game) => (
                <Grid item xs={12} sm={6} md={4} key={game.id}>
                    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Link to={`/game/${game.id}`}>
                        <CardMedia
                            component="img"
                            sx={{ width: '100%', objectFit: 'cover', maxHeight: 300 }}
                            image={game.header_image}
                            alt={game.name}
                        />
                        </Link>
                    </Card>
                </Grid>
            ))}
            </Grid>
        </div>
    );
}

export default GameList;