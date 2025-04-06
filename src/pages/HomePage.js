import React from 'react';
import '../styles/HomePage.css';
import { FiAward, FiShield, FiHeart, FiClock, FiUser, FiGlobe } from 'react-icons/fi';

function HomePage() {
    return (
        <main>
            <section id="hero">
                <div className="hero-content">
                    <h1>Ласкаво просимо на платформу бронювання турів!</h1>
                    <p>Відкрийте для себе найкращі тури за найвигіднішими цінами. Відпочинок на морі, екскурсійні тури, гірськолижні курорти — у нас є все, що вам потрібно!</p>
                    <a href="/HotToursPage" className="cta-button">Переглянути тури</a>
                </div>
            </section>

            <section id="features">
                <h2>Чому обирають нас?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <FiAward size={50} color="#f8d56b" />
                        <h3>Найкращі пропозиції</h3>
                        <p>Ми шукаємо для вас найвигідніші ціни на подорожі.</p>
                    </div>
                    <div className="feature-card">
                        <FiClock size={50} color="#f8d56b" />
                        <h3>Зручність бронювання</h3>
                        <p>Оформлення в один клік без зайвих турбот.</p>
                    </div>
                    <div className="feature-card">
                        <FiShield size={50} color="#f8d56b" />
                        <h3>Гарантія якості</h3>
                        <p>Ми працюємо тільки з перевіреними туроператорами.</p>
                    </div>
                    <div className="feature-card">
                        <FiHeart size={50} color="#f8d56b" />
                        <h3>Підтримка 24/7</h3>
                        <p>Наші консультанти завжди готові допомогти.</p>
                    </div>
                    <div className="feature-card">
                        <FiUser size={50} color="#f8d56b" />
                        <h3>Індивідуальний підхід</h3>
                        <p>Ми створюємо персоналізовані тури з урахуванням ваших уподобань.</p>
                    </div>
                    <div className="feature-card">
                        <FiGlobe size={50} color="#f8d56b" />
                        <h3>Безпека подорожей</h3>
                        <p>Страхування подорожей у подарунок та консультації щодо безпеки.</p>
                    </div>
                </div>
            </section>

            <section id="explore">
                <h2>Досліджуйте світ з нами</h2>
                <p>Ми пропонуємо широкий вибір гарячих турів з найкращими умовами для вашого відпочинку. Щоб побачити всі актуальні пропозиції, переходьте за посиланням нижче!</p>
                <a href="/HotToursPage" className="cta-button">Переглянути гарячі тури</a>
            </section>
        </main>
    )
}

export default HomePage;