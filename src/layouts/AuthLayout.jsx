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
            Chăm sóc sức khỏe <span>bất cứ lúc nào, bất cứ đâu</span>
          </h1>
          <p>
            Đặt lịch hẹn, theo dõi lịch sử và kết nối với bác sĩ chỉ trong vài
            bước đơn giản.
          </p>
          <ul>
            <li>Đăng ký tài khoản miễn phí</li>
            <li>Kiểm tra lịch trình bác sĩ</li>
          </ul>
        </aside>
        <section className="auth-content">
          <AuthTabs />
          <div className="tab-panel">{children}</div>
          <Link to="/" className="back-home-button">
            Quay lại Trang chủ
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;
