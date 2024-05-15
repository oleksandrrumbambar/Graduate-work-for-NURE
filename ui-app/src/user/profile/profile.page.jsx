import React, { useState } from 'react';
import { Avatar, Typography, Grid, Paper, Chip } from '@mui/material';
import GameList from './game-list/game.list';
import UserActionsMenu from './user-action-menu/user.action.menu';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import FriendList from './friend-list/friend.list';
import Activity from './activity/activity';
import Statistic from './statistic/statistic.user';

function Profile() {
  const [activeTab, setActiveTab] = useState('games'); // Починаємо з відображення списку друзів

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="user-profile">
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: 20 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={2}>
                <Avatar alt="User Avatar" variant="square" src="https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/2543050/46f19cb9da5693db5b5a46adf75c1779362bac27.gif" style={{ height: '100%', width: 'auto' }} />
              </Grid>
              <Grid item xs={12} md={9} container direction="column">
                <Typography variant="h5">User Nickname <Chip label="Level 50" color="success" variant="outlined" /></Typography>
                <Typography variant="body1">Country: Ukraine</Typography>
                <Typography variant="body1" style={{ marginLeft: 10, fontStyle: 'italic' }}>Я люблю пироги</Typography>
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
                  Ігри
                </Button>
                <Button
                  onClick={() => handleTabChange('activity')}
                  variant={activeTab === 'activity' ? 'contained' : 'outlined'}
                  style={{ borderBottom: 'none' }}
                >
                  Активність
                </Button>
                <Button
                  onClick={() => handleTabChange('statistics')}
                  variant={activeTab === 'statistics' ? 'contained' : 'outlined'}
                  style={{ borderBottom: 'none' }}
                >
                  Статистика
                </Button>
              </Grid>
              <Grid item xs={12} md={12} container direction="column" >
                <Typography variant="h6" style={{ paddingBottom: "15px" }}>Друзі</Typography>
                <FriendList />
              </Grid>
              <Grid item xs={12} md={12} container direction="column" >
                {activeTab === 'games' && (
                  <>
                    <Typography variant="h6" style={{ paddingBottom: "15px" }}>Ігри в власності</Typography>
                    <GameList />
                  </>
                )}
                {activeTab === 'activity' && (
                  <>
                    <Typography variant="h6" style={{ paddingBottom: "15px" }}>Активність</Typography>
                    <Activity />
                  </>
                )}
                {activeTab === 'statistics' && (
                  <>
                    <Typography variant="h6" style={{ paddingBottom: "15px" }}>Статистика</Typography>
                    <Statistic />
                  </>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>

  );
}

export default Profile;