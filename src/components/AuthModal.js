import React, { useState, useEffect } from 'react';
import '../styles/modal.css';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { registerUser, loginUser } from './firebase';

const AuthModal = ({ onClose, initialMode = 'login' }) => {
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState(initialMode);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsActive(true);
        }, 10);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsActive(false);
        setTimeout(onClose, 300);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            if (mode === 'login') {
                const { success, error: loginError } = await loginUser(formData.email, formData.password);
                if (!success) {
                    setError(loginError || 'Невірний email або пароль');
                } else {
                    handleClose();
                }
            } else {
                const { success, error: registerError } = await registerUser(
                    formData.email,
                    formData.password,
                    formData.name
                );
                if (!success) {
                    setError(registerError || 'Помилка реєстрації');
                } else {
                    setMode('login');
                    setError('');
                    alert('Реєстрація успішна! Тепер ви можете увійти.');
                }
            }
        } catch (error) {
            setError('Сталася помилка. Спробуйте ще раз.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleMode = () => {
        setMode(prev => prev === 'login' ? 'register' : 'login');
        setError('');
    };

    return (
        <div className={`modal auth-modal ${isActive ? 'active' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={handleClose}>✖</span>
                <h3>{mode === 'login' ? 'Вхід' : 'Реєстрація'}</h3>

                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <div className="form-group">
                            <label htmlFor="name">
                                <FaUser style={{ marginRight: '8px' }} />
                                Ім'я
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Введіть ваше ім'я"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">
                            <FaEnvelope style={{ marginRight: '8px' }} />
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="example@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <FaLock style={{ marginRight: '8px' }} />
                            Пароль
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                            placeholder="Не менше 6 символів"
                        />
                    </div>

                    <div className="auth-actions">
                        <button
                            type="submit"
                            className="primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                'Завантаження...'
                            ) : (
                                mode === 'login' ? 'Увійти' : 'Зареєструватись'
                            )}
                        </button>
                        <button
                            type="button"
                            className="secondary"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Скасувати
                        </button>
                    </div>
                </form>

                <div className="auth-toggle">
                    {mode === 'login' ? (
                        <>Ще не зареєстровані? <span onClick={toggleMode}>Створити акаунт</span></>
                    ) : (
                        <>Вже є акаунт? <span onClick={toggleMode}>Увійти</span></>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;