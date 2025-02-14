import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/home.css";  // Import the separate CSS file

function Home() {
    return (
        <div className="home">
            <h1 className="title">Mock Test Platform</h1>
            <p className="subtitle">Create, Share, and Compete in Mock Tests</p>

            <div className="options">
                <Link to="/login" className="btn login-btn">Login</Link>
                <Link to="/register" className="btn signup-btn">Register</Link>
                <Link to="/explore" className="btn explore-btn">Explore Tests</Link>
            </div>
        </div>
    );
}

export default Home;
