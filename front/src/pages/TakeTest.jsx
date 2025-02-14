import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TakeTest = () => {
  const [tests, setTests] = useState([]);
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
      }
    };

    fetchTests();
  }, [navigate]);

  return (
    <div>
      <h2>Select a Test</h2>
      {tests.length === 0 ? (
        <p>No tests available.</p>
      ) : (
        tests.map((test) => (
          <button key={test.id} onClick={() => navigate(`/test/${test.id}`)}>
            {test.title}
          </button>
        ))
      )}
    </div>
  );
};

export default TakeTest;
