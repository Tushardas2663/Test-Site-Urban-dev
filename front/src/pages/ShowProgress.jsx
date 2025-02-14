import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShowProgress = () => {
  const [progress, setProgress] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://127.0.0.1:5000/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProgress(res.data);
      } catch (error) {
        alert("Error fetching progress.");
      }
    };

    fetchProgress();
  }, [navigate]);

  return (
    <div>
      <h2>Your Progress</h2>
      {progress.length === 0 ? (
        <p>No test results found.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((item, index) => (
              <tr key={index}>
                <td>{item.test}</td>
                <td>{item.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowProgress;
