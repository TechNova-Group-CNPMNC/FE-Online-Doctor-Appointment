import { jwtDecode } from "jwt-decode";

/**
 * Decode JWT token
 * @param {string} token - JWT token string
 * @returns {object|null} Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    const decoded = jwtDecode(token);
    console.log("🔓 Decoded Token:", decoded);
    return decoded;
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return null;
  }
};

/**
 * Get user role from token
 * @returns {string|null} User role or null
 */
export const getUserRole = () => {
  const token = localStorage.getItem("token");
  console.log("🎫 Token from localStorage:", token);

  if (!token) return null;

  const decoded = decodeToken(token);
  const role = decoded?.role || decoded?.authorities?.[0] || null;
  console.log("👤 User Role:", role);

  return role;
};

/**
 * Check if user is a doctor
 * @returns {boolean}
 */
export const isDoctor = () => {
  const role = getUserRole();
  const result = role === "DOCTOR" || role === "ROLE_DOCTOR";
  console.log("🩺 Is Doctor?", result, "- Role:", role);
  return result;
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  console.log(
    "🔐 Checking authentication, token:",
    token ? "exists" : "not found"
  );

  if (!token) return false;

  const decoded = decodeToken(token);
  if (!decoded) return false;

  // Check if token is expired
  const currentTime = Date.now() / 1000;
  const isValid = decoded.exp > currentTime;
  console.log("⏰ Token expiry check:", {
    exp: decoded.exp,
    now: currentTime,
    isValid: isValid,
  });

  return isValid;
};

/**
 * Get user info from token
 * @returns {object|null}
 */
export const getUserInfo = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const info = decodeToken(token);
  console.log("ℹ️ User Info:", info);
  return info;
};
