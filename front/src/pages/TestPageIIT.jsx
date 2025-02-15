import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../iitsrc.module.css";

const questionsData = {
  test1: [
    { question: "What is 2+2?", options: ["2", "3", "4", "5"], correct: 2, hint: "Think about pairs of apples." },
    { question: "What is the capital of France?", options: ["London", "Paris", "Berlin", "Madrid"], correct: 1, hint: "It's known as the City of Lights." },
    { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Venus", "Jupiter"], correct: 1, hint: "It’s named after the Roman god of war." },
    { question: "What is H2O?", options: ["Oxygen", "Water", "Hydrogen", "Carbon"], correct: 1, hint: "You drink it every day!" },
    { question: "What is 5 * 6?", options: ["11", "30", "15", "25"], correct: 1, hint: "Think of 5 groups of 6." }
  ],
  test2: [
    { question: "Who developed the Theory of Relativity?", options: ["Newton", "Einstein", "Tesla", "Galileo"], correct: 1, hint: "E=mc²" },
    { question: "Which is the largest mammal?", options: ["Elephant", "Whale", "Giraffe", "Dinosaur"], correct: 1, hint: "It lives in the ocean." },
    { question: "What is the boiling point of water?", options: ["50°C", "100°C", "200°C", "150°C"], correct: 1, hint: "It's a perfect century in cricket." },
    { question: "Which gas do plants use for photosynthesis?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 1, hint: "Humans exhale it." },
    { question: "What is 12 / 4?", options: ["3", "6", "2", "4"], correct: 0, hint: "12 divided equally into 4 parts." }
  ]
};

const TestPageIIT = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5-minute timer
  const [score, setScore] = useState(null);
  const [hintUsage, setHintUsage] = useState(0);
  const [revealedHints, setRevealedHints] = useState({});
  const questions = questionsData[testId];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert("Test ended because you switched the tab.");
        submitTest();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleAnswer = (index, choice) => {
    setAnswers({ ...answers, [index]: choice });
  };

  const revealHint = (index) => {
    if (hintUsage < 3) {
      setRevealedHints({ ...revealedHints, [index]: true });
      setHintUsage(hintUsage + 1);
    } else {
      alert("You have used all 3 hints!");
    }
  };

  const submitTest = () => {
    let newScore = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) newScore++;
    });

    setScore(newScore);
    localStorage.setItem(`highScore_${testId}`, newScore);
  };

  if (!questions) {
    return (
      <div className={styles.container}>
        <h1>Error</h1>
        <p>Test not found.</p>
      </div>
    );
  }

  if (score !== null) {
    return (
      <div className={styles.container}>
        <h1>Test Completed!</h1>
        <h2>Your Score: {score} / {questions.length}</h2>
        <button onClick={() => navigate("/iit-advanced")} className={styles.backBtn}>Back to Tests</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Test - {testId}</h1>
        <div className={styles.hintCounter}>Hints Available: {3 - hintUsage}</div>
      </div>
      <h2>Time Left: {timeLeft}s</h2>
      {timeLeft <= 0 && submitTest()}
      
      <div className={styles.questions}>
        {questions.map((q, i) => (
          <div key={i} className={styles.questionBox}>
            <h3>{q.question}</h3>
            <div className={styles.optionsContainer}>
              {q.options.map((option, j) => (
                <button 
                  key={j} 
                  onClick={() => handleAnswer(i, j)} 
                  className={`${styles.optionBtn} ${answers[i] === j ? styles.selected : ""}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button 
              className={styles.hintBtn} 
              onClick={() => revealHint(i)} 
              disabled={revealedHints[i]}
            >
              {revealedHints[i] ? "Hint Used" : "Show Hint"}
            </button>
            {revealedHints[i] && <p className={styles.hintText}>{q.hint}</p>}
          </div>
        ))}
      </div>

      <button onClick={submitTest} className={styles.submitBtn}>Submit Test</button>
    </div>
  );
};

export default TestPageIIT;
