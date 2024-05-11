// Home.jsx
import React from 'react';
import './home.page.css';
import { Link } from "react-router-dom";
import TopSlider from './top-slider/top.slider';

const getRandomImage = () => {
  const images = [
    'https://cdn.akamai.steamstatic.com/steam/apps/1774580/header.jpg?t=1701206599',
    'https://cdn.akamai.steamstatic.com/steam/apps/275850/header.jpg?t=1701206599',
    'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg?t=1701206599',
    'https://cdn.akamai.steamstatic.com/steam/apps/381210/header.jpg?t=1701206599',
    'https://cdn.akamai.steamstatic.com/steam/apps/275850/header.jpg?t=1701206599',
  ];
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

const topGamesSales = [
  {
    title: "Fallout 4",
    bigPreview: "https://cdn.akamai.steamstatic.com/steam/apps/377160/header.jpg?t=1712851055",
    smallPreviews: [
      "https://cdn.akamai.steamstatic.com/steam/apps/377160/ss_f7861bd71e6c0c218d8ff69fb1c626aec0d187cf.1920x1080.jpg?t=1712851055",
      "https://cdn.akamai.steamstatic.com/steam/apps/377160/ss_5e2d136759e0ff4e0d74940fffc9c64e8cdcd833.1920x1080.jpg?t=1712851055",
      "https://cdn.akamai.steamstatic.com/steam/apps/377160/ss_0e3f64b96da8ffc1372512f827c263934d3cd5d6.1920x1080.jpg?t=1712851055",
      "https://cdn.akamai.steamstatic.com/steam/apps/377160/ss_a3540ed3253f36a666bd9a50698715f3a1316f70.1920x1080.jpg?t=1712851055"],
    price: '$10',
  },
  {
    title: "Fallout 3",
    bigPreview: "https://cdn.akamai.steamstatic.com/steam/apps/377160/header.jpg?t=1712851055",
    smallPreviews: [
      "https://cdn.akamai.steamstatic.com/steam/apps/377160/ss_f7861bd71e6c0c218d8ff69fb1c626aec0d187cf.1920x1080.jpg?t=1712851055",
      "https://cdn.akamai.steamstatic.com/steam/apps/377160/ss_5e2d136759e0ff4e0d74940fffc9c64e8cdcd833.1920x1080.jpg?t=1712851055",
      "https://cdn.akamai.steamstatic.com/steam/apps/377160/ss_0e3f64b96da8ffc1372512f827c263934d3cd5d6.1920x1080.jpg?t=1712851055",
      "https://cdn.akamai.steamstatic.com/steam/apps/377160/ss_a3540ed3253f36a666bd9a50698715f3a1316f70.1920x1080.jpg?t=1712851055"],
    price: '$10',
  },
  // Інші ігри аналогічно
];

const topGames = [
  {
    title: "Cities: Skylines II",
    bigPreview: "https://cdn.akamai.steamstatic.com/steam/apps/949230/header.jpg?t=1715273733",
    smallPreviews: [
      "https://cdn.akamai.steamstatic.com/steam/apps/949230/ss_ce1621944da65d271f6954266bd0c8a7f452fdfd.1920x1080.jpg?t=1715273733",
      "https://cdn.akamai.steamstatic.com/steam/apps/949230/ss_593d4dd71ee3b1afe8cd1c9c1a0b513ef6a8d368.1920x1080.jpg?t=1715273733",
      "https://cdn.akamai.steamstatic.com/steam/apps/949230/ss_74a14b28d038c901c432c435856ea980fa8c7390.1920x1080.jpg?t=1715273733",
      "https://cdn.akamai.steamstatic.com/steam/apps/949230/ss_b68cb601c12c5a9bc8e736c8adff7c640b22514e.1920x1080.jpg?t=1715273733"],
    price: '$10',
  },
  {
    title: "Cyberpuck 33",
    bigPreview: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg?t=1715334241",
    smallPreviews: [
      "https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_7924f64b6e5d586a80418c9896a1c92881a7905b.1920x1080.jpg?t=1715334241",
      "https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_b529b0abc43f55fc23fe8058eddb6e37c9629a6a.1920x1080.jpg?t=1715334241",
      "https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_e5a94665dbfa5a30931cff2f45cdc0ebea9fcebb.1920x1080.jpg?t=1715334241",
      "https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_f79fda81e6f3a37e0978054102102d71840f8b57.1920x1080.jpg?t=1715334241"],
    price: '$10',
  },
  // Інші ігри аналогічно
];


function Home() {
  return (
    <div className="home">
      <div className="search-container">
        <input type="text" placeholder="Пошук..." />
        <button>Пошук</button>
      </div>
      <section className="home-section">
        <h2>Топ 10 ігор по знижках</h2>
        <TopSlider games={topGamesSales} />

      </section>

      <section className="home-section">
        <h2>Топ 10 ігор по популярності</h2>
        <TopSlider games={topGames} />
      </section>

      <section className="home-section">
        <h2>Топ 10 ігор по смаках користувача</h2>
        <TopSlider games={topGames} />
      </section>
    </div>
  );
}

export default Home;
