// Friend.jsx
import React, { useState } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import './friends.page.css';

function Friend() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    console.log('Пошук:', searchQuery);
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
              <TableCell>Ім'я користувача</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Тут будуть дані таблиці */}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Friend;
