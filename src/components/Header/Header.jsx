import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'
import logo from '../../assets/logo.png'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Appointment', path: '/appointment' },
    { name: 'Contact', path: '/contact' },
    { name: 'About', path: '/about' }
  ]

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
        <img src={logo} alt="logo" />
        </Link>

        <nav className="header-nav desktop-nav">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

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
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="menu-icon"
            >
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12"/>
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16"/>
              )}
            </svg>
          </button>
        </div>

        <nav className={`header-nav mobile-nav ${isMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header

