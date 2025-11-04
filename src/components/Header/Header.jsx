import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./Header.css";
import logo from "../../assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );
  const location = useLocation();
  const headerRef = useRef(null);

  // tính chiều cao header
  useEffect(() => {
    if (headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      document.documentElement.style.setProperty(
        "--header-height",
        `${headerHeight}px`
      );
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find a Doctor", path: "/find-a-doctor" },
  ];

  // Add availability link for all logged-in users
  // Backend will handle authorization
  if (isLoggedIn) {
    navLinks.push({ name: "My Availability", path: "/doctor/my-availability" });
  }

  return (
    <>
      <div className="header-spacer" style={{ height: "var(--header-height)" }}></div>
      <header
        className={`header ${isScrolled ? "scrolled" : ""}`}
        ref={headerRef}
      >
        <div className="header-container">
          <Link to="/" className="header-logo">
            <img src={logo} alt="HealthCare Logo" />
          </Link>

          <nav className="header-nav desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${
                  location.pathname === link.path ? "active" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {!isLoggedIn && (
            <div className="header-actions">
              <Link to="/login" className="btn-login">
                Log In
              </Link>
              <Link to="/signup" className="btn-signup">
                Sign Up
              </Link>
              <button
                className="mobile-menu-btn"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
          {isLoggedIn && (
            <div className="header-actions">
              <button
                className="btn-logout"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  setIsLoggedIn(false);
                  window.location.href = "/";
                }}
              >
                Log Out
              </button>
              <button
                className="mobile-menu-btn"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}

          <nav
            className={`header-nav mobile-nav ${isMenuOpen ? "active" : ""}`}
          >
            <div className="mobile-nav-overlay" onClick={toggleMenu}></div>
            <div className="mobile-nav-content">
              <div className="mobile-nav-header">
                <Link to="/" className="mobile-logo">
                  <img src={logo} alt="HealthCare Logo" />
                </Link>
                <button
                  className="mobile-close-btn"
                  onClick={toggleMenu}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="mobile-nav-links">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`nav-link ${
                      location.pathname === link.path ? "active" : ""
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              {!isLoggedIn && (
                <div className="mobile-nav-actions">
                  <Link to="/login" className="btn-login" onClick={toggleMenu}>
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-signup"
                    onClick={toggleMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              {isLoggedIn && (
                <div className="mobile-nav-actions">
                  <button
                    className="btn-logout"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      setIsLoggedIn(false);
                      window.location.href = "/";
                    }}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
