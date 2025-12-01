import React, { useState, useEffect } from 'react';
import './home.page.css';
import { Link } from "react-router-dom";
import TableAllGames from './table-all-games/table.all.games';
import TopSlider from './top-slider/top.slider';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

function Home() {

  return (
    <div className="home">
      <TopSlider />
      <TopSlider />
      <hr></hr>
      <TableAllGames />
    </div>
  );
}

export default Home;
