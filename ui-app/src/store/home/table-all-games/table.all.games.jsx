import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@mui/styles';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField,
    Select, MenuItem, FormControl, InputLabel, Box, Typography, Slider, Grid
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#188a8d',
        },
    },
});

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        padding: '20px',
    },
    tableContainer: {
        maxWidth: '100%',
        marginTop: '20px',
    },
    table: {
        minWidth: '100%',
    },
    imageCell: {
        width: '20%',
    },
    nameCell: {
        width: '40%',
    },
    genreCell: {
        width: '20%',
    },
    priceCell: {
        width: '10%',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    filters: {
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
    },
    formControl: {
        minWidth: 120,
        marginBottom: '20px',
    },
    filterSection: {
        marginBottom: '20px',
    },
});

function TableAllGames() {
    const classes = useStyles();
    const [games, setGames] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [genreFilter, setGenreFilter] = useState('');

    useEffect(() => {
        fetch('http://localhost:8050/games')
            .then(response => response.json())
            .then(data => setGames(data))
            .catch(error => console.error('Error fetching games:', error));
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleGenreChange = (event) => {
        setGenreFilter(event.target.value);
    };

    const filteredGames = games.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (genreFilter === '' || game.genre.includes(genreFilter)) &&
        game.price >= priceRange[0] && game.price <= priceRange[1]
    );

    const sortedGames = [...filteredGames].sort((a, b) => {
        console.log(a);
        switch (sortOption) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'date':
                return new Date(b.release_date) - new Date(a.release_date);
            case 'priceAsc':
                return a.price - b.price;
            case 'priceDesc':
                return b.price - a.price;
            case 'sales':
                return b.copies_sold - a.copies_sold;
            default:
                return 0;
        }
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <Box className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={8}>
                        <TableContainer component={Paper} className={classes.tableContainer}>
                            <Table className={classes.table} aria-label="games table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedGames.map((game) => (
                                        <TableRow key={game.id}>
                                            <TableCell className={classes.imageCell}>
                                                <img src={game.header_image} alt={game.name} style={{ maxWidth: '100%' }} />
                                            </TableCell>
                                            <TableCell className={classes.nameCell}>
                                                <Link to={`/game/${game.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{game.name}</Link>
                                            </TableCell>
                                            <TableCell className={classes.genreCell}>
                                                {game.genre.join(', ')}
                                            </TableCell>
                                            <TableCell className={classes.priceCell}>
                                                {game.price}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={4}>
                        <Box className={classes.filters}>
                            <Box className={classes.filterSection} style={{paddingTop: '30px'}}>
                                <TextField
                                    label="Пошук"
                                    variant="outlined"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton>
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box className={classes.filterSection}>
                                <Typography id="price-range-slider" gutterBottom>Цінова різниця</Typography>
                                <Slider
                                    value={priceRange}
                                    onChange={handlePriceRangeChange}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={2000}
                                    step={10}
                                />
                            </Box>
                            <Box className={classes.filterSection}>
                                <FormControl variant="outlined" className={classes.formControl} fullWidth>
                                    <InputLabel>Посортувати по</InputLabel>
                                    <Select value={sortOption} onChange={handleSortChange} label="Sort By">
                                        <MenuItem value=""><em>Нічому</em></MenuItem>
                                        <MenuItem value="name">Назві</MenuItem>
                                        <MenuItem value="date">Даті</MenuItem>
                                        <MenuItem value="priceAsc">Ціна: від меншої до більшої</MenuItem>
                                        <MenuItem value="priceDesc">ЦІна: від більшої до меншої</MenuItem>
                                        <MenuItem value="sales">По кількості продажів</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box className={classes.filterSection}>
                                <FormControl variant="outlined" className={classes.formControl} fullWidth>
                                    <InputLabel>Жанри</InputLabel>
                                    <Select value={genreFilter} onChange={handleGenreChange} label="Genre">
                                        <MenuItem value=""><em>Все</em></MenuItem>
                                        <MenuItem value="Екшен">Екшен</MenuItem>
                                        <MenuItem value="Пригодницька">Пригодницька</MenuItem>
                                        <MenuItem value="Рольова гра">Рольова гра</MenuItem>
                                        <MenuItem value="Відкритий світ">Відкритий світ</MenuItem>
                                        <MenuItem value="Супергерої">Супергерої</MenuItem>
                                        <MenuItem value="Симулятор">Симулятор</MenuItem>
                                        <MenuItem value="Спорт">Спорт</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
}

export default TableAllGames;
