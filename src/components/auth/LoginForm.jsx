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

      let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";

      if (err.response) {
        const serverMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          err.response.data?.msg;

        if (serverMessage) {
          errorMessage = serverMessage;
        } else if (err.response.status === 401) {
          errorMessage = "Email hoặc mật khẩu không đúng.";
        } else if (err.response.status === 404) {
          errorMessage = "Tài khoản không tồn tại.";
        } else {
          errorMessage = `Lỗi: ${err.response.status}`;
        }
      } else if (err.request) {
        errorMessage =
          "Không thể kết nối với máy chủ. Vui lòng kiểm tra kết nối mạng.";
      } else if (err.code === "ERR_NETWORK") {
        errorMessage = "Lỗi mạng. Vui lòng thử lại.";
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
        <h2 id="login-title">Đăng nhập</h2>
        <p className="form-subtitle">
          Nhập thông tin của bạn để tiếp tục đặt lịch hẹn.
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
          <span>Mật khẩu</span>
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
              "Đang đăng nhập..."
            ) : (
              <>
                Đăng nhập
                <ArrowRight />
              </>
            )}
          </span>
        </button>

        <p className="form-footer">
          Chưa có tài khoản?{" "}
          <Link to="/signup" className="link">
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </>
  );
};

export default LoginForm;
