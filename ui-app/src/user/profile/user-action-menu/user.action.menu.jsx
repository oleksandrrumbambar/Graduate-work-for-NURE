import React, { useEffect, useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material'; // Import the MoreHoriz icon
import { useParams } from 'react-router-dom';

function UserActionsMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [friendship, setFriendship] = useState(null);
    const { id } = useParams();

    useEffect(() => { 
        const fetchFriendshipStatus = async () => {
            try {
                if (id && localStorage.getItem('id_user')) {
                    const response = await fetch(`http://localhost:8070/checkFriendship?user_id1=${id}&user_id2=${localStorage.getItem('id_user')}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    setFriendship(data);
                    setAnchorEl(null);
                }
            } catch (error) {
                console.error('Error checking friendship:', error);
                // Встановлення статусу "не друзі" у випадку помилки
                setFriendship({ friendship_status: 'not_friends' });
            }
        };
    
        fetchFriendshipStatus();
    }, [id]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        console.log('Friendship:', friendship);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAddFriend = async () => {
        try {
            const response = await fetch('http://localhost:8070/addFriendRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    user_id_accept: id, // ID користувача, якому буде надіслано запит на дружбу
                    user_id_sent: localStorage.getItem('id_user'), // ID поточного користувача
                    friendship_status: 'request' // початковий статус дружби
                }),
            });

            if (response.ok) {
                console.log('Friend request added');
                // Можливо, оновлення стану або інтерфейсу користувача тут
            } else {
                console.error('Error adding friend request:', await response.text());
            }
        } catch (error) {
            console.error('Error adding friend request:', error);
        }
    };

    const handleRemoveFriend = async () => {
        try {
            const response = await fetch('http://localhost:8070/removeFriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id_accept: id, // ID користувача, якого потрібно видалити з друзів
                    user_id_sent: localStorage.getItem('id_user'), // ID поточного користувача
                }),
            });

            if (response.ok) {
                console.log('Friend deleted');
                // Оновлення стану або інтерфейсу користувача тут, якщо потрібно
            } else {
                console.error('Error deleting friend:', await response.text());
            }
        } catch (error) {
            console.error('Error deleting friend:', error);
        }
    };

    return (
        <React.Fragment>
            <Button 
                onClick={handleClick}
                variant="outlined" 
                style={{ 
                    width: '100%', 
                    padding: '8px', 
                    color: 'white',
                    fontSize: '14px', 
                    textAlign: 'left', 
                    border: '1px solid #808080', 
                    borderRadius: '4px', 
                    cursor: 'pointer' 
                }}
                startIcon={<MoreHoriz />} // Add the MoreHoriz icon as the startIcon
            >
            </Button>
            <Menu
                id="user-actions-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {friendship && friendship.friendship_status === 'friendship' ? (
                    <MenuItem onClick={handleRemoveFriend}>Вилучити з друзів</MenuItem>
                ) : (
                    <MenuItem onClick={handleAddFriend}>Додати в друзі</MenuItem>
                )}
                <MenuItem onClick={handleClose}>Поскаржитися</MenuItem>
            </Menu>
        </React.Fragment>
    );
};

export default UserActionsMenu;
