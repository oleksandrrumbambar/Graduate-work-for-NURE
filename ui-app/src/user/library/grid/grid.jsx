import React, { useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, useMediaQuery, useTheme, Select, MenuItem } from '@mui/material';
import './grid.css';

const LibraryGrid = ({ games }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sortOption, setSortOption] = useState('completion');

  const sortedGames = [...games].sort((a, b) => {
    if (sortOption === 'completion') {
      return b.franchise - a.franchise;
    } else if (sortOption === 'nameAZ') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'nameZA') {
      return b.name.localeCompare(a.name);
    }
    // Add other sorting options if needed
    return 0;
  });

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
        <Typography variant="h6">Усі ігри ({games.length})</Typography>
        <Select value={sortOption} onChange={handleSortChange}>
          <MenuItem value="completion">Не сортувати</MenuItem>
          <MenuItem value="nameAZ">За назвою (А-Я)</MenuItem>
          <MenuItem value="nameZA">За назвою (Я-А)</MenuItem>
          {/* Add other sorting options if needed */}
        </Select>
      </div>
      <Grid container justifyContent="center" spacing={2}>
        {sortedGames.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
            <Card
              sx={{
                margin: '10px',
                maxHeight: '350px',
                backgroundColor: isDarkMode ? '#424242' : '#fff',
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={item.header_image}
                alt={item.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <CardContent sx={{ padding: '10px' }}>
                <Typography variant="body1" color="textPrimary" noWrap>
                  {item.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default LibraryGrid;
