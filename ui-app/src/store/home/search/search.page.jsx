// Home.jsx
import React from 'react';
import './search.page.css';

const games = [
    {
        title: "Yakuza: Like a Dragon",
        bigPreview: "https://cdn.akamai.steamstatic.com/steam/apps/1235140/header.jpg?t=1715685374",
        smallPreviews: [
            "https://cdn.akamai.steamstatic.com/steam/apps/1235140/ss_d6a2265d501c4a4de81c6a0626626ec99f7b6246.1920x1080.jpg?t=1602721793",
            "https://cdn.akamai.steamstatic.com/steam/apps/1235140/ss_32248de292c40524291e53ad7bb7f24ef03f95f7.1920x1080.jpg?t=1602721793",
            "https://cdn.akamai.steamstatic.com/steam/apps/1235140/ss_224ebd12e1973f04de8f11f91fc06d8a16c8396d.1920x1080.jpg?t=1602721793",
            "https://cdn.akamai.steamstatic.com/steam/apps/1235140/ss_84594b776786af2741da1eef03ee044bd5d91892.1920x1080.jpg?t=1602721793"
        ],
        price: '$60',
    },
    {
        title: "Yakuza 6: The Song of Life",
        bigPreview: "https://cdn.akamai.steamstatic.com/steam/apps/1388590/header.jpg?t=1713430670",
        smallPreviews: [
            "https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_540a86501510aa5862c0f2ab6d0721b8be3c38d2.1920x1080.jpg?t=1556285277",
            "https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_d8d8ef64767d47f2a0df6bfa63ee775ac1c57324.1920x1080.jpg?t=1556285277",
            "https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_924c49f18a4829b11f2b71a30ab1697501c75045.1920x1080.jpg?t=1556285277",
            "https://cdn.akamai.steamstatic.com/steam/apps/638970/ss_08e9647ac92f5fcf287eae982c6c73c6153db1b0.1920x1080.jpg?t=1556285277"
        ],
        price: '$20',
    }
    // Інші ігри аналогічно
];


function Search() {
    return (
        <div className="search-page">
            <div className="search-container">
                <input type="text" placeholder="Пошук..." />
                <button>Пошук</button>
            </div>
            <div className="action-box">Action X</div>
            <div className="games-container">
                {games.map((game, index) => (
                    <div key={index} className="game">
                        <img src={game.bigPreview} alt={game.title} />
                        <h3>{game.title}</h3>
                        <p>Ціна: {game.price}</p>
                        <hr></hr>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Search;