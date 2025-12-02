import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Typography, Card, CardContent, Grid, Box } from '@mui/material';
import './review.page.css';

function ReviewGamePage({ gameData }) {
  const [activities, setActivities] = useState([]); // Початкове значення - порожній масив

  useEffect(() => {
    if (gameData) {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(`http://localhost:8090/reviews/game?game_id=${gameData.id}`);
          const reviews = response.data || [];
          console.log('r', response.data)
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
  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:8070/user?user_id=${activity.user_id}`)
      .then((res) => setUser(res.data))
      .catch(() => setUser({}));
  }, [activity]);

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="flex-start">

          {/* LEFT: Avatar */}
          <Grid item xs={3} md={2}>
            <Avatar
              variant="square"
              src={user.avatar}
              sx={{ width: 95, height: 95 }}
            />
          </Grid>

          {/* CENTER: Text */}
          <Grid item xs={9} md={7}>
            <Typography variant="h6">
              Рецензія від {user.game_name}
            </Typography>

            <Typography variant="body2" color="textSecondary">
              Оцінка: {activity.rating}
            </Typography>

            <Typography variant="body1" sx={{ marginTop: "5px" }}>
              {activity.review_text}
            </Typography>
          </Grid>

          {/* RIGHT: Flags / Labels */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "10px",
              marginTop: { xs: "15px", md: "0" },
            }}
          >
            {activity.ml_analysis?.is_duplicate && (
              <span className="review-label">це рев'ю можливо дублікат</span>
            )}

            {activity.ml_analysis?.is_temporal_anomaly && (
              <span className="review-label">
                це рев'ю опубліковане в момент аномальної активності
              </span>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}



export default ReviewGamePage;
