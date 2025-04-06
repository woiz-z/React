import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HotToursPage from './pages/HotToursPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage'; // Імпортуємо нову сторінку
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/HotToursPage" element={<HotToursPage />} />
                        <Route path="/MyBookingsPage" element={<MyBookingsPage />} />
                        <Route path="/ProfilePage" element={<ProfilePage />} />
                        <Route path="/AboutPage" element={<AboutPage />} /> {/* Додаємо новий маршрут */}
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;