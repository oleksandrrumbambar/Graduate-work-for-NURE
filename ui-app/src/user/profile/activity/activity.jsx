import React from 'react';
import { Avatar, Grid, Typography, Card, CardHeader, CardContent } from '@mui/material';

function Activity() {
  // Припустимо, що ми маємо дані про події користувача
  const activities = [
    { id: 1, type: 'game', name: 'New Cities', action: 'purchased' },
    { id: 2, type: 'friend', name: 'Shusuk', action: 'added' },
    { id: 3, type: 'game', name: 'CS 3', action: 'add wishlist' },
    // Додайте інші події за потреби
  ];

  return (
    <div>
      {activities.map((activity) => (
        <Card key={activity.id} style={{ marginBottom: "10px" }}>
          <CardHeader
            avatar={<Avatar />}
            title={`${activity.name} ${activity.action}`}
            subheader={activity.type === 'game' ? 'Game' : 'Friend'}
          />
          <CardContent>
            {/* Додайте додаткову інформацію про подію за потреби */}
            {activity.type === 'game' && (
              <Typography variant="body2">
              </Typography>
            )}
            {activity.type === 'friend' && (
              <Typography variant="body2">
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Activity;
