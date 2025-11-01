import AuthTabs from '../components/auth/AuthTabs'

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <aside className="auth-hero">
          <div className="hero-badge">Clinic Online</div>
          <h1>
            Chăm sóc sức khỏe <span>mọi lúc, mọi nơi</span>
          </h1>
          <p>
            Đặt lịch khám, theo dõi lịch sử và kết nối với bác sĩ chỉ trong vài bước đơn giản.
          </p>
          <ul>
            <li>Đăng ký tài khoản miễn phí</li>
            <li>Tra cứu lịch làm việc của bác sĩ</li>
            <li>Nhận thông báo nhắc lịch tự động</li>
          </ul>
        </aside>
        <section className="auth-content">
          <AuthTabs />
          <div className="tab-panel">{children}</div>
        </section>
      </div>
    </div>
  )
}

export default AuthLayout


