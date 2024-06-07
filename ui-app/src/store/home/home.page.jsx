import React, { useState, useEffect } from 'react';
import './home.page.css';
import { Link } from "react-router-dom";
import TableAllGames from './table-all-games/table.all.games';
import TopSlider from './top-slider/top.slider';


function Home() {

  return (
    <div className="home">
      <TopSlider />
      <hr></hr>
      <TableAllGames />
    </div>
  );
}

export default Home;
