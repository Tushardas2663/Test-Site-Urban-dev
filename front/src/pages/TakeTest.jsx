import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TakeTest = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Session expired. Please log in again.");
          navigate("/login");
          return;
        }

        const res = await axios.get("http://127.0.0.1:5000/tests", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTests(res.data);
      } catch (error) {
        alert("Error fetching tests.");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [navigate]);

  // Inline Styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #1E3C72, #2A5298)", // Professional blue gradient
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
  };

  const headingStyle = {
    fontSize: "2.5rem",
    marginBottom: "20px",
    textShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
  };

  const cardContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    width: "80%",
    maxWidth: "800px",
  };

  const cardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.3)",
    transition: "0.3s",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "1.2rem",
  };

  const buttonStyle = {
    padding: "12px 24px",
    fontSize: "1.2rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#fff",
    color: "#1E3C72",
    fontWeight: "bold",
    transition: "0.3s",
    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.2)",
    width: "100%",
  };

  const buttonHoverStyle = {
    backgroundColor: "#1E3C72",
    color: "#fff",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Select a Test</h2>

      {loading ? (
        <p>Loading tests...</p>
      ) : tests.length === 0 ? (
        <p>No tests available.</p>
      ) : (
        <div style={cardContainerStyle}>
          {tests.map((test) => (
            <div
              key={test.id}
              style={cardStyle}
              onClick={() => navigate(`/test/${test.id}`)}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
            >
              <h3>{test.title}</h3>
              <button
                style={buttonStyle}
                onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
                onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TakeTest;
