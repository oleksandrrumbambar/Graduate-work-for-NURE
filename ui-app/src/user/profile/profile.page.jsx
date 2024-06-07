import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Typography, Grid, Paper, Chip } from '@mui/material';
import GameList from './game-list/game.list';
import UserActionsMenu from './user-action-menu/user.action.menu';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import FriendList from './friend-list/friend.list';
import Activity from './activity/activity';
import Statistic from './statistic/statistic.user';
import axios from 'axios';

function Profile() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userLibrary, setUserLibrary] = useState(null);
  const [activeTab, setActiveTab] = useState('games'); // Start with displaying the list of games

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/user?user_id=${id}`);
        setUserData(response.data);
        const userGamesResponse = await axios.get(`http://localhost:8070/user/games?user_id=${id}`);
        setUserLibrary(userGamesResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="user-profile">
      {userData && (
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: 20 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={2}>
                  <Avatar alt="User Avatar" variant="square" src={userData.avatar} style={{ height: '100%', width: 'auto' }} />
                </Grid>
                <Grid item xs={12} md={9} container direction="column">
                  <Typography variant="h5">{userData.game_name} <Chip label="Level 50" color="success" variant="outlined" /></Typography>
                  <Typography variant="body1">Country: {userData.country}</Typography>
                  <Typography variant="body1" style={{ marginLeft: 10, fontStyle: 'italic' }}>{userData.status}</Typography>
                </Grid>
                <Grid xs={12} md={1} container direction="column" alignItems="flex-start">
                  <UserActionsMenu />
                </Grid>
                <Grid item container justifyContent="center" spacing={2}>
                  <Button
                    onClick={() => handleTabChange('games')}
                    variant={activeTab === 'games' ? 'contained' : 'outlined'}
                    style={{ borderBottom: 'none' }}
                  >
                    Games
                  </Button>
                  <Button
                    onClick={() => handleTabChange('activity')}
                    variant={activeTab === 'activity' ? 'contained' : 'outlined'}
                    style={{ borderBottom: 'none' }}
                  >
                    Activity
                  </Button>
                  <Button
                    onClick={() => handleTabChange('statistics')}
                    variant={activeTab === 'statistics' ? 'contained' : 'outlined'}
                    style={{ borderBottom: 'none' }}
                  >
                    Statistics
                  </Button>
                </Grid>
                <Grid item xs={12} md={12} container direction="column" >
                  <Typography variant="h6" style={{ paddingBottom: "15px" }}>Friends</Typography>
                  <FriendList />
                </Grid>
                <Grid item xs={12} md={12} container direction="column" >
                  {activeTab === 'games' && (
                    <>
                      <Typography variant="h6" style={{ paddingBottom: "15px" }}>Owned Games</Typography>
                      <GameList userLibrary={userLibrary} />
                    </>
                  )}
                  {activeTab === 'activity' && (
                    <>
                      <Typography variant="h6" style={{ paddingBottom: "15px" }}>Activity</Typography>
                      <Activity />
                    </>
                  )}
                  {activeTab === 'statistics' && (
                    <>
                      <Typography variant="h6" style={{ paddingBottom: "15px" }}>Statistics</Typography>
                      <Statistic />
                    </>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default Profile;
