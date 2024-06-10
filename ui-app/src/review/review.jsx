import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Typography, Card, CardHeader, CardContent, Grid } from '@mui/material';

function Activity({ id }) {
  const [activities, setActivities] = useState([]); // Початкове значення - порожній масив
  const [games, setGames] = useState({}); // Словник для зберігання інформації про ігри

  useEffect(() => {
    if (id) {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(`http://localhost:8090/reviews/user?user_id=${id}`);
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
  }, [id]);

  return (
    <div>
      {activities.length > 0 ? (
        activities.map((activity) => {
          const game = games[activity.game_id];

          return (
            <Card key={activity.id} style={{ marginBottom: "10px" }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Avatar
                      variant="square"
                      src={game ? game.header_image : ''}
                      style={{ width: 60, height: 60 }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      Рецензія {id} про гру {game ? game.name : ''}
                    </Typography>
                    <Typography variant="body2">
                      Оцінка: {activity.rating}
                    </Typography>
                    <Typography variant="body2">
                      {activity.review_text}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Typography variant="body1">No activities found.</Typography>
      )}
    </div>
  );
}

export default Activity;
