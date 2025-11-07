import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { isDoctor, isAuthenticated } from "../../util/jwtdecoder";
import logo from "../../assets/logo.png";
import "./Header.css";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAuth = isAuthenticated();
  const isDoctorUser = isDoctor();

  const isActive = (path) => location.pathname === path;

  const headerRef = useRef(null);

  useEffect(() => {
    const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0;
    document.body.style.paddingTop = `${headerHeight}px`;
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <header className="header" ref={headerRef}>
        <div className="header-container">
          <Link to="/" className="header-logo">
            <img src={logo} alt="Đặt lịch bác sĩ" />
          </Link>

          <nav className="header-nav desktop-nav">
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
            >
              Trang chủ
            </Link>

            {isAuth && !isDoctorUser && (
              <Link
                to="/find-a-doctor"
                className={`nav-link ${
                  isActive("/find-a-doctor") ? "active" : ""
                }`}
              >
                Tìm bác sĩ
              </Link>
            )}
            {isAuth && isDoctorUser && (
              <Link
                to="/doctor/my-availability"
                className={`nav-link ${
                  isActive("/doctor/my-availability") ? "active" : ""
                }`}
              >
                Lịch trình của tôi
              </Link>
            )}

            {isAuth && !isDoctorUser && (
              <Link
                to="/appointments"
                className={`nav-link ${
                  isActive("/appointments") ? "active" : ""
                }`}
              >
                Lịch khám
              </Link>
            )}
            <Link
              to="/about"
              className={`nav-link ${isActive("/about") ? "active" : ""}`}
            >
              Giới thiệu
            </Link>
            <Link
              to="/contact"
              className={`nav-link ${isActive("/contact") ? "active" : ""}`}
            >
              Liên hệ
            </Link>
          </nav>

          <div className="header-actions">
            {!isAuth ? (
              <>
                <Link to="/login" className="btn-login">
                  Đăng nhập
                </Link>
                <Link to="/signup" className="btn-signup">
                  Đăng ký
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn-login lgout">
                Đăng xuất
              </button>
            )}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M3 12h18M3 6h18M3 18h18"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className={`mobile-nav ${isMobileMenuOpen ? "active" : ""}`}>
            <div
              className="mobile-nav-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="mobile-nav-content">
              <div className="mobile-nav-header">
                <Link to="/" className="mobile-logo">
                  <img src={logo} alt="Đặt lịch bác sĩ" />
                </Link>
                <button
                  className="mobile-close-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="mobile-nav-links">
                <Link
                  to="/"
                  className={`nav-link ${isActive("/") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Trang chủ
                </Link>

                {isAuth && !isDoctorUser && (
                  <Link
                    to="/find-a-doctor"
                    className={`nav-link ${
                      isActive("/find-a-doctor") ? "active" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tìm bác sĩ
                  </Link>
                )}

                {isAuth && isDoctorUser && (
                  <Link
                    to="/doctor/my-availability"
                    className={`nav-link ${
                      isActive("/doctor/my-availability") ? "active" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Lịch trình của tôi
                  </Link>
                )}

                {isAuth && !isDoctorUser && (
                  <Link
                    to="/appointments"
                    className={`nav-link ${
                      isActive("/appointments") ? "active" : ""
                    }`}
                  >
                    Lịch khám
                  </Link>
                )}
                <Link
                  to="/about"
                  className={`nav-link ${isActive("/about") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Giới thiệu
                </Link>
                <Link
                  to="/contact"
                  className={`nav-link ${isActive("/contact") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Liên hệ
                </Link>
              </div>

              <div className="mobile-nav-actions">
                {!isAuth ? (
                  <>
                    <Link
                      to="/login"
                      className="btn-login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/signup"
                      className="btn-signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Đăng ký
                    </Link>
                  </>
                ) : (
                  <button onClick={handleLogout} className="btn-login">
                    Đăng xuất
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
