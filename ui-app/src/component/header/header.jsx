import React from 'react';
import { AppBar, Toolbar, Typography, Button, Link, Box } from '@mui/material';
import { useAuth } from '../../user/authorisation/auth.context';
import { Link as RouterLink } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

function Header() {
  const { userRole, handleSignOut } = useAuth();

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div">
            <Link component={RouterLink} to="/" color="#188a8d" underline="none">
              Home
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {userRole === 'authorized' ? (
            <>
              <Typography variant="h6" component="div">
                <Button component={RouterLink} to="/basket" color="inherit" underline="none">
                  Basket
                </Button>
              </Typography>
              <Typography variant="h6" component="div">
                <Button component={RouterLink} to="/wishlist" color="inherit" underline="none">
                  Wish List
                </Button>
              </Typography>
              <Typography variant="h6" component="div">
                <Button component={RouterLink} to={`/profile/${localStorage.getItem('id_user')}`} color="inherit" underline="none">
                  {localStorage.getItem('user_name')}
                </Button>
              </Typography>
              <Typography variant="h6" component="div">
                <Button component={RouterLink} to="/library" color="inherit" underline="none">
                  Library
                </Button>
              </Typography>
              <Typography variant="h6" component="div">
                <Button component={RouterLink} to="/friend" color="inherit" underline="none">
                  Friend
                </Button>
              </Typography>
              <Button color="inherit" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button component={RouterLink} to="/login" color="inherit">
              Login
            </Button>
          )}
          <Typography variant="h6" component="div">
            <Button component={RouterLink} to="/about" color="inherit" underline="none">
              About
            </Button>
          </Typography>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;
