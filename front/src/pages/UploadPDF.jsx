import React, { useState } from "react";
import axios from "axios";

const UploadPDF = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [testDuration, setTestDuration] = useState(""); // New state for time input

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    if (!testDuration || testDuration <= 0) {
      alert("Please enter a valid test duration in minutes.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("duration", testDuration); // Send test duration to backend

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://127.0.0.1:5000/upload_pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setExtractedText(res.data.extracted_text);
      window.alert("Test Saved Successfully");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file");
    }
  };

  // Inline Styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #FF416C, #FF4B2B)",
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

  const inputStyle = {
    padding: "10px",
    fontSize: "1rem",
    marginBottom: "20px",
    backgroundColor: "#fff",
    border: "2px solid #ff4b2b",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.2)",
  };

  const buttonStyle = {
    padding: "12px 24px",
    fontSize: "1.2rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#fff",
    color: "#FF4B2B",
    fontWeight: "bold",
    transition: "0.3s",
    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.2)",
    marginBottom: "20px",
  };

  const buttonHoverStyle = {
    backgroundColor: "#ff4b2b",
    color: "#fff",
  };

  const textContainerStyle = {
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "left",
    overflowY: "auto",
    maxHeight: "300px",
    whiteSpace: "pre-wrap",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Upload PDF to Create Test</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} style={inputStyle} />

      {/* New Time Input Field */}
      <input
        type="number"
        placeholder="Enter Test Duration (minutes)"
        value={testDuration}
        onChange={(e) => setTestDuration(e.target.value)}
        style={inputStyle}
      />

      <button
        style={buttonStyle}
        onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
        onClick={handleUpload}
      >
        Upload
      </button>

      {extractedText && (
        <div style={textContainerStyle}>
          <h3>Extracted Questions:</h3>
          <pre>{extractedText}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadPDF;
