import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Typography, Card, CardContent, Grid, Box } from '@mui/material';

function ReviewGamePage({ gameData }) {
  const [activities, setActivities] = useState([]); // Початкове значення - порожній масив

  useEffect(() => {
    if (gameData) {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(`http://localhost:8090/reviews/game?game_id=${gameData.id}`);
          const reviews = response.data || [];
          setActivities(reviews);
        } catch (error) {
          console.error('Error fetching reviews:', error);
          setActivities([]); // Якщо виникла помилка, встановлюємо порожній масив
        }
      };

      fetchReviews();
    }
  }, [gameData]);

  return (
    <div>
      {activities.length > 0 ? (
        activities.map((activity) => {
          return <Comment key={activity.id} activity={activity} />;
        })
      ) : (
        <Typography variant="body1">Немає активностей.</Typography>
      )}
    </div>
  );
}

function Comment({ activity }) {
  const [user, setUser] = useState({}); // Інформація про користувача

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/user?user_id=${activity.user_id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser({}); // Якщо виникла помилка, встановлюємо порожній об'єкт
      }
    };

    fetchUser();
  }, [activity]);

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Avatar
              variant="square"
              src={user.avatar}
              sx={{ width: 95, height: 95 }}
            />
          </Grid>
          <Grid item xs={9}>
            <Box>
              <Typography variant="h6">
                Рецензія від {user.game_name} 
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
}

export default ReviewGamePage;
