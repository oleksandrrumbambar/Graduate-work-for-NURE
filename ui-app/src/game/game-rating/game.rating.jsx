import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import '../game.page.css';

const getColor = (rating) => {
  if (rating >= 75) {
    return 'success'; // зелений
  } else if (rating >= 50) {
    return 'warning'; // жовтий
  } else if (rating >= 25) {
    return 'info'; // цигловий
  } else {
    return 'error'; // червоний
  }
};

const GameRating = ({ rating, ageRatingImage, ageRating }) => {
  return (
    <div className="half-width">
      <div className="container">
        <div className="half-width">
          {['store', 'friends', 'community'].map((key, index) => (
            <div className="assessment-div" key={index}>
              <Box position="relative" display="inline-flex">
                <CircularProgress
                  variant="determinate"
                  value={rating[key]}
                  color={getColor(rating[key])}
                  size={70} 
                  thickness={3} 
                />
                <Box
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  position="absolute"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography variant="h4" component="div" color="white" style={{ textShadow: '0 0 3px rgba(0, 0, 0, 0.5)' }}>
                    {rating[key]}
                  </Typography>
                </Box>
              </Box>
              <p>{key === 'store' ? 'Оцінка від крамниці' : key === 'friends' ? 'Оцінка від друзів' : 'Оцінка від cпільноти'}</p>
            </div>
          ))}
        </div>
        <div className="half-width">
          <img src={ageRatingImage} style={{ marginTop: "75px" }} alt="Age Rating" />
          <p>Віковий рейтинг: {ageRating}</p>
        </div>
      </div>
    </div>
  );
};

export default GameRating;