import React, { useState } from 'react';
import { auth } from './firebase';
import TourInfoModal from './TourInfoModal';

const Tours = ({ tours, onBookTour, onLoginRequired }) => {
    const [selectedTour, setSelectedTour] = useState(null);

    const handleInfoClick = (tour) => {
        setSelectedTour(tour);
    };

    const handleCloseModal = () => {
        setSelectedTour(null);
    };

    const handleBookClick = (tourId) => {
        if (!auth.currentUser) {
            onLoginRequired();
            return;
        }
        onBookTour(tourId);
    };

    return (
        <div className="product-container">
            {tours.map(tour => (
                <div key={tour.id} className="product-card">
                    <div className="card-front">
                        <img src={tour.img} alt={tour.title} />
                        <h3>{tour.title}</h3>
                        <p>Тривалість: {tour.duration}</p>
                        <p>Ціна: {tour.price.toLocaleString()} грн</p>
                        <button onClick={() => handleBookClick(tour.id)}>
                            {auth.currentUser ? 'Забронювати' : 'Увійдіть для бронювання'}
                        </button>
                        <span
                            className="info-icon"
                            onClick={() => handleInfoClick(tour)}
                            title="Детальніше"
                        >
                            ?
                        </span>
                    </div>
                </div>
            ))}
            {selectedTour && (
                <TourInfoModal
                    tour={selectedTour}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default Tours;