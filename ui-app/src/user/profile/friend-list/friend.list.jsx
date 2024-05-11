import React from 'react';
import { Avatar, Grid } from '@mui/material';

const friends = [
    {
        id: 1,
        name: 'Vda❤L',
        avatar: 'https://avatars.akamai.steamstatic.com/b6e7994994319dceaccb0906e717acb93777a948_full.jpg'
      },
      {
        id: 2,
        name: 'morgan',
        avatar: 'https://avatars.akamai.steamstatic.com/c4b0bedb28d6f262e5dbac0372e3618dd21eb9a4_full.jpg'
      }
];

function FriendList () {
  return (
    <Grid container spacing={1}>
      {friends.map((friend) => (
        <Grid item key={friend.id}>
          <Avatar
            variant="square"
            alt={friend.name}
            src={friend.avatar}
            sx={{ width: 50, height: 50 }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default FriendList;