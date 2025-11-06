import { Link } from "react-router-dom";
import AuthTabs from "../components/auth/AuthTabs";
import "./AuthLayout.css";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <aside className="auth-hero">
          <div className="hero-badge">HealthCare</div>
          <h1>
            Healthcare <span>anytime, anywhere</span>
          </h1>
          <p>
            Book appointments, track history, and connect with doctors in just a
            few simple steps.
          </p>
          <ul>
            <li>Free account registration</li>
            <li>Check doctor schedules</li>
          </ul>
        </aside>
        <section className="auth-content">
          <AuthTabs />
          <div className="tab-panel">{children}</div>
          <Link to="/" className="back-home-button">
            Back to Home
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;
