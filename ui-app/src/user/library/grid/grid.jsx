import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import './grid.css';

const testData = [
    { title: "The Witcher 3: Wild Hunt", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg?t=1716793585" },
    { title: "Ane Neko Waifus", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg?t=1716504320" },
    { title: "Batman: Arkham Asylum", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/35140/header.jpg?t=1702934705" },
    { title: "Counter-Strike 2", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg?t=1716504320" },
    { title: "Cyberpunk 2077", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/412020/header.jpg?t=1706778291" },
    { title: "Death Stranding", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1850570/header.jpg?t=1713782964" },
    { title: "Deus Ex: Human Revolution", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/238010/header.jpg?t=1713292112" },
    { title: "Hades", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/412020/header.jpg?t=1706778291" },
    { title: "Half-Life 2: Episode One", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/412020/header.jpg?t=1706778291" },
    { title: "Half-Life 2: Episode Two", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/412020/header.jpg?t=1706778291" },
    { title: "Hotline Miami", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/412020/header.jpg?t=1706778291" },
    { title: "Metal Gear Rising", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/412020/header.jpg?t=1706778291" },
    { title: "Metal Gear Solid V", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/412020/header.jpg?t=1706778291" },
    { title: "Metro Exodus", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/412020/header.jpg?t=1706778291" },
];

const LibraryGrid = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
    return (
      <Grid justifyContent="center">
        {testData.map((item, index) => (
          <Grid item xs={12} sm={12} md={6} lg={2} xl={2} key={index}>
            <Card
              sx={{
                margin: '10px',
                maxHeight: '200px', // Обмеження висоти карточки
            }}
            >
              <CardMedia
                component="img"
                height="140"
                image={item.image}
                alt={item.title}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // Суільне фото
                  }}
              />
              <CardContent>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

export default LibraryGrid;
