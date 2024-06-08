import React, { useState, useEffect } from 'react';
import { Avatar, Grid } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function FriendList () {
  const [friends, setFriends] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        console.log("ID : "+id)
        if (!id) {
          console.error('User ID parameter is required');
          return;
        }
        const response = await axios.get(`http://localhost:8070/getFriends?user_id=${id}`);
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [id]); 

  return (
    <Grid container spacing={1}>
      {friends.map((friend) => (
        <Grid item key={friend.id}>
          <Link to={`/profile/${friend.user_id}`}>
            <Avatar
              variant="square"
              alt={friend.game_name}
              src={friend.avatar}
              sx={{ width: 50, height: 50 }}
            />
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default FriendList;
