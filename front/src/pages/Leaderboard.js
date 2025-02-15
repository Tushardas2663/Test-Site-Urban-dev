import React, { useEffect, useState } from "react";
import styles from "../leaderboard.module.css"; // Ensure you have this CSS file

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/leaderboard") // Adjust URL if needed
      .then((response) => response.json())
      .then((data) => setLeaderboard(data))
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, []);

  return (
    <div className={styles.container}>
      <h1>Leaderboard</h1>
      <table className={styles.leaderboardTable}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Email</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index} className={index < 3 ? styles.topRank : ""}>
              <td>{index + 1}</td>
              <td>{entry.email}</td>
              <td>{entry.total_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
