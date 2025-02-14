import React from 'react';
import { Link } from 'react-router-dom'; //use curly braces to import multiple functions
import "../home.css"
function Home() {
    return (
            <div className="home">
            <h1 className="title">AI Tools</h1>
            <p className="subtitle">Enhance your creativity with AI-powered tools</p>
           
            <div className="options">
                <Link to="/summarizer" className="btn summarizer-btn">Text Summarizer</Link>
                <Link to="/poetry" className="btn poetry-btn">Personalized Poetry Generator</Link>
                <Link to="/savedpoems" className="btn savedpoetry-btn">Saved Poems</Link>
            </div>
        </div>
    );
};

export default Home;

