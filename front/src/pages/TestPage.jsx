import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

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

  return (
    <div>
      <h2>Test Questions</h2>
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
