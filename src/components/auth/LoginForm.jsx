import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import { Mail, Lock, ArrowRight } from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { email, password } = formData;
      console.log("Attempting login with:", { email, password });

      const response = await authAPI.login({ email, password });

      console.log("Login response:", response);

      const token =
        response.data?.token ||
        response.token ||
        response.data?.accessToken ||
        response.accessToken;
      const user = response.data?.user || response.user || response.data;

      if (token) {
        localStorage.setItem("token", token);
        console.log("Token stored:", token);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        console.log("User stored:", user);
      }

      navigate("/find-a-doctor");
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response);

      let errorMessage = "Login failed. Please try again.";

      if (err.response) {
        const serverMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          err.response.data?.msg;

        if (serverMessage) {
          errorMessage = serverMessage;
        } else if (err.response.status === 401) {
          errorMessage = "Incorrect email or password.";
        } else if (err.response.status === 404) {
          errorMessage = "Account does not exist.";
        } else {
          errorMessage = `Error: ${err.response.status}`;
        }
      } else if (err.request) {
        errorMessage =
          "Unable to connect to server. Please check your network connection.";
      } else if (err.code === "ERR_NETWORK") {
        errorMessage = "Network error. Please try again.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        className="form"
        onSubmit={handleSubmit}
        aria-labelledby="login-title"
      >
        <h2 id="login-title">Log In</h2>
        <p className="form-subtitle">
          Enter your information to continue booking appointments.
        </p>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <label className="input-group">
          <span>Email</span>
          <div style={{ position: "relative" }}>
            <Mail
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                fontSize: "18px",
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="john.doe@example.com"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              style={{ paddingLeft: "44px" }}
            />
          </div>
        </label>

        <label className="input-group">
          <span>Password</span>
          <div style={{ position: "relative" }}>
            <Lock
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                fontSize: "18px",
              }}
            />
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              style={{ paddingLeft: "44px" }}
            />
          </div>
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
            <span>Remember me</span>
          </label>
          <Link to="#" className="link">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="primary-button" disabled={loading}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                Log In
                <ArrowRight />
              </>
            )}
          </span>
        </button>

        <p className="form-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="link">
            Sign up now
          </Link>
        </p>
      </form>
    </>
  );
};

export default LoginForm;
