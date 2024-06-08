import React, { useState, useEffect } from 'react';
import { Button, Grid, Avatar } from '@mui/material';
import axios from 'axios';

function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const userIDAccept = localStorage.getItem('id_user'); // Отримання ID поточного користувача з localStorage

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/friendRequests?user_id_accept=${userIDAccept}`);
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
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
      console.log('Friend request accepted:', response.data);
    } catch (error) {
      console.error('Error accepting friend request:', error);
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
      console.log('Friend request rejected:', response.data);
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  // Перевірити, чи не є `requests` `null` або пустим масивом перед використанням
  if (!requests || requests.length === 0) {
    return <div>No friend requests</div>;
  }

  return (
    <Grid container spacing={1}>
      {requests.map((request) => (
        <Grid item key={request.id} xs={12} sm={6} md={4}>
          <Avatar
            variant="square"
            alt={request.name}
            src={request.avatar}
            sx={{ width: 50, height: 50 }}
          />
          <p>{request.name}</p>
          <Button variant="contained" color="primary" onClick={() => handleAccept(request.user_id)}>
            Прийняти
          </Button>
          <Button variant="contained" color="secondary" onClick={() => handleReject(request.user_id)}>
            Відхилити
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

export default FriendRequests;
