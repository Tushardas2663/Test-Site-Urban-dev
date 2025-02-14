import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 
import styles from "../dashboard.module.css"; // ✅ Import the CSS Module

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); 
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token"); 
        if (!token) {
          alert("Session expired. Please log in again.");
          logout(); 
          return;
        }

        const res = await axios.get("http://127.0.0.1:5000/dashboard", {
          headers: { Authorization: `Bearer ${token}` } 
        });

        setDashboardData(res.data);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error.response?.data || error.message);
        alert("Session expired. Please log in again.");
        logout(); 
      }
    };

    fetchDashboardData();
  }, [logout]);

  return (
    <div>
      <h1>Welcome, {user?.sub}</h1>
      
      <div className={styles.dashboard}>
        <h1>Dashboard</h1>
        <div className={styles["dashboard-buttons"]}>
          <button onClick={() => navigate("/create-test")}>Create Test</button>
          <button onClick={() => navigate("/take-test")}>Take Test</button>
          <button onClick={() => navigate("/progress")}>Show Progress</button>
          <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
          <button onClick={() => navigate("/community-forum")}>Community Forum</button>
        </div>
      </div>
  
      {dashboardData ? (
        <div className={styles["dashboard-data"]}>
          <p>Tests Taken: {dashboardData.tests_taken}</p>
          <p>Tests Created: {dashboardData.tests_created}</p>
        </div>
      ) : (
        <p className={styles.loading}>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
