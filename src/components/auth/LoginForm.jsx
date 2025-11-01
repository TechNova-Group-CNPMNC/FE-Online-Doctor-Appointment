import { Link } from 'react-router-dom'

const LoginForm = () => {
  return (
    <form className="form" aria-labelledby="login-title">
      <h2 id="login-title">Đăng nhập</h2>
      <p className="form-subtitle">Nhập thông tin của bạn để tiếp tục đặt lịch khám.</p>
      <label className="input-group">
        <span>Email</span>
        <input type="email" name="email" placeholder="name@example.com" autoComplete="email" required />
      </label>
      <label className="input-group">
        <span>Mật khẩu</span>
        <input type="password" name="password" placeholder="••••••••" autoComplete="current-password" required />
      </label>
      <div className="form-actions">
        <label className="checkbox">
          <input type="checkbox" name="remember" />
          <span>Ghi nhớ tôi</span>
        </label>
        <Link to="#" className="link">
          Quên mật khẩu?
        </Link>
      </div>
      <button type="submit" className="primary-button">
        Đăng nhập
      </button>
      <p className="form-footer">
        Chưa có tài khoản?{' '}
        <Link to="/signup" className="link">
          Đăng ký ngay
        </Link>
      </p>
    </form>
  )
}

export default LoginForm

