import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(15); // 15 minutes in seconds
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

  return (
    <div>
      <h2>Test Questions</h2>
      <h3>Time Left: {formatTime(timeLeft)}</h3>
      {windowChanged && <p style={{ color: "red" }}>Test auto-submitted due to window switch!</p>}

      {questions.length === 0 ? (
        <p>Loading questions...</p>
      ) : (
        <form>
          {questions.map((q) => (
            <div key={q.id}>
              <h4>{q.question}</h4>
              {q.options.map((option, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={option}
                    checked={answers[q.id] === option}
                    onChange={() => handleOptionChange(q.id, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button type="button" onClick={handleSubmit}>
            Submit Test
          </button>
        </form>
      )}
    </div>
  );
};

export default TestPage;
