import React, { useState } from 'react';
import { Typography, Button, Grid } from '@mui/material';

function PaymentPage() {
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleGooglePayPayment = async () => {
    try {

      // Імітація чекання оплати
      setPaymentStatus('processing');

      setPaymentStatus('success');
    } catch (error) {
      console.error('Помилка при оплаті:', error);
      setPaymentStatus('failure');
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Сторінка Оплати
      </Typography>
      {paymentStatus === 'success' && (
        <Typography variant="h6" style={{ color: 'green' }}>
          Оплата успішно здійснена!
        </Typography>
      )}
      {paymentStatus === 'failure' && (
        <Typography variant="h6" style={{ color: 'red' }}>
          Помилка оплати. Спробуйте ще раз.
        </Typography>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {/* Додайте кнопку для оплати через Google Pay */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleGooglePayPayment}
            disabled={paymentStatus === 'processing'}
          >
            Оплатити за допомогою Google Pay
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default PaymentPage;
