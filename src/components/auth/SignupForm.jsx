import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'

const SignupForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: 'MALE'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp')
      return false
    }
    if (formData.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự')
      return false
    }
    if (!formData.dateOfBirth) {
      setError('Vui lòng chọn ngày sinh')
      return false
    }
    if (!formData.phoneNumber.startsWith('+84')) {
      setError('Số điện thoại phải bắt đầu với +84')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const { confirmPassword, ...registerData } = formData
      console.log('Sending registration data:', registerData)

      const response = await authAPI.register(registerData)

      console.log('Registration response:', response)

      // Store token and user info if returned
      if (response.token || response.accessToken) {
        localStorage.setItem('token', response.token || response.accessToken)
      }
      if (response.user || response.data) {
        localStorage.setItem('user', JSON.stringify(response.user || response.data))
      }

      // Redirect to login or home page
      navigate('/login', {
        state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' }
      })
    } catch (err) {
      console.error('Registration error:', err)

      let errorMessage = 'Đăng ký không thành công. Vui lòng thử lại.'

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
    <form className="form" onSubmit={handleSubmit} aria-labelledby="signup-title">
      <h2 id="signup-title">Đăng ký</h2>
      <p className="form-subtitle">Tạo tài khoản để quản lý lịch khám và thông tin sức khỏe.</p>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <label className="input-group">
        <span>Họ và tên</span>
        <input
          type="text"
          name="fullName"
          placeholder="Nguyễn Văn A"
          autoComplete="name"
          required
          value={formData.fullName}
          onChange={handleChange}
          disabled={loading}
        />
      </label>

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
        <span>Số điện thoại</span>
        <input
          type="tel"
          name="phoneNumber"
          placeholder="+84901234567"
          autoComplete="tel"
          required
          value={formData.phoneNumber}
          onChange={handleChange}
          disabled={loading}
        />
      </label>

      <label className="input-group">
        <span>Ngày sinh</span>
        <input
          type="date"
          name="dateOfBirth"
          required
          value={formData.dateOfBirth}
          onChange={handleChange}
          disabled={loading}
          max={new Date().toISOString().split('T')[0]}
        />
      </label>

      <label className="input-group">
        <span>Giới tính</span>
        <select
          name="gender"
          required
          value={formData.gender}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="MALE">Nam</option>
          <option value="FEMALE">Nữ</option>
          <option value="OTHER">Khác</option>
        </select>
      </label>

      <label className="input-group">
        <span>Mật khẩu</span>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          minLength={8}
        />
      </label>

      <label className="input-group">
        <span>Nhập lại mật khẩu</span>
        <input
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          autoComplete="new-password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={loading}
          minLength={8}
        />
      </label>

      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
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