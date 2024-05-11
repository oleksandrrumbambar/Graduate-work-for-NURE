import React from 'react';
import { Grid, Paper, Typography, Button, Avatar, Chip, Menu, MenuItem } from '@mui/material';

function UserActionsMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <button onClick={handleClick} style={{ width: '100%', padding: '8px', fontSize: '14px', textAlign: 'left', border: '1px solid #808080', borderRadius: '4px', cursor: 'pointer' }}>
                ...
            </button>
            <Menu
                id="user-actions-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Додати в друзі</MenuItem>
                <MenuItem onClick={handleClose}>Вилучити з друзів</MenuItem>
                <MenuItem onClick={handleClose}>Поскаржитися</MenuItem>
            </Menu>
        </React.Fragment>

    );
};

export default UserActionsMenu;