import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import './WaveAnimation.css';  // Ensure you have this CSS file in your project

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

function NotFoundPage() {
    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <Container maxWidth="sm">
                    <Typography variant="h1" color="primary" gutterBottom>
                        404
                    </Typography>
                    <Typography variant="h4" color="textSecondary" gutterBottom>
                        Ой! Сторінка не знайдена.
                    </Typography>
                    <Typography variant="body1" color="textSecondary" paragraph>
                        Схоже, ви потрапили на хвилю неіснуючої сторінки.
                    </Typography>
                    <Button component={Link} to="/" variant="contained" color="primary" size="large">
                        Повернутися на головну
                    </Button>
                </Container>
                <div className="wave-container">
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                </div>
            </Box>
        </ThemeProvider>
    );
}

export default NotFoundPage;