import React, { useState, useEffect } from 'react';
import { Button, Grid, Avatar, Typography } from '@mui/material';
import axios from 'axios';

function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const userIDAccept = localStorage.getItem('id_user'); // Отримати ID поточного користувача з localStorage

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/friendRequests?user_id_accept=${userIDAccept}`);
        setRequests(response.data);
      } catch (error) {
        console.error('Помилка під час отримання запитів друзів:', error);
      }
    };

    fetchFriendRequests();
  }, [userIDAccept]);

  const handleAccept = async (requestId) => {
    try {
      const response = await axios.post(`http://localhost:8070/confirmFriendRequest`, {
        user_id_accept: userIDAccept,
        user_id_sent: requestId
      });
      // Оновити список запитів після прийняття
      setRequests(requests.filter(request => request.user_id !== requestId));
      console.log('Запит на дружбу прийнято:', response.data);
    } catch (error) {
      console.error('Помилка під час прийняття запиту на дружбу:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await axios.post(`http://localhost:8070/removeFriend`, {
        user_id_accept: userIDAccept,
        user_id_sent: requestId
      });
      // Оновити список запитів після відхилення
      setRequests(requests.filter(request => request.user_id !== requestId));
      console.log('Запит на дружбу відхилено:', response.data);
    } catch (error) {
      console.error('Помилка під час відхилення запиту на дружбу:', error);
    }
  };

  // Перевірити, чи не є `requests` `null` або пустим масивом перед використанням
  if (!requests || requests.length === 0) {
    return <Typography variant="body1">Немає запитів на дружбу</Typography>;
  }

  return (
    <Grid container spacing={2} justifyContent="center">
      {requests.map((request) => (
        <Grid item key={request.id} xs={12} sm={6} md={4}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
            <Avatar
              variant="square"
              alt={request.name}
              src={request.avatar}
              sx={{ width: 100, height: 100, marginRight: '20px' }} // Налаштувати розмір та відступ аватара
            />
            <div style={{ flex: 1 }}>
              <Typography variant="body1" style={{ marginBottom: '10px' }}>{request.game_name}</Typography> {/* Відображення імені користувача */}
              <div>
                <Button variant="contained" color="primary" onClick={() => handleAccept(request.user_id)}>
                  Прийняти
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleReject(request.user_id)}>
                  Відхилити
                </Button>
              </div>
            </div>
          </div>
        </Grid>
      ))}
    </Grid>
  );
}

export default FriendRequests;
