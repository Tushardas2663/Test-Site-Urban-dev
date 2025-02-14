import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(jwtDecode(token));  // Decode and set user
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(jwtDecode(res.data.token));  // Set user after login
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);  // Remove user
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
