import { NavLink } from "react-router-dom";

const AuthTabs = () => {
  return (
    <div
      className="tab-switcher"
      role="tablist"
      aria-label="Select authentication form type"
    >
      <NavLink
        to="/login"
        end
        role="tab"
        className={({ isActive }) => (isActive ? "tab active" : "tab")}
      >
        Log In
      </NavLink>
      <NavLink
        to="/signup"
        role="tab"
        className={({ isActive }) => (isActive ? "tab active" : "tab")}
      >
        Sign Up
      </NavLink>
    </div>
  );
};

export default AuthTabs;
