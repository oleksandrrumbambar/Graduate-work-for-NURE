import React, { useState } from 'react';
import { useAuth } from '../../user/authorisation/auth.context';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Snackbar
} from '@mui/material';

import { Alert } from '@mui/lab'; // Замінено Snackbar на Alert
import '../game.page.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#188a8d',
    },
  },
});

const GameHeader = ({ gameData }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { userRole } = useAuth();

  const handleAddToCart = () => {
    if (userRole === 'unauthorized') {
      navigate('/login');
      setSnackbarOpen(true); // Встановлення значення для відображення спливаючого повідомлення

    } else {
      setOpen(true);
    }
  };

  const handleAddToWhislist = () => {
    fetch(`http://localhost:8070/wishlist?user_id=${localStorage.getItem('id_user')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ game_id: gameData.id }), // Передаємо ID гри
    })
      .then(response => response.json())
      .then(data => {
        // Опціонально: додати логіку для відображення сповіщення про успішне додавання до списку бажаного
      })
      .catch(error => {
        console.error('Error adding game to wishlist:', error);
        // Опціонально: додати логіку для відображення сповіщення про помилку
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleViewCart = () => {

    console.log(gameData.id);
    const userId = localStorage.getItem('id_user');
    debugger
    fetch(`http://localhost:8070/basket?user_id=${userId}`, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ game_id: gameData.id }),
    })
      .then(() => {
        debugger
        navigate(`/basket`);
      })
      .catch(error => { debugger; console.error('Error adding to basket:', error) });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="game-header" sx={{ color: 'text.primary', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box className="game-info" sx={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
          <Box className="game-image-buy" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={gameData.header_image} alt={gameData.title} style={{ width: '100%', maxWidth: '600px' }} />
            <Box className="game-buy" sx={{ marginTop: 2, width: '100%' }}>
              <Typography variant="h4">Ціна {gameData.price} UAH</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                sx={{ marginTop: 1, width: '100%' }}
              >
                До кошика
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleAddToWhislist}
                sx={{ marginTop: 1, width: '100%' }}
              >
                До списку бажаного
              </Button>
            </Box>
          </Box>
          <Box className="game-details" sx={{ marginTop: 2 }}>
            <Typography variant="body1">{gameData.short_description}</Typography>
            <hr></hr>
            <Typography variant="body1" style={{ color: 'white' }}>
              Розробник: <Link to={`/publisher/${gameData.developer}`} className="custom-link">{gameData.developer}</Link>
            </Typography>
            <Typography variant="body1" style={{ color: 'white' }}>
              Видавець: <Link to={`/publisher/${gameData.publisher}`} className="custom-link">{gameData.publisher}</Link>
            </Typography>
            <Typography variant="body1">Дата виходу: {gameData.release_date}</Typography>
            <Typography variant="body1" style={{ color: 'white' }}>
              Франшиза: <Link to={`/publisher/${gameData.franchise}`} className="custom-link">{gameData.franchise}</Link>
            </Typography>
          </Box>
        </Box>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Додано до кошика!</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <img src={gameData.header_image} alt={gameData.title} width="100%" />
              <Typography variant="h6">{gameData.title}</Typography>
              <Typography variant="body1">Ціна: {gameData.price} UAH</Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Назад до крамниці
            </Button>
            <Button onClick={handleViewCart} color="primary" variant="contained">
              Переглянути кошик
            </Button>
          </DialogActions>
        </Dialog>

        {/* Відображення Alert */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="warning">
            Тільки авторизовані користувачі можуть додавати товари до кошика.
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default GameHeader;
