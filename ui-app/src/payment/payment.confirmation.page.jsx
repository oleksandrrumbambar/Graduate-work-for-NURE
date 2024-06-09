import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Container,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button
} from '@mui/material';
import './payment.confirmation.css';  // Ensure you have this CSS file in your project

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#188a8d',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
});

function PaymentConfirmationPage() {
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const basket = JSON.parse(localStorage.getItem('basket'));
    const fetchGameInfo = async () => {
      const promises = basket.map(gameId =>
        fetch(`http://localhost:8050/game?id=${gameId}`)
          .then(response => response.json())
      );
      const gamesData = await Promise.all(promises);
      setProducts(gamesData);
    };
    fetchGameInfo();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setTotalPrice(products.reduce((acc, curr) => acc + parseInt(curr.price, 10), 0));
    }
  }, [products]);

  const handlePayment = async () => {
    const userId = localStorage.getItem('id_user'); // Assuming you store the user ID in localStorage
    const paymentData = {
      transaction: {
        time: new Date(),
        amount: totalPrice,
        user: {
          id: userId,
        },
        games: products.map(product => ({ id: product.id })),
      },
    };
    console.log(paymentData)
    try {
      const response = await fetch('http://localhost:8040/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('Payment successful:', responseData);
      // Here you can clear the basket or redirect the user to another page
    } catch (error) {
      console.error('There was a problem with the payment:', error);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {products.map((game, index) => (
          <Card key={index} sx={{ display: 'flex', mb: 2, bgcolor: 'background.paper' }}>
            <CardMedia
              component="img"
              sx={{ width: 151 }}
              image={game.header_image}
              alt={game.name}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h5">
                  {game.name}
                </Typography>
                <Typography variant="subtitle1" color="h6" sx={{ textAlign: 'left' }}>
                  {game.price}
                </Typography>
              </CardContent>
            </Box>
          </Card>
        ))}
        <Box sx={{ textAlign: 'right', mt: 4 }} style={{ marginTop: '20px', marginBottom: '320px' }}>
          <Typography variant="h6" color="textPrimary">
            Загальна сума: {totalPrice.toFixed(2)}₴
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
            onClick={handlePayment}
          >
            Підтвердити оплату
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default PaymentConfirmationPage;
