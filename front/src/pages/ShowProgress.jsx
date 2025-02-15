import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "../showProgress.module.css"; // Import the CSS

const ShowProgress = () => {
  const [progress, setProgress] = useState([]);
  const [aiComment, setAiComment] = useState(""); // Store AI comment
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  // Fetch progress data from the backend
  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please log in again.");
        return;
      }

      try {
        const res = await axios.get("http://127.0.0.1:5000/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedData = res.data.map((item, index) => ({
          testNumber: index + 1,
          testName: item.test,
          score: item.score,
        }));

        setProgress(formattedData);

        // 🔹 Fetch AI comment after progress data is loaded
        fetchAIComment(formattedData);
      } catch (error) {
        alert("Error fetching progress.");
      }
    };

    fetchProgress();
  }, []);

  // Function to fetch AI-generated progress comment
  const fetchAIComment = async (progressData) => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/progress-comment", {
        progress: progressData,
      });

      setAiComment(res.data.comment);
    } catch (error) {
      console.error("Error fetching AI comment:", error);
      setAiComment("Unable to generate a comment at the moment.");
    }
  };

  // Draw line chart
  useEffect(() => {
    if (progress.length > 0) {
      drawLineChart();
      drawBarChart();
    }
  }, [progress]);

  const drawLineChart = () => {
    const canvas = lineChartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    const maxScore = Math.max(...progress.map((item) => item.score));

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Plot points and draw line
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    progress.forEach((item, index) => {
      const x = padding + (index / (progress.length - 1)) * (width - 2 * padding);
      const y = height - padding - (item.score / maxScore) * (height - 2 * padding);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
    });
    ctx.stroke();
  };

  const drawBarChart = () => {
    const canvas = barChartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const barWidth = (width - 2 * padding) / progress.length;

    const maxScore = Math.max(...progress.map((item) => item.score));

    progress.forEach((item, index) => {
      const x = padding + index * barWidth;
      const barHeight = (item.score / maxScore) * (height - 2 * padding);
      ctx.fillStyle = "green";
      ctx.fillRect(x, height - padding - barHeight, barWidth - 10, barHeight);
    });
  };

  return (
    <div className={styles["progress-container"]}>
      <h2>Your Progress Over Time</h2>

      {progress.length === 0 ? (
        <p>No test results found.</p>
      ) : (
        <>
          {/* Progress Table */}
          <h3>Test Results</h3>
          <table className={styles["progress-table"]}>
            <thead>
              <tr>
                <th>Test Number</th>
                <th>Test Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {progress.map((item, index) => (
                <tr key={index}>
                  <td>{item.testNumber}</td>
                  <td>{item.testName}</td>
                  <td>{item.score}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Line Graph */}
          <h3>Score Trend (Line Graph)</h3>
          <div className={styles["chart-container"]}>
            <canvas ref={lineChartRef} width={500} height={300} />
          </div>

          {/* Bar Graph */}
          <h3>Score Comparison (Bar Chart)</h3>
          <div className={styles["chart-container"]}>
            <canvas ref={barChartRef} width={500} height={300} />
          </div>

          {/* AI-Powered Analysis */}
          {aiComment && (
            <div className={styles["ai-comment-box"]}>
              <h3>AI Progress Analysis</h3>
              <p>{aiComment}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShowProgress;
