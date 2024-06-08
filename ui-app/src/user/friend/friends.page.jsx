import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TextField, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import FriendRequests from './friend-requests/friend.requests';
import './friends.page.css';

function Friend() {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [showFriendRequests, setShowFriendRequests] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('id_user');
    if (storedUserId) {
      setCurrentUserId(storedUserId);
      fetchFriends(storedUserId); // Отримати список друзів після завантаження компонента
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8070/searchUser?query=${searchQuery}`);
      setFriends(response.data);
      setShowFriendRequests(false); // Приховати запити на дружбу при пошуку
    } catch (error) {
      console.error('Помилка пошуку користувачів:', error);
    }
  };

  const fetchFriends = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8070/getFriends?user_id=${userId}`);
      setFriends(response.data);
    } catch (error) {
      console.error('Помилка отримання списку друзів:', error);
    }
  };

  useEffect(() => {
    // Перевірити, чи searchQuery порожній, якщо так - показати список друзів
    if (searchQuery === '') {
      setShowFriendRequests(true);
    }
  }, [searchQuery]);

  return (
    <div className="friend-page" style={{ fontFamily: 'Roboto, sans-serif', backgroundColor: '#222', color: '#fff', padding: '20px' }}>
      <h2 className="friends-heading" style={{ textAlign: 'center', fontSize: '36px', marginBottom: '30px' }}>Друзі</h2>
      <div className="search-bar" style={{ marginBottom: '20px' }}>
        <TextField
          label="Пошук друзів"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
          InputProps={{ style: { color: '#fff', width: '100%' } }}
          style={{ width: '100%', textAlign: 'center' }} // Вирівняти текст у полі вводу по центру
          InputLabelProps={{ shrink: true, style: { color: '#fff', textAlign: 'center' } }} // Вирівняти мітку по центру
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          className="search-button"
          style={{
            borderRadius: '0', // Квадратні кути
            fontFamily: 'Roboto, sans-serif',
            transition: 'background-color 0.3s', // Плавний перехід кольору
            '&:hover': {
              backgroundColor: '#4caf50', // Зелений колір при наведенні
            },
          }}
        >
          Пошук
        </Button>
      </div>
      {showFriendRequests && <FriendRequests />}
      <hr style={{ borderTop: '2px solid #4a4a4a', margin: '20px 0' }} />
      <Grid container spacing={3} justifyContent="center">
        {friends.map((friend) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={friend.user_id}>
            <Card className="friend-card" style={{ width: '200px', backgroundColor: '#333', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', borderRadius: '20px', overflow: 'hidden' }}>
              <Link to={`/profile/${friend.user_id}`} style={{ textDecoration: 'none', color: '#fff' }}>
                <img src={friend.avatar} alt="avatar" className="friend-avatar" style={{ width: '200px', height: 'auto', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
                <CardContent style={{ padding: '10px' }}>
                  <Typography variant="h4" component="h3" style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', marginBottom: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {friend.game_name}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Friend;
