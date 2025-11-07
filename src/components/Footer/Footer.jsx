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
              Nền tảng đáng tin cậy của bạn để tìm kiếm và đặt lịch hẹn với các
              bác sĩ có trình độ. Chăm sóc sức khỏe chất lượng được tiếp cận dễ
              dàng.
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
            <h4 className="footer-title">Liên kết nhanh</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li>
                <Link to="/find-a-doctor">Tìm bác sĩ</Link>
              </li>
              <li>
                <Link to="/about">Giới thiệu</Link>
              </li>
              <li>
                <Link to="/contact">Liên hệ</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">Dịch vụ</h4>
            <ul className="footer-links">
              <li>
                <Link to="/find-a-doctor">Đặt lịch hẹn</Link>
              </li>
              <li>
                {/* <Link to="/find-a-doctor">Tư vấn trực tuyến</Link> */}
              </li>
              <li>
                <Link to="/find-a-doctor">Tìm chuyên gia</Link>
              </li>
              <li>
                <Link to="/profile">Lịch hẹn của tôi</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} TechNova. Tất cả quyền được bảo lưu.
          </p>
          <div className="footer-legal">
            <Link to="/privacy">Chính sách bảo mật</Link>
            <span className="separator">•</span>
            <Link to="/terms">Điều khoản dịch vụ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
