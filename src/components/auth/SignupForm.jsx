import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      password: '',
      confirmPassword: '',
    },
  })
  const [submitMessage, setSubmitMessage] = useState('')
  const passwordValue = watch('password')

  const onSubmit = async (values) => {
    setSubmitMessage('')
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      console.log('Signup payload', values)
      setSubmitMessage('Tạo tài khoản thành công (demo).')
      reset()
    } catch (error) {
      setSubmitMessage('Không thể tạo tài khoản, vui lòng thử lại.')
    }
  }

  return (
    <form className="form" aria-labelledby="signup-title" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 id="signup-title">Đăng ký</h2>
      <p className="form-subtitle">Tạo tài khoản để quản lý lịch khám và thông tin sức khỏe.</p>

      <label className="input-group">
        <span>Họ và tên</span>
        <input
          type="text"
          placeholder="Nguyễn Văn A"
          autoComplete="name"
          aria-invalid={Boolean(errors.fullName)}
          {...register('fullName', {
            required: 'Họ và tên không được để trống.',
            minLength: {
              value: 4,
              message: 'Họ và tên phải có ít nhất 4 ký tự.',
            },
          })}
        />
        {errors.fullName ? <p className="input-message error">{errors.fullName.message}</p> : null}
      </label>

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
        <span>Số điện thoại</span>
        <input
          type="tel"
          placeholder="0912 345 678"
          autoComplete="tel"
          aria-invalid={Boolean(errors.phone)}
          {...register('phone', {
            required: 'Số điện thoại không được để trống.',
            pattern: {
              value: /^(0|\+84)(\d{9}|\d{10})$/,
              message: 'Số điện thoại không hợp lệ.',
            },
          })}
        />
        {errors.phone ? <p className="input-message error">{errors.phone.message}</p> : null}
      </label>

      <div className="form-grid">
        <label className="input-group">
          <span>Ngày sinh</span>
          <input
            type="date"
            aria-invalid={Boolean(errors.dateOfBirth)}
            {...register('dateOfBirth', {
              required: 'Vui lòng chọn ngày sinh.',
              validate: (value) => {
                if (!value) return true
                const selectedDate = new Date(value)
                const today = new Date()
                return selectedDate <= today || 'Ngày sinh không hợp lệ.'
              },
            })}
          />
          {errors.dateOfBirth ? <p className="input-message error">{errors.dateOfBirth.message}</p> : null}
        </label>

        <label className="input-group">
          <span>Giới tính</span>
          <div className="segment-control" role="radiogroup" aria-label="Giới tính">
            {[
              { label: 'Nam', value: 'male' },
              { label: 'Nữ', value: 'female' },
              { label: 'Khác', value: 'other' },
            ].map((option) => (
              <label key={option.value} className="segment-option">
                <input
                  type="radio"
                  value={option.value}
                  {...register('gender', {
                    required: 'Vui lòng chọn giới tính.',
                  })}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {errors.gender ? <p className="input-message error">{errors.gender.message}</p> : null}
        </label>
      </div>

      <label className="input-group">
        <span>Mật khẩu</span>
        <input
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          {...register('password', {
            required: 'Mật khẩu không được để trống.',
            minLength: {
              value: 8,
              message: 'Mật khẩu phải có ít nhất 8 ký tự.',
            },
            validate: (value) =>
              /^(?=.*[A-Za-z])(?=.*\d).+$/.test(value) ||
              'Mật khẩu cần chứa cả chữ và số.',
          })}
        />
        {errors.password ? <p className="input-message error">{errors.password.message}</p> : null}
      </label>

      <label className="input-group">
        <span>Nhập lại mật khẩu</span>
        <input
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register('confirmPassword', {
            required: 'Vui lòng nhập lại mật khẩu.',
            validate: (value) => value === passwordValue || 'Mật khẩu nhập lại không khớp.',
          })}
        />
        {errors.confirmPassword ? <p className="input-message error">{errors.confirmPassword.message}</p> : null}
      </label>

      {submitMessage ? (
        <p className={submitMessage.includes('không') ? 'input-message error' : 'input-message success'}>
          {submitMessage}
        </p>
      ) : null}

      <button type="submit" className="primary-button" disabled={isSubmitting}>
        {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
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

