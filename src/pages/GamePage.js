// pages/GamePage.js
import React, { useState, useEffect, useCallback   } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaderboardDialog from '../components/LeaderboardDialog';
import '../styles/GamePage.css';

const GamePage = () => {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [playerPoints, setPlayerPoints] = useState(0);
    const [deck, setDeck] = useState(generateInitialDeck());
    const [diffuseBox, setDiffuseBox] = useState([]);
    const [outBox, setOutBox] = useState([]);
    const [drawnCards, setDrawnCards] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BACKEND_URL;



    const fetchUserPoints = useCallback(async () => {
    try {
      const response = await fetch(`${baseURL}/api/user/points`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Username': localStorage.getItem('username'),
        },
      });

      if (response.ok) {
        const { points } = await response.json();
        setPlayerPoints(points);
      } else {
        console.error('Failed to fetch user points:', response.statusText);
      }
    } catch (error) {
      console.error('Error during user points fetch:', error);
    }
    },[baseURL]);

    const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await fetch(`${baseURL}/api/leaderboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Username': localStorage.getItem('username'),
        },
      });

      if (response.ok ) {
        const data = await response.json();
        setLeaderboard(data);
      } else {
        console.error('Failed to fetch leaderboard:', response.statusText);
      }
    } catch (error) {
      console.error('Error during fetchLeaderboard:', error);
    }
    },[baseURL]);

    // Ensure the user is redirected to the login page if not logged in
    useEffect(() => {

      // Retrieve username from localStorage
      const username = localStorage.getItem('username');

      // Ensure the user is redirected to the login page if not logged in
      if (!username) { 
        console.log('Username not found. Redirecting to login.');
        navigate('/login');
      }

      fetchUserPoints();
      fetchLeaderboard();
    }, [navigate, fetchUserPoints, fetchLeaderboard]);



    function generateInitialDeck() {
        const allCards = [
          'cat.jpg',
          'diffuse.jpg',
          'shuffle.jpg',
          'explodingcat.jpg',
        ];
    
        const deck = [];
        for (let i = 0; i < 5; i++) {
          const randomIndex = Math.floor(Math.random() * allCards.length);
          deck.push(allCards[randomIndex]);
        }
        return deck;
    }

    const toggleLeaderboard = () => {
        setShowLeaderboard(!showLeaderboard);
    };

    const handleLogout = () => {
      // Clear the username from local storage
      localStorage.removeItem('username');
      
      
  
      // For now, it will just navigate to the login page
      navigate('/login');
    };

    const getImageSource = (card) => {
        return process.env.PUBLIC_URL + `/assets/cards/${card}`;
    };
      
    const handleRestartGame = () => {
        setDeck(generateInitialDeck());
        setDiffuseBox([]);
        setOutBox([]);
        setDrawnCards([]);
        fetchUserPoints();
    };

    const handleDrawCard = async  () => {
        if (deck.length > 0) {
          const drawnCard = deck.pop();
          setDrawnCards([...drawnCards, drawnCard]);
    
          // Check if the drawn card is a bomb card
          if (drawnCard === 'explodingcat.jpg') {
            // Check if there is a diffuse card to cancel the bomb
            if (diffuseBox.length > 0) {
              // Logic for using the diffuse card to cancel the bomb
              diffuseBox.pop();
              setOutBox([...outBox, 'diffuse.jpg']);
              setOutBox([...outBox, 'explodingcat.jpg']);
              setDiffuseBox([...diffuseBox]);
              alert('Bomb card canceled using Diffuse card!');
            } else {
              // Game Over logic if there is no diffuse card
              alert('Game Over! You drew an Exploding Kitten 💣');
              handleRestartGame();
              return;
            }
          }
    
            // Check if the drawn card is a shuffle card
            if (drawnCard === 'shuffle.jpg') {
              // Logic for restarting the game and refilling the deck with 5 cards
              alert('You Got a Shuffel Card 🔀, restarting game');
              handleRestartGame();
              return;
            }
    
          switch (drawnCard) {
            case 'cat.jpg':
              setOutBox([...outBox, drawnCard]);
              break;
            case 'diffuse.jpg':
              setDiffuseBox([...diffuseBox, drawnCard]);
              break;
            default:
              break;
          }
    
          if (drawnCards.length === 4) {
            // Player wins after drawing 5 cards
            // Increment user points in the database
            fetch(`${baseURL}/api/user/incrementPoints`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Username': localStorage.getItem('username'),
                },
            })
            .then(response => response.text())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Failed to increment user points:', error);
            });

            alert('You Win!');
            fetchLeaderboard();
            handleRestartGame();
            return;
          }
    
          setDeck([...deck]);
        }
    };
    



  return (
    <div className='gampepagecontainer'>
    <div className="game-container">
      <div className="top-bar">
        <button className="button restart-button" onClick={handleRestartGame}>
          Restart
        </button>
        <div className="player-info">
          <p> {localStorage.getItem('username')} : {playerPoints} Points</p>
        </div>
        <div className="action-buttons">
          <button className="button" onClick={toggleLeaderboard}>
            View Leaderboard
          </button>
          <button className="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="center-content">
        <div className="cards-display">
          <h2>Cards Display</h2>
          <div className="drawn-cards-container">
            {drawnCards.map((card, index) => (
              <div key={index} className="drawn-card">
                <img src={getImageSource(card)} alt={`Drawn Card ${index}`} className="card-image" />
              </div>
            ))}
          </div>
          <div className="draw-card" onClick={handleDrawCard}>
            <h2>Draw Card</h2>
            {deck.length > 0 ? 'Click to Draw Card' : 'Deck Empty'}
          </div>
        </div>
      </div>

      <div className="bottom-bar">
        <div className="diffuse-box">
          <h2>Diffuse Box</h2>

          <div className="diffuse-cards-container">
            {diffuseBox.map((card, index) => (
              <div key={index} className="diffuse-card">
                <img src={getImageSource(card)} alt={`Drawn Card ${index}` } className="card-image" />
              </div>
            ))}
          </div>
        </div>
        <div className="out-box">
          <h2>Out Box</h2>
          <div className="cat-cards-container">
            {outBox.map((card, index) => (
              <div key={index} className="cat-card">
                <img src={getImageSource(card)} alt={`Drawn Card ${index}`} className="card-image"/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showLeaderboard && <LeaderboardDialog  leaderboard={leaderboard} onClose={toggleLeaderboard} />}
    </div>
    </div>
  );
};

export default GamePage;
