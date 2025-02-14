import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateTest from "./pages/CreateTest";
import UploadPDF from "./pages/UploadPDF";
import ManualTest from "./pages/ManualTest";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create-test" element={<CreateTest />} />
        <Route path="/upload-pdf" element={<UploadPDF />} />
        <Route path="/manual-test" element={<ManualTest />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
