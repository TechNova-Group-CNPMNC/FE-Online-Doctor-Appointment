import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <h3 className="footer-logo">TechNova</h3>
            <p className="footer-description">
              Your trusted platform for finding and booking appointments with
              qualified doctors. Quality healthcare made accessible.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/find-a-doctor">Find a Doctor</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">Services</h4>
            <ul className="footer-links">
              <li>
                <Link to="/find-a-doctor">Book Appointment</Link>
              </li>
              <li>
                <Link to="/find-a-doctor">Online Consultation</Link>
              </li>
              <li>
                <Link to="/find-a-doctor">Find Specialists</Link>
              </li>
              <li>
                <Link to="/profile">My Appointments</Link>
              </li>
            </ul>
          </div>

          {/* <div className="footer-column">
            <h4 className="footer-title">Contact Info</h4>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} />
                <span>123 Healthcare Street, Medical District</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li>
                <Mail size={18} />
                <span>support@healthcare.com</span>
              </li>
            </ul>
          </div> */}
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} TechNova. All rights reserved.
          </p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="separator">•</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
