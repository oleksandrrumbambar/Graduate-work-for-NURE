import React, { useEffect, useState } from 'react';
import { Typography, Grid } from '@mui/material';
import { Pie, Cell, Tooltip, Legend } from '@mui/x-charts';
import { PieChart } from '@mui/x-charts/PieChart';

function Statistic({ userData }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8030/user/statistics?user_id=${userData.user_id}`);
                const result = await response.json();
                setData(result);
                console.log(result)
            } catch (error) {
                console.error('Error fetching data:', error);
                setData('');
            }
        };

        fetchData();
    }, [userData.user_id]);

    if (!data) {
        return <Typography>Немає інформації</Typography>;
    }

    const genreData = Object.entries(data.genre_weights).map(([name, value], index) => ({
        id: index,
        value: value,
        label: name
    }));
    console.log(genreData)
    const gameAgeData = Object.entries(data.game_age_percentages).map(([name, value], index) => ({
        id: index,
        value: value,
        label: name
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div>
            <Typography variant="subtitle1">Кількість ігор в власності: {data.total_games}</Typography>
            <Typography variant="subtitle1">Кількість позитивних рецензій: {data.review_stats.positive_count}</Typography>
            <Typography variant="subtitle1">Кількість негативних рецензій: {data.review_stats.negative_count}</Typography>
            <Typography variant="subtitle1">Улюблений жанр: {data.favorite_genre}</Typography>
            <Typography variant="subtitle1">Улюблена франшиза: {data.favorite_franchises || 'None'}</Typography>
            <Typography variant="subtitle1">Загальна вартість акаунта: {data.total_account_price}</Typography>

            <Typography variant="subtitle1" style={{ marginTop: '30px' }}>
                Розподіл ігор за жанрами
            </Typography>
            <PieChart
                series={[
                    {
                        data: genreData,
                        innerRadius: 20,
                        outerRadius: 150,
                        paddingAngle: 2,
                        cornerRadius: 5,
                        startAngle: -180,
                        endAngle: 180,
                    }
                ]
                }
                width={900}
                height={400}

            />
            <Typography variant="subtitle1" style={{ marginTop: '30px' }}>
                Вік ігор
            </Typography>
            <PieChart
                series={[
                    {
                        data: gameAgeData,
                        innerRadius: 20,
                        outerRadius: 150,
                        paddingAngle: 2,
                        cornerRadius: 5,
                        startAngle: -180,
                        endAngle: 180,
                    }
                ]
                }
                width={900}
                height={400}

            />
        </div>
    );
}

export default Statistic;
