import { NavLink } from 'react-router-dom'

const AuthTabs = () => {
  return (
    <div className="tab-switcher" role="tablist" aria-label="Chọn loại biểu mẫu xác thực">
      <NavLink
        to="/login"
        end
        role="tab"
        className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
      >
        Đăng nhập
      </NavLink>
      <NavLink
        to="/signup"
        role="tab"
        className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
      >
        Đăng ký
      </NavLink>
    </div>
  )
}

export default AuthTabs

