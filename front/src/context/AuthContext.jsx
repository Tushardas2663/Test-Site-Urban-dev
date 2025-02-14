import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setUser(jwtDecode(token));
      } catch {
        logout();
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
        const res = await axios.post("http://127.0.0.1:5000/login", 
            { email, password },  
            { headers: { "Content-Type": "application/json" } } 
        );

        localStorage.setItem("token", res.data.token);
        setUser(jwtDecode(res.data.token));
    } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        alert(error.response?.data?.error || "Session expired. Please log in again.");
    }
};


  const register = async (email, password) => {
    try {
      await axios.post("http://127.0.0.1:5000/register", { email, password });
      alert("Registration successful! Please log in.");
    } catch (error) {
      alert(error.response?.data?.error || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
