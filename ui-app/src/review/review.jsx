import React, { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, Grid, Typography, TextField, Button, Paper, ThemeProvider, createTheme } from '@mui/material';
import axios from 'axios';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const ReviewPage = () => {
  const [gamesWithoutReviews, setGamesWithoutReviews] = useState([]);
  const [gamesWithReviews, setGamesWithReviews] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch games without reviews
    axios.get('/review/games/without-reviews')
      .then(response => setGamesWithoutReviews(response.data))
      .catch(error => console.error('Error fetching games without reviews:', error));

    // Fetch games with reviews
    axios.get('/review/games/with-reviews')
      .then(response => setGamesWithReviews(response.data))
      .catch(error => console.error('Error fetching games with reviews:', error));
  }, []);

  const handleGameSelect = (game, hasReview) => {
    setSelectedGame(game);
    if (hasReview) {
      // Fetch review for the selected game
      axios.get(`/review?user_id=userId&game_id=${game.id}`)
        .then(response => {
          const review = response.data[0];
          setReviewText(review.review_text);
          setRating(review.rating);
          setIsEditing(true);
        })
        .catch(error => console.error('Error fetching review:', error));
    } else {
      setReviewText('');
      setRating(0);
      setIsEditing(false);
    }
  };

  const handleReviewSubmit = () => {
    const review = {
      user_id: 'userId',
      game_id: selectedGame.id,
      review_text: reviewText,
      rating: rating,
    };

    axios.post('/review', review)
      .then(() => {
        setGamesWithoutReviews(gamesWithoutReviews.filter(game => game.id !== selectedGame.id));
        setGamesWithReviews([...gamesWithReviews, selectedGame]);
        setSelectedGame(null);
        setReviewText('');
        setRating(0);
      })
      .catch(error => console.error('Error submitting review:', error));
  };

  const handleReviewUpdate = () => {
    const review = {
      user_id: 'userId',
      game_id: selectedGame.id,
      review_text: reviewText,
      rating: rating,
    };

    axios.put(`/review?user_id=userId&game_id=${selectedGame.id}`, review)
      .then(() => {
        setSelectedGame(null);
        setReviewText('');
        setRating(0);
        setIsEditing(false);
      })
      .catch(error => console.error('Error updating review:', error));
  };

  const handleReviewDelete = () => {
    axios.delete(`/review?user_id=userId&game_id=${selectedGame.id}`)
      .then(() => {
        setGamesWithReviews(gamesWithReviews.filter(game => game.id !== selectedGame.id));
        setGamesWithoutReviews([...gamesWithoutReviews, selectedGame]);
        setSelectedGame(null);
        setReviewText('');
        setRating(0);
        setIsEditing(false);
      })
      .catch(error => console.error('Error deleting review:', error));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6">Games Without Reviews</Typography>
              {gamesWithoutReviews.map(game => (
                <Box key={game.id} onClick={() => handleGameSelect(game, false)} style={{ cursor: 'pointer', margin: '8px 0' }}>
                  {game.name}
                </Box>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper style={{ padding: 16 }}>
              {selectedGame ? (
                <>
                  <Typography variant="h6">Review for {selectedGame.name}</Typography>
                  <TextField
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    label="Review Text"
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    style={{ margin: '8px 0' }}
                  />
                  <TextField
                    type="number"
                    variant="outlined"
                    fullWidth
                    label="Rating"
                    value={rating}
                    onChange={e => setRating(e.target.value)}
                    style={{ margin: '8px 0' }}
                  />
                  {isEditing ? (
                    <>
                      <Button variant="contained" color="primary" onClick={handleReviewUpdate} style={{ marginRight: 8 }}>
                        Update Review
                      </Button>
                      <Button variant="contained" color="error" onClick={handleReviewDelete}>
                        Delete Review
                      </Button>
                    </>
                  ) : (
                    <Button variant="contained" color="primary" onClick={handleReviewSubmit}>
                      Submit Review
                    </Button>
                  )}
                </>
              ) : (
                <Typography variant="body1">Select a game to review</Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6">Games With Reviews</Typography>
              {gamesWithReviews.map(game => (
                <Box key={game.id} onClick={() => handleGameSelect(game, true)} style={{ cursor: 'pointer', margin: '8px 0' }}>
                  {game.name}
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default ReviewPage;
