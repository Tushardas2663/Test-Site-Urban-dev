import React from "react";
import { useNavigate } from "react-router-dom";

const CreateTest = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Session expired. Please log in again.");
    return;
  }

  // Inline styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #00c6ff, #0072ff)", // Beautiful gradient background
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  };

  const headingStyle = {
    fontSize: "2.5rem",
    marginBottom: "20px",
    textShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
  };

  const buttonContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  };

  const buttonStyle = {
    padding: "12px 24px",
    fontSize: "1.2rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#fff",
    color: "#0072ff",
    fontWeight: "bold",
    transition: "0.3s",
    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.2)",
  };

  const buttonHoverStyle = {
    backgroundColor: "#005bb5",
    color: "#fff",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Create Test</h1>
      <div style={buttonContainerStyle}>
        <button
          style={buttonStyle}
          onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
          onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
          onClick={() => navigate("/upload-pdf")}
        >
          Create from PDF
        </button>
        <button
          style={buttonStyle}
          onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
          onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
          onClick={() => navigate("/manual-test")}
        >
          Manually Add Questions
        </button>
      </div>
    </div>
  );
};

export default CreateTest;
