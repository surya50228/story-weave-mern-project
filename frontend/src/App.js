import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import StoryPage from './pages/StoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

function App() {
    return (
        <Router>
            <Navbar />
            <main className="container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/story/:id" element={<StoryPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;