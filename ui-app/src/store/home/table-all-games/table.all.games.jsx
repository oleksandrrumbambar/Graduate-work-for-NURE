import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
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
      width: '70%',
    },
    priceCell: {
      width: '10%',
    },
  });

function TableAllGames() {
    const classes = useStyles();
    const [games, setGames] = useState([]);

    useEffect(() => {
        // Викликати запит до сервера для отримання списку ігор
        fetch('http://localhost:8050/games')
            .then(response => response.json())
            .then(data => setGames(data))
            .catch(error => console.error('Помилка отримання ігор:', error));
    }, []);

    return (
        <div>
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table className={classes.table} aria-label="games table">
                    <TableBody>
                        {games.map((game) => (
                            <TableRow key={game.id}>
                                <TableCell className={classes.imageCell}>
                                    <img src={game.header_image} alt={game.name} style={{ maxWidth: '100%' }} />
                                </TableCell>
                                <TableCell className={classes.nameCell}>
                                    <Link to={`/game/${game.id}`}>{game.name}</Link>
                                </TableCell>
                                <TableCell>
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
        </div>
    );
};

export default TableAllGames;