import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Typography, Grid, Paper, Chip, Button } from '@mui/material';
import axios from 'axios';
import GameList from './game-list/game.list';
import UserActionsMenu from './user-action-menu/user.action.menu';
import FriendList from './friend-list/friend.list';
import Activity from './activity/activity';
import Statistic from './statistic/statistic.user';
import './profile.page.css'; // Додайте цей рядок для стилів
import { ThemeProvider, createTheme } from '@mui/material/styles';
function Profile() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userLibrary, setUserLibrary] = useState(null);
  const [activeTab, setActiveTab] = useState('games');

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
    },
  });

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
  }, [id]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      {userData && (
        <ThemeProvider theme={darkTheme}>
          <Grid container justifyContent="center" alignItems="center" spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: 20 }}>
                {userData && (
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={2}>
                      <Avatar alt="User Avatar" variant="square" src={userData.avatar} style={{ height: '100%', width: 'auto' }} />
                    </Grid>
                    <Grid item xs={12} md={9} container direction="column">
                      <Typography variant="h5">{userData.game_name} <Chip label="Level 50" color="success" variant="outlined" /></Typography>
                      <Typography variant="body1">Country: {userData.country}</Typography>
                      <Typography variant="body1" style={{ marginLeft: 10, fontStyle: 'italic' }}>{userData.status}</Typography>
                    </Grid>
                    <Grid item xs={12} md={1} container direction="column" alignItems="flex-start">
                      {localStorage.getItem('id_user') !== userData.user_id && (
                        <UserActionsMenu />
                      )}
                    </Grid>
                    <Grid item container justifyContent="center" spacing={2}>
                      <Button
                        onClick={() => handleTabChange('games')}
                        variant={activeTab === 'games' ? 'contained' : 'outlined'}
                        sx={{
                          color: activeTab === 'games' ? 'black' : 'white',
                          borderColor: 'white',
                          backgroundColor: activeTab === 'games' ? 'white' : 'transparent',
                          '&:hover': {
                            backgroundColor: activeTab === 'games' ? 'white' : 'rgba(255, 255, 255, 0.1)',
                            color: activeTab === 'games' ? 'black' : 'rgba(255, 255, 255, 0.1)',
                          },
                          borderRadius: 0,
                          borderBottom: 'none',
                        }}
                      >
                        Games
                      </Button>
                      <Button
                        onClick={() => handleTabChange('activity')}
                        variant={activeTab === 'activity' ? 'contained' : 'outlined'}
                        sx={{
                          color: activeTab === 'activity' ? 'black' : 'white',
                          borderColor: 'white',
                          backgroundColor: activeTab === 'activity' ? 'white' : 'transparent',
                          '&:hover': {
                            backgroundColor: activeTab === 'activity' ? 'white' : 'rgba(255, 255, 255, 0.1)',
                          },
                          borderRadius: 0,
                          borderBottom: 'none',
                        }}
                      >
                        Activity
                      </Button>
                      <Button
                        onClick={() => handleTabChange('statistics')}
                        variant={activeTab === 'statistics' ? 'contained' : 'outlined'}
                        sx={{
                          color: activeTab === 'statistics' ? 'black' : 'white',
                          borderColor: 'white',
                          backgroundColor: activeTab === 'statistics' ? 'white' : 'transparent',
                          '&:hover': {
                            backgroundColor: activeTab === 'statistics' ? 'white' : 'rgba(255, 255, 255, 0.1)',
                          },
                          borderRadius: 0,
                          borderBottom: 'none',
                        }}
                      >
                        Statistics
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={12} container direction="column">
                      <Typography variant="h6" style={{ paddingBottom: "15px" }}>Friends</Typography>
                      <FriendList />
                    </Grid>
                    <Grid item xs={12} md={12} container direction="column">
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
                )}
              </Paper>
            </Grid>
          </Grid>
        </ThemeProvider>
      )}
    </div>
  );
}

export default Profile;
