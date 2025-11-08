import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import { isDoctor, isPatient } from "../../util/jwtdecoder";

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "MALE",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!error) return;
    const timeout = setTimeout(() => {
      setError("");
    }, 5000);
    return () => clearTimeout(timeout);
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateEmail = (email) => {
    // Regex cho email hợp lệ (user@domain.com)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Kiểm tra độ dài 8-20 ký tự
    if (password.length < 8 || password.length > 20) {
      return {
        valid: false,
        message: "Mật khẩu phải có từ 8-20 ký tự",
      };
    }

    // Kiểm tra có ít nhất một chữ số
    const hasNumber = /\d/.test(password);
    if (!hasNumber) {
      return {
        valid: false,
        message: "Mật khẩu phải chứa ít nhất một chữ số",
      };
    }

    // Kiểm tra có ít nhất một ký tự đặc biệt
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/';`~]/.test(
      password
    );
    if (!hasSpecialChar) {
      return {
        valid: false,
        message: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&*...)",
      };
    }

    return { valid: true };
  };

  const validateForm = () => {
    // Validate email
    if (!validateEmail(formData.email)) {
      setError(
        "Email không hợp lệ. Vui lòng nhập đúng định dạng (user@domain.com)"
      );
      return false;
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message);
      return false;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      return false;
    }

    // Validate date of birth
    if (!formData.dateOfBirth) {
      setError("Vui lòng chọn ngày sinh");
      return false;
    }

    // Validate phone number
    if (!formData.phoneNumber.startsWith("+84")) {
      setError("Số điện thoại phải bắt đầu bằng +84");
      return false;
    }

    // Validate phone number length (10-11 digits after +84)
    const phoneDigits = formData.phoneNumber.replace("+84", "");
    if (phoneDigits.length < 9 || phoneDigits.length > 10) {
      setError("Số điện thoại không hợp lệ");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      console.log("Sending registration data:", registerData);

      const response = await authAPI.register(registerData);

      console.log("Registration response:", response);

      const token =
        response.data?.token ||
        response.token ||
        response.data?.accessToken ||
        response.accessToken;
      const user = response.data?.user || response.user || response.data;

      if (token) {
        localStorage.setItem("token", token);
        console.log("Token stored after registration:", token);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        console.log("User stored after registration:", user);
      }

      if (isDoctor()) {
        alert(
          "Đăng ký thành công!. Chuyển hướng đến trang Lịch trình của tôi."
        );
        navigate("/doctor/my-availability");
      } else if (isPatient()) {
        alert("Đăng ký thành công!. Chuyển hướng đến trang Tìm bác sĩ.");
        navigate("/find-a-doctor");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Error response:", err.response);

      let errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";

      if (err.response) {
        const serverMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          err.response.data?.msg;

        if (serverMessage) {
          errorMessage = serverMessage;
        } else if (err.response.status === 409) {
          errorMessage = "Email đã được đăng ký.";
        } else if (err.response.status === 400) {
          errorMessage = "Thông tin không hợp lệ. Vui lòng kiểm tra lại.";
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
        aria-labelledby="signup-title"
      >
        <h2 id="signup-title">Đăng ký</h2>
        <p className="form-subtitle">
          Tạo tài khoản để quản lý lịch hẹn và thông tin sức khỏe của bạn.
        </p>

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
            placeholder="John Doe"
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
          <small
            style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}
          >
            Định dạng: user@domain.com
          </small>
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
            max={new Date().toISOString().split("T")[0]}
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
            maxLength={20}
          />
          <small
            style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}
          >
            8-20 ký tự, có ít nhất 1 chữ số và 1 ký tự đặc biệt (!@#$%^&*...)
          </small>
        </label>

        <label className="input-group">
          <span>Xác nhận mật khẩu</span>
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
            maxLength={20}
          />
        </label>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </button>

        <p className="form-footer">
          Đã có tài khoản?{" "}
          <Link to="/login" className="link">
            Đăng nhập
          </Link>
        </p>
      </form>
    </>
  );
};

export default SignupForm;
