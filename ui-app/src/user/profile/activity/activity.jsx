import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Typography, Card, CardContent, Grid, Box } from '@mui/material';

function Activity({ userData }) {
  const [activities, setActivities] = useState([]); // Початкове значення - порожній масив
  const [games, setGames] = useState({}); // Словник для зберігання інформації про ігри

  useEffect(() => {
    if (userData.user_id) {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(`http://localhost:8090/reviews/user?user_id=${userData.user_id}`);
          const reviews = response.data || [];
          setActivities(reviews);

          // Збір всіх gameIds
          const gameIds = reviews.map((review) => review.game_id);

          // Отримання інформації про всі ігри
          const gamePromises = gameIds.map((gameId) => axios.get(`http://localhost:8050/game?id=${gameId}`));
          const gameResponses = await Promise.all(gamePromises);
          const gamesData = gameResponses.reduce((acc, gameResponse) => {
            acc[gameResponse.data.id] = gameResponse.data;
            return acc;
          }, {});

          setGames(gamesData);
        } catch (error) {
          console.error('Error fetching reviews or games:', error);
          setActivities([]); // Якщо виникла помилка, встановлюємо порожній масив
        }
      };

      fetchReviews();
    }
  }, [userData.user_id]);

  return (
    <div>
      {activities.length > 0 ? (
        activities.map((activity) => {
          const game = games[activity.game_id];

          return (
            <Card key={activity.id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Avatar
                      variant="square"
                      src={game ? game.header_image : ''}
                      sx={{ width: 215, height: 95 }}
                    />
                  </Grid>
                  <Grid item xs={9}>
                    <Box>
                      <Typography variant="h6">
                        Рецензія {userData.game_name} про гру {game ? game.name : ''}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Оцінка: {activity.rating}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {activity.review_text}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Typography variant="body1">Немає активностей.</Typography>
      )}
    </div>
  );
}

export default Activity;