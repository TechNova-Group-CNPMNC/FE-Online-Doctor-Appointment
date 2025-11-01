import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'

const LoginForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { email, password } = formData
      const response = await authAPI.login({ email, password })

      console.log('Login response:', response)

      // Store token and user info
      if (response.token || response.accessToken) {
        localStorage.setItem('token', response.token || response.accessToken)
      }
      if (response.user || response.data) {
        localStorage.setItem('user', JSON.stringify(response.user || response.data))
      }

      // Redirect to find doctor page
      navigate('/find-a-doctor')
    } catch (err) {
      console.error('Login error:', err)

      let errorMessage = 'Đăng nhập không thành công. Vui lòng thử lại.'

      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message ||
                      err.response.data?.error ||
                      `Lỗi: ${err.response.status}`
      } else if (err.request) {
        // Request was made but no response
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.'
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra lại.'
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} aria-labelledby="login-title">
      <h2 id="login-title">Đăng nhập</h2>
      <p className="form-subtitle">Nhập thông tin của bạn để tiếp tục đặt lịch khám.</p>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <label className="input-group">
        <span>Email</span>
        <input
          type="email"
          name="email"
          placeholder="name@example.com"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />
      </label>

      <label className="input-group">
        <span>Mật khẩu</span>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
        />
      </label>

      <div className="form-actions">
        <label className="checkbox">
          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            disabled={loading}
          />
          <span>Ghi nhớ tôi</span>
        </label>
        <Link to="#" className="link">
          Quên mật khẩu?
        </Link>
      </div>

      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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