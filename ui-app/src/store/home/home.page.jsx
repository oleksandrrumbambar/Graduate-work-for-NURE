import React, { useState, useEffect } from 'react';
import './home.page.css';
import { Link } from "react-router-dom";
import TableAllGames from './table-all-games/table.all.games';


function Home() {

  return (
    <div className="home">
      <hr></hr>
        <TableAllGames />
    </div>
  );
}

export default Home;
