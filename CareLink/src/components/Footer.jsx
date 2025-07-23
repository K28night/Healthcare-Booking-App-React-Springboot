// components/Footer.js
import React from 'react';
import '../styles/Footer.css';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import { FaYoutube, FaInstagram, FaFacebookF } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Branding and Socials */}
        <div className="footer-section">
          <h2 className="footer-logo">CareLink</h2>
          <p className="footer-description">
            A modern healthcare demo platform designed for seamless appointment booking and user experience.
          </p>
          <div className="footer-social">
            <FaFacebookF />
            <FaYoutube />
            <FaInstagram />
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li>About Us</li>
            <li>FAQs</li>
            <li>Our Team</li>
            <li>Blog</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p><FaEnvelope className="icon" /> support@carelink.demo</p>
          <p><FaPhone className="icon" /> +91 90000 00000</p>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2025 CareLink | Demo Project</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Disclaimer</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
