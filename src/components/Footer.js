import React from "react";
import '../styles/Footer.css';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin } from 'react-icons/fa';

function Footer() {
    return (
        <footer>
            <p>Контактна інформація: example@example.com | Телефон: +380 12 345 67 89</p>

            <div className="social-links">
                <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">
                    <FaFacebook />
                </a>
                <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">
                    <FaInstagram />
                </a>
                <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                </a>
                <a href="https://youtube.com" className="social-link" target="_blank" rel="noopener noreferrer">
                    <FaYoutube />
                </a>
                <a href="https://linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                </a>
            </div>

            <div className="copyright">
                &copy; {new Date().getFullYear()} WanderWay. Усі права захищені.
            </div>
        </footer>
    )
}

export default Footer;