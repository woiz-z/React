import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import '../styles/modal.css';

const BookingModal = ({ onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setName(user.displayName || '');
            setEmail(user.email || '');
        }

        const timer = setTimeout(() => {
            setIsActive(true);
        }, 10);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsActive(false);
        setTimeout(onClose, 300);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email) {
            alert("Будь ласка, введіть ім'я та email.");
            return;
        }
        onSubmit(name, email);
    };

    return (
        <div className={`modal ${isActive ? 'active' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={handleClose}>✖</span>
                <h2>Забронювати</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Ім'я:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Введіть ім'я"
                    />
                    <label htmlFor="email">Електронна пошта:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Введіть пошту"
                    />
                    <button type="submit">Підтвердити бронювання</button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;