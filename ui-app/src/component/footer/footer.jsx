import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

function Footer() {
    return (
        <ThemeProvider theme={darkTheme}>
            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                            ? theme.palette.grey[900]
                            : theme.palette.grey[200],
                    color: 'white',
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h6" gutterBottom>
                                Про нас
                            </Typography>
                            <Typography variant="body2">
                                Мій застосунок - це найкращий спосіб знайти ігри та тримати їх в одній бібліотеці.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h6" gutterBottom>
                                Посилання
                            </Typography>
                            <Link href="/" color="inherit" underline="none" display="block">
                                Головна
                            </Link>
                            <Link href="/about" color="inherit" underline="none" display="block">
                                Про нас
                            </Link>
                            <Link href="/contact" color="inherit" underline="none" display="block">
                                Контакти
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h6" gutterBottom>
                                Зв'яжіться з нами
                            </Typography>
                            <Typography variant="body2">
                                Email: support@myapp.com
                            </Typography>
                            <Typography variant="body2">
                                Телефон: +38 (050) 123-45-67
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box mt={4} textAlign="left">
                        <Typography variant="caption" paragraph>
                            Усі торговельні марки є власністю відповідних власників в Україні та інших країнах. Усі права захищені.
                            Усі імена продуктів, найменування компаній, логотипи та торговельні марки, згадані тут, є власністю
                            відповідних власників. Використання цих імен, логотипів та торговельних марок не передбачає підтримку.
                            Усі права захищені. Програмне забезпечення цього веб-сайту підлягає ліцензії та доступне лише на умовах цієї ліцензії.
                            Усі графічні матеріали, включаючи іконки, зображення та шрифти, є власністю відповідних власників і не можуть бути
                            відтворені без їхнього дозволу. Використання цього сайту означає прийняття наших умов використання та політики конфіденційності.
                            Ніщо в цьому веб-сайті не може бути розглянуте як комерційна пропозиція або як рекомендація щодо придбання або продажу
                            будь-яких фінансових інструментів. Усі дії, які ви здійснюєте, базуються виключно на вашій власній оцінці і на ваш
                            страх і ризик. Будь-яке використання матеріалів з цього сайту можливе тільки за попередньої згоди правовласника.
                        </Typography>
                        <Typography variant="body2">
                            &copy; {new Date().getFullYear()} Мій застосунок. Усі права захищені.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default Footer;
