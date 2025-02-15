import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [windowChanged, setWindowChanged] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Session expired. Please log in again.");
          navigate("/login");
          return;
        }

        const res = await axios.get(`http://127.0.0.1:5000/test/${testId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setQuestions(res.data);
      } catch (error) {
        alert("Error fetching questions.");
      }
    };

    fetchQuestions();
  }, [testId, navigate]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Window Change Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert("You switched the window! Test will be auto-submitted.");
        setWindowChanged(true);
        handleSubmit();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers({ ...answers, [questionId]: selectedOption });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      const res = await axios.post(
        "http://127.0.0.1:5000/submit-test",
        { test_id: testId, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Test submitted! Your score: ${res.data.score}`);
      navigate("/dashboard");
    } catch (error) {
      alert("Error submitting test.");
    }
  };

  // Format time (mm:ss)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Inline Styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#1E1E2F",
    color: "#FFFFFF",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  };

  const timerStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    background: "#FF5733",
    padding: "10px 20px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "2px 4px 10px rgba(255, 87, 51, 0.5)",
  };

  const questionCardStyle = {
    backgroundColor: "#2C2C3E",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.3)",
    width: "60%",
    marginBottom: "20px",
  };

  const optionStyle = {
    display: "block",
    background: "#4A4A6A",
    padding: "10px",
    borderRadius: "8px",
    marginTop: "8px",
    cursor: "pointer",
    color: "#FFFFFF",
    border: "none",
    textAlign: "left",
    transition: "0.3s",
  };

  const buttonStyle = {
    padding: "12px 24px",
    fontSize: "1.2rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#FF5733",
    color: "#fff",
    fontWeight: "bold",
    transition: "0.3s",
    boxShadow: "2px 4px 10px rgba(255, 87, 51, 0.5)",
    marginTop: "20px",
  };

  return (
    <div style={containerStyle}>
      <h2>Test Questions</h2>
      <h3 style={timerStyle}>Time Left: {formatTime(timeLeft)}</h3>

      {windowChanged && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          Test auto-submitted due to window switch!
        </p>
      )}

      {questions.length === 0 ? (
        <p>Loading questions...</p>
      ) : (
        <form>
          {questions.map((q) => (
            <div key={q.id} style={questionCardStyle}>
              <h4>{q.question}</h4>
              {q.options.map((option, index) => (
                <label key={index} style={{ display: "block", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={option}
                    checked={answers[q.id] === option}
                    onChange={() => handleOptionChange(q.id, option)}
                    style={{ marginRight: "10px" }}
                  />
                  <span
                    style={optionStyle}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#6A6A8A")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#4A4A6A")}
                  >
                    {option}
                  </span>
                </label>
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={handleSubmit}
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#D9431D")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#FF5733")}
          >
            Submit Test
          </button>
        </form>
      )}
    </div>
  );
};

export default TestPage;
