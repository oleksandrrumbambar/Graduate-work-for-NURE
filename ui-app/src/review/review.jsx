import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Grid, Card, CardMedia, Typography, Container, CssBaseline, TextField, Button, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#188a8d',
        },
    },
});

const fetchGamesData = async (gameIds) => {
    const gamePromises = gameIds.map((gameId) => (
        axios.get(`http://localhost:8050/game?id=${gameId}`)
    ));
    const gameResponses = await Promise.all(gamePromises);
    return gameResponses.map((response) => response.data);
};

function GameList() {
    const [gamesWithoutReviews, setGamesWithoutReviews] = useState([]);
    const [gamesWithReviews, setGamesWithReviews] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const fetchGameLists = async () => {
            try {
                const userId = localStorage.getItem('id_user'); // Replace with actual user ID
                const response = await axios.get(`http://localhost:8090/review/users/games?user_id=${userId}`);
                const { gamesWithReviews: withReviews, gamesWithoutReviews: withoutReviews } = response.data;

                const [withoutReviewGamesData, withReviewGamesData] = await Promise.all([
                    fetchGamesData(withoutReviews),
                    fetchGamesData(withReviews),
                ]);

                setGamesWithoutReviews(withoutReviewGamesData);
                setGamesWithReviews(withReviewGamesData);
            } catch (error) {
                console.error('Error fetching game lists:', error);
            }
        };

        fetchGameLists();
    }, []);

    const handleGameClick = async (game) => {
        setSelectedGame(game);
        setReview('');
        setRating(0);
        setIsEditMode(!!game.review_text); // Check if game has a review already

        try {
            //debugger
            const userId = localStorage.getItem('id_user'); // Replace with actual user ID
            const response = await axios.get(`http://localhost:8090/review?user_id=${userId}&game_id=${game.id}`);
            // Дістаємо review_text та rating з відповіді, де game_id === game.id
            const { review_text, rating } = response.data.find(review => review.game_id === game.id) || {};
            setReview(review_text || '');
            setRating(rating || 0);

            // Оновлюємо isEditMode в залежності від наявності рецензії
            setIsEditMode(!!review_text);
        } catch (error) {
            console.error('Error fetching review:', error);
        }
    };

    const handleSubmitReview = async () => {
        try {
            //debugger
            const userId = localStorage.getItem('id_user'); // Replace with actual user ID
            const gameId = selectedGame.id;
            if (isEditMode) {
                //debugger
                await axios.put(`http://localhost:8090/review?user_id=${userId}&game_id=${gameId}`, {
                    review_text: review,
                    rating: parseInt(rating)
                });
            } else {
                await axios.post(`http://localhost:8090/review`, {
                    user_id: userId,
                    game_id: gameId,
                    review_text: review,
                    rating: parseInt(rating)
                });
            }
            // Refresh game list after review submission
            handleGameClick(selectedGame);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleDeleteReview = async () => {
        try {
            const userId = localStorage.getItem('id_user'); // Replace with actual user ID
            const gameId = selectedGame.id;
            await axios.delete(`http://localhost:8090/review?user_id=${userId}&game_id=${gameId}`);
            // Refresh game list after review deletion
            handleGameClick(selectedGame);
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Container>
                <Typography variant="h4" gutterBottom align="center">Games</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <Typography variant="h5" gutterBottom align="center">Games Without Reviews</Typography>
                        <Grid container direction="column" spacing={2}>
                            {gamesWithoutReviews.map((game) => (
                                <Grid item key={game.id}>
                                    <Card sx={{ cursor: 'pointer' }} onClick={() => handleGameClick(game)}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: '100%', objectFit: 'cover' }}
                                            image={game.header_image}
                                            alt={game.name}
                                        />
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            {selectedGame ? (
                                <>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: '100%', objectFit: 'cover', maxHeight: 300 }}
                                        image={selectedGame.header_image}
                                        alt={selectedGame.name}
                                    />
                                    <TextField
                                        label="Write your review"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        sx={{ mt: 2 }}
                                    />
                                    <TextField
                                        type="number"
                                        label="Rating (0-100)"
                                        fullWidth
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                        sx={{ mt: 2 }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmitReview}
                                        sx={{ mt: 2 }}
                                    >
                                        {isEditMode ? 'Update Review' : 'Submit Review'}
                                    </Button>
                                    {isEditMode  && (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={handleDeleteReview}
                                            sx={{ mt: 2 }}
                                        >
                                            Delete Review
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <Typography variant="h6" align="center">
                                    Select a game to write a review
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Typography variant="h5" gutterBottom align="center">Games With Reviews</Typography>
                        <Grid container direction="column" spacing={2}>
                            {gamesWithReviews.map((game) => (
                                <Grid item key={game.id}>
                                    <Card onClick={() => handleGameClick(game)}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: '100%', objectFit: 'cover' }}
                                            image={game.header_image}
                                            alt={game.name}
                                        />
                                    </Card>
                                </Grid>

                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container >
        </ThemeProvider >
    );
}

export default GameList;
