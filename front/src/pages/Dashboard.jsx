import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Ensure correct import

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext); // Get user from context
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");  // ✅ Get token from localStorage
        if (!token) {
          alert("Session expired. Please log in again.");
          logout(); // Log out the user if session expired
          return;
        }

        const res = await axios.get("http://127.0.0.1:5000/dashboard", {
          headers: { Authorization: `Bearer ${token}` } // ✅ Send token in headers
        });

        setDashboardData(res.data);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error.response?.data || error.message);
        alert("Session expired. Please log in again.");
        logout(); // Log out the user if error occurs
      }
    };

    fetchDashboardData();
  }, [logout]);

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      {dashboardData ? (
        <div>
          <p>Tests Taken: {dashboardData.tests_taken}</p>
          <p>Tests Created: {dashboardData.tests_created}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
