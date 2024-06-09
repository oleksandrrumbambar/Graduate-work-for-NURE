import React, { useState } from 'react';
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
} from '@mui/material';
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

  const handleAddToCart = () => {
    setOpen(true);
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleViewCart = () => {
    navigate('/basket');
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
                sx={{ marginTop: 1, width: '100%' }}
              >
                До списку бажаного
              </Button>
            </Box>
          </Box>
          <Box className="game-details" sx={{ marginTop: 2 }}>
            <Typography variant="body1">{gameData.short_description}</Typography>
            <hr></hr>
            <Typography variant="body1">
              Розробник: <Link to={`/publisher/${gameData.developer}`}>{gameData.developer}</Link>
            </Typography>
            <Typography variant="body1">
              Видавець: <Link to={`/publisher/${gameData.publisher}`}>{gameData.publisher}</Link>
            </Typography>
            <Typography variant="body1">Дата виходу: {gameData.release_date}</Typography>
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
      </Box>
    </ThemeProvider>
  );
};

export default GameHeader;
