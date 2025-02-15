import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../iitAdvancedPage.module.css";

const IITAdvancedPage = () => {
  // Dummy high scores (You can store them in localStorage later)
  const [highScores] = useState({
    test1: 8,
    test2: 7
  });

  return (
    <div className={styles.container}>
      <h1>Test Series</h1>
      <div className={styles.testList}>
        <div className={styles.testItem}>
          <h2>Test 1</h2>
          <p>High Score: {highScores.test1}/10</p>
          <Link to="/testiit/test1" className={styles.startTestBtn}>Start Test</Link>
        </div>
        <div className={styles.testItem}>
          <h2>Test 2</h2>
          <p>High Score: {highScores.test2}/10</p>
          <Link to="/testiit/test2" className={styles.startTestBtn}>Start Test</Link>
        </div>
      </div>
    </div>
  );
};

export default IITAdvancedPage;
