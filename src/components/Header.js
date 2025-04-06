import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { FaHome, FaFire, FaCalendarAlt, FaAddressBook, FaInfoCircle } from 'react-icons/fa';
import { IoLogInOutline, IoLogOutOutline } from "react-icons/io5";
import AuthModal from './AuthModal';
import { auth } from './firebase';
import { signOut } from "firebase/auth";

function Header() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    const handleLoginClick = () => {
        setAuthMode('login');
        setShowAuthModal(true);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setShowLogoutModal(false);
        } catch (error) {
            console.error('Помилка при виході:', error);
        }
    };

    return (
        <header className="main-header">
            <div className="logo-container">
                <img src="/imgs/logo.png" alt="WanderWay Logo" className="logo" />
            </div>
            <div>
                <span className="site-name">WanderWay</span>
            </div>
            <nav>
                <ul className="nav-list">
                    <li className="nav-item">
                        <Link to="/" title="Головна" className="nav-link">
                            <FaHome className="nav-icon" />
                            <span className="nav-text">Головна</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/HotToursPage" title="Гарячі тури" className="nav-link">
                            <FaFire className="nav-icon" />
                            <span className="nav-text">Гарячі тури</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/MyBookingsPage" title="Мої бронювання" className="nav-link">
                            <FaCalendarAlt className="nav-icon" />
                            <span className="nav-text">Бронювання</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/ProfilePage" title="Контакти" className="nav-link">
                            <FaAddressBook className="nav-icon" />
                            <span className="nav-text">Контакти</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/AboutPage" title="Про нас" className="nav-link">
                            <FaInfoCircle className="nav-icon" />
                            <span className="nav-text">Про нас</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                        {currentUser ? (
                            <div className="nav-link" onClick={() => setShowLogoutModal(true)}>
                                <IoLogOutOutline className="nav-icon logout-icon" />
                                <span className="nav-text">Вихід</span>
                            </div>
                        ) : (
                            <div className="nav-link" onClick={handleLoginClick}>
                                <IoLogInOutline className="nav-icon login-icon" />
                                <span className="nav-text">Вхід</span>
                            </div>
                        )}
                    </li>
                </ul>
            </nav>

            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    initialMode={authMode}
                />
            )}

            {/* Модальне вікно підтвердження виходу */}
            {showLogoutModal && (
                <div className="modal auth-modal active">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowLogoutModal(false)}>✖</span>
                        <h3>Підтвердження виходу</h3>
                        <p>Ви впевнені, що хочете вийти з акаунту?</p>
                        <div className="auth-actions">
                            <button
                                className="primary"
                                onClick={handleLogout}
                            >
                                Так, вийти
                            </button>
                            <button
                                className="secondary"
                                onClick={() => setShowLogoutModal(false)}
                            >
                                Скасувати
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;