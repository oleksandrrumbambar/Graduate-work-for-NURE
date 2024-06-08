import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import './friends.page.css';

function Friend() {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('id_user');
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8070/searchUser?query=${searchQuery}`);
      setFriends(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
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
      <TableContainer component={Paper} className="friend-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Аватар</TableCell>
              <TableCell>Ім'я користувача</TableCell>
              <TableCell>Статус</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {friends.length > 0 ? (
              friends
                .filter((friend) => friend.user_id !== currentUserId)
                .map((friend) => (
                  <TableRow key={friend.id}>
                    <TableCell>
                      <Link to={`/profile/${friend.user_id}`}>
                        <img src={friend.avatar} alt="avatar" style={{ width: 50, height: 50, borderRadius: '50%' }} />
                      </Link>
                    </TableCell>
                    <TableCell>{friend.game_name}</TableCell>
                    <TableCell>{friend.status || 'Невідомо'}</TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Немає результатів
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Friend;
