import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Grid, Card, CardMedia } from '@mui/material';

function GameList({ userLibrary }) {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                if (!userLibrary || userLibrary.length === 0) {
                    setGames([]); // Якщо userLibrary порожній або невизначений, очистіть список ігор
                    return;
                }
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
