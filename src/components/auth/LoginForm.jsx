import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })
  const [submitMessage, setSubmitMessage] = useState('')

  const onSubmit = async (values) => {
    setSubmitMessage('')
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      console.log('Login payload', values)
      setSubmitMessage('Đăng nhập thành công (demo).')
    } catch (error) {
      setSubmitMessage('Có lỗi xảy ra, vui lòng thử lại.')
    }
  }

  return (
    <form className="form" aria-labelledby="login-title" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 id="login-title">Đăng nhập</h2>
      <p className="form-subtitle">Nhập thông tin của bạn để tiếp tục đặt lịch khám.</p>

      <label className="input-group">
        <span>Email</span>
        <input
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register('email', {
            required: 'Email không được để trống.',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Định dạng email không hợp lệ.',
            },
          })}
        />
        {errors.email ? <p className="input-message error">{errors.email.message}</p> : null}
      </label>

      <label className="input-group">
        <span>Mật khẩu</span>
        <input
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          {...register('password', {
            required: 'Mật khẩu không được để trống.',
            minLength: {
              value: 6,
              message: 'Mật khẩu phải có ít nhất 6 ký tự.',
            },
          })}
        />
        {errors.password ? <p className="input-message error">{errors.password.message}</p> : null}
      </label>

      <div className="form-actions">
        <label className="checkbox">
          <input type="checkbox" {...register('remember')} />
          <span>Ghi nhớ tôi</span>
        </label>
        <Link to="#" className="link">
          Quên mật khẩu?
        </Link>
      </div>

      {submitMessage ? <p className="input-message success">{submitMessage}</p> : null}

      <button type="submit" className="primary-button" disabled={isSubmitting}>
        {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
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

