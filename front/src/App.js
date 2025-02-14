import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Poetry from './components/poetry';  //components must start with capital letters, PascalCase
import Summarizer from './components/summarizer';
import SavedPoems from './components/savedpoems';

import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />  
                <Route path="/poetry" element={<Poetry />} /> 
                <Route path="/summarizer" element={<Summarizer />} /> 
                <Route path="/savedpoems" element={<SavedPoems />} /> 
            </Routes>
        </Router>
    );
};

export default App; //use npm start for react starting not directly run that runs javascript