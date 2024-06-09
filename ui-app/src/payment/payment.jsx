import React from 'react';
import { Container, Typography, TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#188a8d',
        },
    },
});

function PaymentPage() {
    // Обробка отриманих даних
    console.log('User ID:', localStorage.getItem('id_user'));
    console.log('Basket:', localStorage.getItem('basket'));
    console.log('Price:', localStorage.getItem('price'));

    return (
        <ThemeProvider theme={darkTheme}>
            <Container maxWidth="md">
                <Typography variant="h5" align="center" color={"white"} gutterBottom style={{ marginTop: '20px' }}>
                    СПОСІБ ОПЛАТИ
                </Typography>
                <Typography variant="body1" align="center" color={"white"} gutterBottom>
                    Оберіть наявний збережений спосіб оплати або введіть дані нового способу оплати для майбутніх придбань і оплати підписок.
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Спосіб оплати</InputLabel>
                            <Select label="Спосіб оплати" defaultValue="MasterCard">
                                <MenuItem value="MasterCard">MasterCard</MenuItem>
                                <MenuItem value="Visa">Visa</MenuItem>
                                <MenuItem value="PayPal">PayPal</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField label="Номер карти" fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <TextField label="Закінчення дії" fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <TextField label="Код безпеки" fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" color={"white"} gutterBottom>
                            ПЛАТІЖНІ ВІДОМОСТІ
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Ім'я" fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Прізвище" fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Місто" fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Поштовий індекс" fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Адреса для рахунків" fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Адреса для рахунків, рядок 2" fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Країна</InputLabel>
                            <Select label="Країна" defaultValue="Україна">
                                <MenuItem value="Україна">Україна</MenuItem>
                                <MenuItem value="Інша">Інша</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Номер телефону" fullWidth variant="outlined" />
                    </Grid>
                </Grid>
                <Typography variant="body2" align="center" style={{ marginTop: '20px' }}>
                    Ви матимете можливість переглянути своє замовлення перед оплатою.
                </Typography>
                <Button component={RouterLink} to="/confirmpay" variant="contained" fullWidth color="primary" style={{ marginTop: '20px', marginBottom: '120px' }}>
                    Продовжити
                </Button>
            </Container>
        </ThemeProvider>
    );
}

export default PaymentPage;