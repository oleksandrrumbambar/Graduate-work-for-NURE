import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import '../game.page.css';

const FriendActivity = () => {
  const { id } = useParams();
  const [friendsWithGame, setFriendsWithGame] = useState([]);
  const [friendsWithGameInWishlist, setFriendsWithGameInWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendActivity = async () => {
      try {
        const userId = localStorage.getItem('id_user');
        const response = await axios.get(`http://localhost:8070/user/gamesWithFriends?user_id=${userId}&game=${id}`);
        const data = response.data;

        // Fetch friends who have the game
        let ownFriends = [];
        try {
          const ownFriendsPromises = data.friendsWithGame.map(async friendId => {
            const friendResponse = await axios.get(`http://localhost:8070/user?user_id=${friendId}`);
            return friendResponse.data;
          });
          ownFriends = await Promise.all(ownFriendsPromises);
        } catch (error) {
          console.error('Error fetching friends who have the game:', error);
        }
        const filteredOwnFriends = ownFriends.filter(friend => friend !== null);

        // Fetch friends who have the game in their wishlist
        let wishlistFriends = [];
        try {
          const wishlistFriendsPromises = data.friendsWithGameInWishlist.map(async friendId => {
            const friendResponse = await axios.get(`http://localhost:8070/user?user_id=${friendId}`);
            return friendResponse.data;
          });
          wishlistFriends = await Promise.all(wishlistFriendsPromises);
        } catch (error) {
          console.error('Error fetching friends who have the game in their wishlist:', error);
        }
        const filteredWishlistFriends = wishlistFriends.filter(friend => friend !== null);

        setFriendsWithGame(filteredOwnFriends);
        setFriendsWithGameInWishlist(filteredWishlistFriends);
      } catch (error) {
        console.error('Error fetching friend activity:', error);
      } finally {
        setLoading(false);
      }
    };



    fetchFriendActivity();
  }, [id]);

  if (loading) {
    return <div>Завантаження...</div>;
  }

  return (
    <div>
      <div className="game-friend-activity">
        {friendsWithGame.length > 0 && (
          <>
            <h4>Ця гра є у ваших друзів:</h4>
            <Grid container spacing={2} className="friend-grid">
              {friendsWithGame.map((friend, index) => (
                <Grid item key={index} className="friend-item">
                  <Link to={`/profile/${friend.user_id}`}>
                    <Avatar alt={`Friend ${index + 1}`} src={friend.avatar} sx={{ width: 70, height: 70, borderRadius: '0%' }} />
                  </Link>
                </Grid>
              ))}
            </Grid>
          </>
        )}
        {friendsWithGameInWishlist.length > 0 && (
          <>
            <h4>Ця гра є у бажаному друзів:</h4>
            <Grid container spacing={2} className="friend-grid">
              {friendsWithGameInWishlist.map((friend, index) => (
                <Grid item key={index} className="friend-item">
                  <Link to={`/profile/${friend.user_id}`}>
                    <Avatar alt={`Friend ${index + 1}`} src={friend.avatar} sx={{ width: 70, height: 70, borderRadius: '0%' }} />
                  </Link>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </div>
    </div>
  );
};

export default FriendActivity;
