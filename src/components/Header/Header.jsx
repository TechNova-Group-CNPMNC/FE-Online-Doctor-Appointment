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

  //tính chiều cao header
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
      {/* <div
        style={{
          height: headerRef.current ? headerRef.current.offsetHeight : 0,
        }}
      ></div> */}
      <header className="header" ref={headerRef}>
        <div className="header-container">
          <Link to="/" className="header-logo">
            <img src={logo} alt="Doctor Appointment" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="header-nav desktop-nav">
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/find-a-doctor"
              className={`nav-link ${
                isActive("/find-a-doctor") ? "active" : ""
              }`}
            >
              Find a Doctor
            </Link>
            {/* <Link
              to="/create-appointment"
              className={`nav-link ${
                isActive("/create-appointment") ? "active" : ""
              }`}
            >
              Create Appointment
            </Link> */}
            {/* {isAuth && !isDoctorUser && (
              <Link
                to="/create-appointment"
                className={`nav-link ${
                  isActive("/create-appointment") ? "active" : ""
                }`}
              >
                Create Appointment
              </Link>
            )} */}
            {isAuth && isDoctorUser && (
              <Link
                to="/doctor/my-availability"
                className={`nav-link ${
                  isActive("/doctor/my-availability") ? "active" : ""
                }`}
              >
                My Availability
              </Link>
            )}
            <Link
              to="/about"
              className={`nav-link ${isActive("/about") ? "active" : ""}`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`nav-link ${isActive("/contact") ? "active" : ""}`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="header-actions">
            {!isAuth ? (
              <>
                <Link to="/login" className="btn-login">
                  Login
                </Link>
                <Link to="/signup" className="btn-signup">
                  Sign Up
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn-login">
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
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

          {/* Mobile Navigation */}
          <div className={`mobile-nav ${isMobileMenuOpen ? "active" : ""}`}>
            <div
              className="mobile-nav-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="mobile-nav-content">
              <div className="mobile-nav-header">
                <Link to="/" className="mobile-logo">
                  <img src="/logo.png" alt="Doctor Appointment" />
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
                  Home
                </Link>
                <Link
                  to="/about"
                  className={`nav-link ${isActive("/about") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/find-a-doctor"
                  className={`nav-link ${
                    isActive("/find-a-doctor") ? "active" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Find a Doctor
                </Link>
                <Link
                  to="/contact"
                  className={`nav-link ${isActive("/contact") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                {isAuth && isDoctorUser && (
                  <Link
                    to="/doctor/my-availability"
                    className={`nav-link ${
                      isActive("/doctor/my-availability") ? "active" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Availability
                  </Link>
                )}
              </div>

              <div className="mobile-nav-actions">
                {!isAuth ? (
                  <>
                    <Link
                      to="/login"
                      className="btn-login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="btn-signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <button onClick={handleLogout} className="btn-login">
                    Logout
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
