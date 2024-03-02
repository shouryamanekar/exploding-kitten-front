import React from 'react';
import '../styles/Dialog.css';

const LeaderboardDialog = ({  leaderboard, onClose, username }) => {

  const getUserRank = (leaderboard) => {
    const username = localStorage.getItem('username');
    const userRank = leaderboard.find((user) => user.username.toLowerCase() === username.toLowerCase())?.rank;
    return userRank ;
  };

  const top10Leaderboard = leaderboard.slice(0, 10);
  return (
    <div className="dialog-background">
      <div className='dialog-container leaderboard-dialog'>
      <h2>Leaderboard</h2>
      <div className="leaderboard-table">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {top10Leaderboard.map((user, index) => (
            <tr key={index}>
              <td>{user.rank}</td>
              <td>{user.username}</td>
              <td>{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    {/* Display user's rank and points */}
    <p>Your Rank: {getUserRank(leaderboard)}</p>
      <button className='button' onClick={onClose}>Close</button>
    </div>
  </div>
);
};

export default LeaderboardDialog;
