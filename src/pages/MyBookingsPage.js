import React, { useEffect, useState } from 'react';
import '../styles/MyBookingsPage.css';
import { FaTrashAlt, FaCalendarAlt, FaUser, FaEnvelope } from 'react-icons/fa';

const MyBookingsPage = () => {
    const [bookedTours, setBookedTours] = useState([]);
    const [toursData, setToursData] = useState([]);

    useEffect(() => {
        // Завантаження бронювань і даних турів
        const storedBookings = JSON.parse(localStorage.getItem("bookedTours")) || [];
        const initialTours = [
            { id: 1, title: "Екскурсії у Львові", duration: "7 днів", price: 15000 },
            { id: 2, title: "Тур в Карпати", duration: "3 дні", price: 12000 },
            { id: 3, title: "Тур до Антарктиди", duration: "10 днів", price: 220000 },
            { id: 4, title: "Тур до Африки", duration: "15 днів", price: 150000 },
            { id: 5, title: "Тур до Єгипту", duration: "11 днів", price: 85600 },
            { id: 6, title: "Тур до Тайланду", duration: "8 днів", price: 75896 },
        ];

        setBookedTours(storedBookings);
        setToursData(initialTours);
    }, []);

    const handleCancelBooking = (index) => {
        const updatedBookings = [...bookedTours];
        updatedBookings.splice(index, 1);
        setBookedTours(updatedBookings);
        localStorage.setItem("bookedTours", JSON.stringify(updatedBookings));
    };

    const getTourDetails = (tourId) => {
        return toursData.find(tour => tour.id === tourId) || {};
    };

    return (
        <div className="my-bookings-container">
            <div className="bookings-header">
                <h2>Мої бронювання</h2>
                <div className="header-decoration"></div>
            </div>

            {bookedTours.length === 0 ? (
                <div className="no-bookings">
                    <div className="empty-state">
                        <h3>У вас немає активних бронювань</h3>
                        <p>Поверніться на головну сторінку, щоб знайти ідеальний тур!</p>
                    </div>
                </div>
            ) : (
                <div className="bookings-grid">
                    {bookedTours.map((booking, index) => {
                        const tour = getTourDetails(booking.tourId);
                        return (
                            <div key={index} className="booking-card">
                                <div className="card-content">
                                    <h3>{tour.title || `Тур ID: ${booking.tourId}`}</h3>
                                    <div className="booking-details">
                                        <div className="detail-item">
                                            <FaCalendarAlt className="detail-icon" />
                                            <span>{tour.duration || 'Невідомо'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="price">{tour.price ? `${tour.price.toLocaleString()} грн` : 'Ціна невідома'}</span>
                                        </div>
                                    </div>
                                    <div className="user-info">
                                        <div className="info-item">
                                            <span>{booking.name}</span>
                                        </div>
                                        <div className="info-item">
                                            <span>{booking.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleCancelBooking(index)}
                                    className="cancel-btn"
                                >
                                    <FaTrashAlt /> Скасувати
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;