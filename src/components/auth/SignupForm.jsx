import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (!formData.dateOfBirth) {
      setError("Please select a date of birth");
      return false;
    }
    if (!formData.phoneNumber.startsWith("+84")) {
      setError("Phone number must start with +84");
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
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      });
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Error response:", err.response);

      let errorMessage = "Registration failed. Please try again.";

      if (err.response) {
        const serverMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          err.response.data?.msg;

        if (serverMessage) {
          errorMessage = serverMessage;
        } else if (err.response.status === 409) {
          errorMessage = "Email already registered.";
        } else if (err.response.status === 400) {
          errorMessage = "Invalid information. Please check again.";
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
        aria-labelledby="signup-title"
      >
        <h2 id="signup-title">Sign Up</h2>
        <p className="form-subtitle">
          Create an account to manage your appointments and health information.
        </p>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <label className="input-group">
          <span>Full Name</span>
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
        </label>

        <label className="input-group">
          <span>Phone Number</span>
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
          <span>Date of Birth</span>
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
          <span>Gender</span>
          <select
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </label>

        <label className="input-group">
          <span>Password</span>
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
          <span>Confirm Password</span>
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
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="form-footer">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Log In
          </Link>
        </p>
      </form>
    </>
  );
};

export default SignupForm;
