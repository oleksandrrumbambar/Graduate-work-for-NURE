import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
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
      fetchFriends(storedUserId); // Отримання списку друзів після завантаження компоненту
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8070/searchUser?query=${searchQuery}`);
      setFriends(response.data);
      setShowFriendRequests(false); // При пошуку приховуємо запити на дружбу
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const fetchFriends = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8070/getFriends?user_id=${userId}`);
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  return (
    <div className="friend-page">
      <h2>Друзі</h2>
      <div className="search-bar">
        <TextField
          label="Пошук друга"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Пошук
        </Button>
      </div>
      {showFriendRequests && <FriendRequests />}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Аватар</TableCell>
              <TableCell>Ім'я користувача</TableCell>
              <TableCell>Статус</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {friends.map((friend) => (
              <TableRow key={friend.id}>
                <TableCell>
                  <Link to={`/profile/${friend.user_id}`}>
                    <img src={friend.avatar} alt="avatar" style={{ width: 50, height: 50, borderRadius: '50%' }} />
                  </Link>
                </TableCell>
                <TableCell>{friend.game_name}</TableCell>
                <TableCell>{friend.status || 'Невідомо'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Friend;
