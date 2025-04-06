import React, { useState, useEffect } from 'react';
import Tours from '../components/Tours';
import BookingModal from '../components/BookingModal';
import AuthModal from '../components/AuthModal';
import '../styles/ToursPage.css';
import '../styles/modal.css';
import '../styles/SortButton.css';
import { db } from '../components/firebase';
import { collection, getDocs } from 'firebase/firestore';

const HotToursPage = () => {
    const [tours, setTours] = useState([]);
    const [originalTours, setOriginalTours] = useState([]);
    const [bookedTours, setBookedTours] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedTourId, setSelectedTourId] = useState(null);
    const [sortMethod, setSortMethod] = useState('default');
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const toursCollection = collection(db, 'tours');
                const toursSnapshot = await getDocs(toursCollection);
                const toursData = toursSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setTours(toursData);
                setOriginalTours(toursData);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching tours:", error);
                setIsLoading(false);
            }
        };

        fetchTours();

        const storedBookings = JSON.parse(localStorage.getItem("bookedTours")) || [];
        setBookedTours(storedBookings);
    }, []);

    const handleBookTour = (tourId) => {
        setSelectedTourId(tourId);
        setShowBookingModal(true);
    };

    const handleLoginRequired = () => {
        setShowAuthModal(true);
    };

    const handleSubmitBooking = (name, email) => {
        const newBooking = { tourId: selectedTourId, name, email };
        const updatedBookings = [...bookedTours, newBooking];
        setBookedTours(updatedBookings);
        localStorage.setItem("bookedTours", JSON.stringify(updatedBookings));
        setShowBookingModal(false);
    };

    const handleSort = (method) => {
        let sortedTours = [...originalTours];

        switch(method) {
            case 'price-asc':
                sortedTours.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedTours.sort((a, b) => b.price - a.price);
                break;
            case 'duration-asc':
                sortedTours.sort((a, b) => {
                    const durationA = parseInt(a.duration);
                    const durationB = parseInt(b.duration);
                    return durationA - durationB;
                });
                break;
            case 'duration-desc':
                sortedTours.sort((a, b) => {
                    const durationA = parseInt(a.duration);
                    const durationB = parseInt(b.duration);
                    return durationB - durationA;
                });
                break;
            case 'alphabet-asc':
                sortedTours.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'alphabet-desc':
                sortedTours.sort((a, b) => b.title.localeCompare(a.title));
                break;
            default:
                sortedTours = [...originalTours];
        }

        setTours(sortedTours);
        setSortMethod(method);
        setShowSortOptions(false);
    };

    const getSortMethodLabel = () => {
        switch(sortMethod) {
            case 'price-asc': return 'Ціна (від дешевих)';
            case 'price-desc': return 'Ціна (від дорогих)';
            case 'duration-asc': return 'Тривалість (коротші)';
            case 'duration-desc': return 'Тривалість (довші)';
            case 'alphabet-asc': return 'Назва (А-Я)';
            case 'alphabet-desc': return 'Назва (Я-А)';
            default: return 'Сортування';
        }
    };

    if (isLoading) {
        return <div className="loading">Завантаження турів...</div>;
    }

    return (
        <div className="hot-tours-container">
            <section id="Products">
                <div className="tours-header">
                    <h2>Гарячі тури</h2>
                    <div className="sort-dropdown">
                        <button
                            className="sort-button"
                            onClick={() => setShowSortOptions(!showSortOptions)}
                        >
                            {getSortMethodLabel()}
                            <span className={`dropdown-arrow ${showSortOptions ? 'open' : ''}`}>▼</span>
                        </button>
                        {showSortOptions && (
                            <div className="sort-options">
                                <div className="sort-option-group">
                                    <div className="sort-option-title">За ціною</div>
                                    <button
                                        onClick={() => handleSort('price-asc')}
                                        className={`sort-option ${sortMethod === 'price-asc' ? 'active' : ''}`}
                                    >
                                        Від дешевих до дорогих
                                    </button>
                                    <button
                                        onClick={() => handleSort('price-desc')}
                                        className={`sort-option ${sortMethod === 'price-desc' ? 'active' : ''}`}
                                    >
                                        Від дорогих до дешевих
                                    </button>
                                </div>
                                <div className="sort-option-group">
                                    <div className="sort-option-title">За тривалістю</div>
                                    <button
                                        onClick={() => handleSort('duration-asc')}
                                        className={`sort-option ${sortMethod === 'duration-asc' ? 'active' : ''}`}
                                    >
                                        Від коротких до довгих
                                    </button>
                                    <button
                                        onClick={() => handleSort('duration-desc')}
                                        className={`sort-option ${sortMethod === 'duration-desc' ? 'active' : ''}`}
                                    >
                                        Від довгих до коротких
                                    </button>
                                </div>
                                <div className="sort-option-group">
                                    <div className="sort-option-title">За назвою</div>
                                    <button
                                        onClick={() => handleSort('alphabet-asc')}
                                        className={`sort-option ${sortMethod === 'alphabet-asc' ? 'active' : ''}`}
                                    >
                                        Від А до Я
                                    </button>
                                    <button
                                        onClick={() => handleSort('alphabet-desc')}
                                        className={`sort-option  ${sortMethod === 'alphabet-desc' ? 'active' : ''}`}
                                    >
                                        Від Я до А
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <Tours
                    tours={tours}
                    onBookTour={handleBookTour}
                    onLoginRequired={handleLoginRequired}
                />
            </section>
            {showBookingModal && (
                <BookingModal
                    onClose={() => setShowBookingModal(false)}
                    onSubmit={handleSubmitBooking}
                />
            )}
            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    initialMode="login"
                />
            )}
        </div>
    );
};

export default HotToursPage;