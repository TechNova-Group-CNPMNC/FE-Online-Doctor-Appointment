import { Link } from 'react-router-dom'

const SignupForm = () => {
  return (
    <form className="form" aria-labelledby="signup-title">
      <h2 id="signup-title">Đăng ký</h2>
      <p className="form-subtitle">Tạo tài khoản để quản lý lịch khám và thông tin sức khỏe.</p>
      <label className="input-group">
        <span>Họ và tên</span>
        <input type="text" name="fullName" placeholder="Nguyễn Văn A" autoComplete="name" required />
      </label>
      <label className="input-group">
        <span>Email</span>
        <input type="email" name="email" placeholder="name@example.com" autoComplete="email" required />
      </label>
      <label className="input-group">
        <span>Số điện thoại</span>
        <input type="tel" name="phone" placeholder="0912 345 678" autoComplete="tel" required />
      </label>
      <label className="input-group">
        <span>Mật khẩu</span>
        <input type="password" name="password" placeholder="••••••••" autoComplete="new-password" required />
      </label>
      <label className="input-group">
        <span>Nhập lại mật khẩu</span>
        <input type="password" name="confirmPassword" placeholder="••••••••" autoComplete="new-password" required />
      </label>
      <button type="submit" className="primary-button">
        Tạo tài khoản
      </button>
      <p className="form-footer">
        Đã có tài khoản?{' '}
        <Link to="/login" className="link">
          Đăng nhập
        </Link>
      </p>
    </form>
  )
}

export default SignupForm

