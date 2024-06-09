import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffffff',
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

const aboutUsContent = [
    {
        title: "Наша Місія",
        description: "Наша місія - надати найкращий досвід покупок для геймерів у всьому світі. Ми прагнемо забезпечити доступ до найновіших ігор та аксесуарів.",
        image: "https://cdn.mos.cms.futurecdn.net/CBmMyHNYNhqYk8sw7gXRTa-1200-80.jpg",
    },
    {
        title: "Про Нас",
        description: "Wave Store - це провідний магазин відеоігор, який пропонує широкий асортимент ігор для всіх платформ. Ми підтримуємо геймерів різного віку та інтересів.",
        image: "https://images.squarespace-cdn.com/content/v1/5ea71033e47a100a9750e0f0/1588859908060-QW3Q6GGO1EYUOLPQ82FL/wave-1913559_1920.jpg",
    },
    {
        title: "Наша Історія",
        description: "Wave Store був заснований у 2020 році групою ентузіастів, які прагнули створити найкращий магазин для геймерів. З того часу ми постійно зростаємо та розширюємо свій асортимент.",
        image: "https://cdn.downtoearth.org.in/library/large/2023-01-13/0.92020400_1673616012_istock-1222094389.jpg",
    },
    {
        title: "Наші Цінності",
        description: "Ми цінуємо клієнтів і ставимо їхні потреби на перше місце. Ми прагнемо забезпечити високу якість обслуговування та швидку доставку.",
        image: "https://i0.wp.com/cleanenergybc.org/wp-content/uploads/jeremy-bishop-iftBhUFfecE-unsplash.jpg?fit=2504%2C1878&ssl=1",
    },
];

function AboutPage() {
    return (
        <ThemeProvider theme={darkTheme}>
            <Container maxWidth="lg" sx={{ paddingY: 4 }}>
                <Typography variant="h3" color="primary" gutterBottom align="center">
                    Про Нас
                </Typography>
                <Divider variant="middle" sx={{ marginBottom: 4 }} />
                <Grid container spacing={4}>
                    {aboutUsContent.map((section, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Card sx={{ backgroundColor: 'background.paper' }}>
                                <CardMedia
                                    component="img"
                                    alt={section.title}
                                    height="200"
                                    image={section.image}
                                    title={section.title}
                                />
                                <CardContent>
                                    <Typography variant="h5" color="primary" gutterBottom>
                                        {section.title}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        {section.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default AboutPage;