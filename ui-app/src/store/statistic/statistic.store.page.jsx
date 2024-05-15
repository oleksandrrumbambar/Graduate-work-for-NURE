import React from 'react';
import { Typography, Grid, Card, CardContent, Button } from '@mui/material';

function GameStatisticsPage() {
  // Припустимо, що у нас є дані для графіка, топ-ігор та найкращих видавців

  // Функція для отримання випадкового числа в межах заданого діапазону
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Графік кількості користувачів (за останній місяць)
  const userChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Кількість користувачів',
        data: [getRandomNumber(1000, 2000), getRandomNumber(1500, 2500), getRandomNumber(1200, 2200), getRandomNumber(1800, 2800)],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  // Дані топ-ігор
  const topGamesData = [
    { id: 1, title: 'Game A', sales: getRandomNumber(1000000, 2000000), popularity: getRandomNumber(50000, 100000) },
    { id: 2, title: 'Game B', sales: getRandomNumber(800000, 1500000), popularity: getRandomNumber(40000, 80000) },
    // Додайте дані для інших топ-ігор
  ];

  // Дані найкращих видавців
  const topPublishersData = [
    { id: 1, name: 'Publisher X', sales: getRandomNumber(5000000, 10000000) },
    { id: 2, name: 'Publisher Y', sales: getRandomNumber(4000000, 8000000) },
    // Додайте дані для інших найкращих видавців
  ];

  return (
    <div>
      {/* Графік кількості користувачів */}
      <Typography variant="h4" gutterBottom>
        Графік кількості користувачів
      </Typography>
      {/* Додайте код для відображення графіка, можливо, використовуючи Chart.js або іншу бібліотеку */}

      {/* Топ-ігор по кількості проданих копій */}
      <Typography variant="h4" gutterBottom>
        Топ 10 ігор за кількістю проданих копій
      </Typography>
      <Grid container spacing={3}>
        {topGamesData.map(game => (
          <Grid item key={game.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{game.title}</Typography>
                <Typography variant="body1">Продано копій: {game.sales}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Топ-ігор що набирають популярність */}
      <Typography variant="h4" gutterBottom>
        Топ 10 ігор, що набирають популярність
      </Typography>
      <Grid container spacing={3}>
        {topGamesData.map(game => (
          <Grid item key={game.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{game.title}</Typography>
                <Typography variant="body1">Популярність: {game.popularity}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Найкращі видавці */}
      <Typography variant="h4" gutterBottom>
        Найкращі видавці
      </Typography>
      <Grid container spacing={3}>
        {topPublishersData.map(publisher => (
          <Grid item key={publisher.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{publisher.name}</Typography>
                <Typography variant="body1">Продано копій: {publisher.sales}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default GameStatisticsPage;
