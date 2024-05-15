import React from 'react';
import { Typography, Grid } from '@mui/material';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

function Statistic() {
    const genreData = [
        { name: 'Action', value: 20 },
        { name: 'RPG', value: 15 },
        { name: 'Adventure', value: 10 },

    ];

    const franchiseData = [
        { name: 'Yakuza', value: 30 },
        { name: 'Stalker', value: 25 },
        { name: 'CS', value: 20 },

    ];

    return (
        <div>
            {/* Кількість ігор в власності */}
            <Typography variant="subtitle1">Кількість ігор в власності: 50</Typography>
            {/* Кількість позитивних та негативних рецензій */}
            <Typography variant="subtitle1">Кількість позитивних рецензій: 30</Typography>
            <Typography variant="subtitle1">Кількість негативних рецензій: 20</Typography>
            {/* Улюблений жанр */}
            <Typography variant="subtitle1">Улюблений жанр: Action</Typography>
            {/* Улюблена франшиза */}
            <Typography variant="subtitle1">Улюблена франшиза: Yakuza</Typography>
            {/* Розмістимо пироги в одному ряду */}
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" style={{ marginTop: "30px" }}>Розподіл ігор за жанрами</Typography>
                    <PieChart width={300} height={300}>
                        <Pie data={genreData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                            {genreData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" style={{ marginTop: "30px" }}>Розподіл ігор за франшизами</Typography>
                    <PieChart width={300} height={300}>
                        <Pie data={franchiseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                            {franchiseData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </Grid>
            </Grid>
        </div>
    );
}

export default Statistic;
