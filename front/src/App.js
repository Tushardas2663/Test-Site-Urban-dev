import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateTest from "./pages/CreateTest";
import TakeTest from "./pages/TakeTest";
import UploadPDF from "./pages/UploadPDF";
import TestPage from "./pages/TestPage";
import ManualTest from "./pages/ManualTest";
import ShowProgress from "./pages/ShowProgress";
import CommunityForum from "./pages/CommunityForum";
import MainPage from "./pages/MainPage";
import IITAdvancedPage from "./pages/IITAdvancedPage";
import TestPageIIT from "./pages/TestPageIIT";

import Leaderboard from "./pages/Leaderboard";
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
        <Route path="/take-test" element={<TakeTest />} />
        <Route path="/progress" element={<ShowProgress />} />
        <Route path="/test/:testId" element={<TestPage />} />
        <Route path="/manual-test" element={<ManualTest />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/community-forum" element={<CommunityForum />} />
        <Route path="/iit-advanced" element={<IITAdvancedPage />} />
        <Route path="/testiit/:testId" element={<TestPageIIT />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
