import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/ProfilePage.css';
import { FiMail, FiPhone, FiSend, FiMapPin } from 'react-icons/fi';

// Додаємо іконки для маркерів (винесено на рівень модуля)
const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const ProfilePage = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) {
            const map = L.map('map').setView([49.8397, 24.0297], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const places = [
                {
                    name: "Площа Ринок",
                    lat: 49.8419, lng: 24.0315,
                    info: "Історичний центр Львова",
                    img: "/imgs/9.jpg"
                },
                {
                    name: "Оперний театр",
                    lat: 49.8440, lng: 24.0264,
                    info: "Львівський національний академічний театр опери та балету",
                    img: "/imgs/7.jfif"
                },
                {
                    name: "Високий Замок",
                    lat: 49.8500, lng: 24.0370,
                    info: "Найвища точка Львова, панорамний вид на місто",
                    img: "/imgs/3.webp"
                },
                {
                    name: "Личаківський цвинтар",
                    lat: 49.8390, lng: 24.0574,
                    info: "Один із найстаріших кладовищ Європи",
                    img: "/imgs/5.jpg"
                },
                {
                    name: "Арсенал",
                    lat: 49.8411, lng: 24.0335,
                    info: "Музей зброї у старовинній фортеці",
                    img: "/imgs/8.png"
                },
                {
                    name: "Домініканський собор",
                    lat: 49.8417, lng: 24.0345,
                    info: "Бароковий собор 18 століття",
                    img: "/imgs/10.webp"
                },
                {
                    name: "Шевченківський гай",
                    lat: 49.8503, lng: 24.0612,
                    info: "Етнографічний музей під відкритим небом",
                    img: "/imgs/4.jpg"
                },
                {
                    name: "Палац Потоцьких",
                    lat: 49.8378, lng: 24.0267,
                    info: "Розкішний палац 19 століття",
                    img: "/imgs/6.webp"
                }
            ];

            // Додаємо маркери з попапами
            places.forEach((place) => {
                const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);
                marker.bindPopup(`
                    <div style="text-align: center;">
                        <b>${place.name}</b><br>
                        <img src="${place.img}" alt="${place.name}" style="width:200px; border-radius:10px;"><br>
                        ${place.info}
                    </div>
                `);
            });

            mapRef.current = map;
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
        <div className="profile-page">
            <div className="contacts-header">
                <h2>Наші Контакти</h2>
            </div>

            <div className="contacts-container">
                <div className="contact-card">
                    <FiMail className="contact-icon" />
                    <h3>Email</h3>
                    <a href="mailto:example@example.com">example@example.com</a>
                </div>

                <div className="contact-card">
                    <FiPhone className="contact-icon" />
                    <h3>Телефон</h3>
                    <a href="tel:+380123456789">+380 12 345 67 89</a>
                </div>

                <div className="contact-card">
                    <FiSend className="contact-icon" />
                    <h3>Telegram</h3>
                    <a href="https://t.me/yourtelegram">@yourtelegram</a>
                </div>

                <div className="contact-card">
                    <FiMapPin className="contact-icon" />
                    <h3>Адреса</h3>
                    <p>вул. Виговського, 1, Львів</p>
                </div>
            </div>

            <div id="map"></div>
        </div>
    );
};

export default ProfilePage;