import React, { useState, useEffect, useCallback } from 'react';
import '../styles/modal.css';
import { FaStar, FaRegStar, FaUser, FaSpinner } from 'react-icons/fa';
import {addReviewWithCheck, auth, containsForbiddenWords, db} from './firebase';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';

const TourInfoModal = ({ tour, onClose }) => {
    const [isActive, setIsActive] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const loadReviews = useCallback(async () => {
        if (!tour) return;

        setIsLoading(true);
        setError(null);
        try {
            const q = query(
                collection(db, "reviews"),
                where("tourId", "==", tour.id),
                orderBy("rating", "desc") // Сортуємо за рейтингом (від найвищого)
            );
            const snapshot = await getDocs(q);
            const reviewsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));

            setReviews(reviewsData);

            // Розраховуємо середній рейтинг
            if (reviewsData.length > 0) {
                const total = reviewsData.reduce((sum, review) => sum + review.rating, 0);
                const average = total / reviewsData.length;
                setAverageRating(parseFloat(average.toFixed(1)));
            } else {
                setAverageRating(0);
            }
        } catch (err) {
            setError('Не вдалося завантажити відгуки');
            console.error('Помилка завантаження:', err);
        } finally {
            setIsLoading(false);
        }
    }, [tour]);

    useEffect(() => {
        setIsActive(true);
        loadReviews();
    }, [loadReviews]);

    const handleClose = () => {
        setIsActive(false);
        setTimeout(onClose, 300);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!rating) {
            setError('Будь ласка, оберіть рейтинг');
            return;
        }
        if (!comment.trim()) {
            setError('Будь ласка, введіть коментар');
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            setError('Будь ласка, увійдіть для залишення відгуку');
            return;
        }

        // Перевірка на заборонені слова на клієнті (опціонально)
        if (containsForbiddenWords(comment)) {
            setError('Відгук містить заборонені слова');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const reviewData = {
                tourId: tour.id,
                userId: user.uid,
                userName: user.displayName || 'Анонім',
                rating,
                comment: comment.trim(),
                createdAt: serverTimestamp()
            };

            const docRef = await addReviewWithCheck(reviewData); // Використовуємо нову функцію

            // Оптимістичне оновлення
            const newReview = {
                id: docRef.id,
                ...reviewData,
                createdAt: new Date()
            };

            const updatedReviews = [newReview, ...reviews];
            setReviews(updatedReviews);

            // Оновлюємо середній рейтинг
            const total = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
            const average = total / updatedReviews.length;
            setAverageRating(parseFloat(average.toFixed(1)));

            setComment('');
            setRating(0);
            handleClose();
        } catch (err) {
            setError(err.message || 'Помилка при відправці відгуку');
            console.error('Помилка відправки:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!tour) return null;

    return (
        <div className={`modal tour-info-modal ${isActive ? 'active' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={handleClose}>✖</span>
                <h3>{tour.title}</h3>

                {/* Відображення середнього рейтингу */}
                {reviews.length > 0 && (
                    <div className="average-rating">
                        <div className="average-rating-value">
                            <span>{averageRating}</span>/5
                        </div>
                        <div className="average-rating-stars">
                            {[...Array(5)].map((_, i) => (
                                i < Math.round(averageRating) ? (
                                    <FaStar key={i} color="#f8d56b" />
                                ) : (
                                    <FaRegStar key={i} color="#f8d56b" />
                                )
                            ))}
                        </div>
                        <div className="average-rating-count">
                            ({reviews.length} {reviews.length === 1 ? 'відгук' : reviews.length < 5 ? 'відгуки' : 'відгуків'})
                        </div>
                    </div>
                )}

                <div className="tour-description" dangerouslySetInnerHTML={{ __html: tour.description }} />

                <div className="reviews-section">
                    <h4>Відгуки</h4>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {auth.currentUser ? (
                        <form className="review-form" onSubmit={handleSubmitReview}>
                            <div className="rating-input">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        onClick={() => !isSubmitting && setRating(star)}
                                        style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                                    >
                                        {star <= rating ? (
                                            <FaStar color="#f8d56b" />
                                        ) : (
                                            <FaRegStar />
                                        )}
                                    </span>
                                ))}
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => !isSubmitting && setComment(e.target.value)}
                                placeholder="Залиште свій відгук..."
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="submit-review-btn"
                            >
                                {isSubmitting ? (
                                    <>
                                        <FaSpinner className="spin" /> Відправка...
                                    </>
                                ) : (
                                    'Надіслати відгук'
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="auth-required">
                            <p>Увійдіть, щоб залишити відгук</p>
                        </div>
                    )}

                    <div className="reviews-list">
                        {isLoading ? (
                            <div className="loading-reviews">
                                <FaSpinner className="spin" /> Завантаження відгуків...
                            </div>
                        ) : reviews.length === 0 ? (
                            <p>Ще немає відгуків для цього туру</p>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="review-item">
                                    <div className="review-header">
                                        <div className="user-info">
                                            <FaUser className="user-icon" />
                                            <span>{review.userName}</span>
                                        </div>
                                        <div className="review-rating">
                                            {[...Array(5)].map((_, i) => (
                                                i < review.rating ? (
                                                    <FaStar key={i} color="#f8d56b" />
                                                ) : (
                                                    <FaRegStar key={i} />
                                                )
                                            ))}
                                        </div>
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                    <div className="review-date">
                                        {review.createdAt?.toLocaleDateString() || 'Сьогодні'}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourInfoModal;