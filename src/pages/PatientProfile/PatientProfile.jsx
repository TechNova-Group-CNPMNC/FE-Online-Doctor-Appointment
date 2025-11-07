import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  isAuthenticated,
  isPatient,
  getPatientId,
} from "../../util/jwtdecoder";
import api from "../../services/api";
import Header from "../../components/Header/Header";
import "./PatientProfile.css";
import { User, Mail, Phone, MapPin, Calendar, FileText } from "lucide-react";

const PatientProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [patientId, setPatientId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "MALE",
    phoneNumber: "",
    address: "",
    medicalHistory: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("Vui lòng đăng nhập để truy cập trang này");
      navigate("/login");
      return;
    }

    if (!isPatient()) {
      setError(
        "Truy cập bị từ chối. Chỉ bệnh nhân mới có thể truy cập trang này."
      );
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    const id = getPatientId();
    console.log("✅ Patient ID from token:", id);

    if (!id) {
      setError("Không tìm thấy hồ sơ bệnh nhân. Vui lòng liên hệ hỗ trợ.");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    setPatientId(id);
  }, [navigate]);

  useEffect(() => {
    if (patientId) {
      fetchProfile();
    }
  }, [patientId]);

  const fetchProfile = async () => {
    if (!patientId) return;

    try {
      setLoading(true);
      setError("");

      console.log("📡 Fetching profile for patient ID:", patientId);
      const response = await api.get(`/patients/${patientId}/profile`);
      console.log("✅ Profile response:", response.data);

      const profile = response.data?.data || response.data;
      setProfileData(profile);

      setFormData({
        fullName: profile.fullName || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: profile.gender || "MALE",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
        medicalHistory: profile.medicalHistory || "",
      });
    } catch (err) {
      console.error("❌ Error fetching profile:", err);

      if (err.response?.status === 403) {
        setError(
          "Truy cập bị từ chối. Bạn chỉ có thể xem hồ sơ của chính mình."
        );
      } else if (err.response?.status === 401) {
        setError("Phiên đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.status === 404) {
        setError("Không tìm thấy hồ sơ bệnh nhân.");
      } else {
        setError(err.response?.data?.message || "Không thể tải hồ sơ");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // object chỉ chứa các fields đã thay đổi
      const updateData = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== profileData[key]) {
          updateData[key] = formData[key];
        }
      });

      // không có gì thay đổi
      if (Object.keys(updateData).length === 0) {
        setIsEditing(false);
        return;
      }

      console.log("📝 Updating profile with data:", updateData);

      const response = await api.put(
        `/patients/${patientId}/profile`,
        updateData
      );
      console.log("✅ Update response:", response.data);

      const updatedProfile = response.data?.data || response.data;
      setProfileData(updatedProfile);

      setSuccess("Cập nhật hồ sơ thành công!");
      setIsEditing(false);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error updating profile:", err);

      if (err.response?.status === 400) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data ||
          "Dữ liệu không hợp lệ";
        setError(errorMessage);
      } else if (err.response?.status === 403) {
        setError(
          "Truy cập bị từ chối. Bạn chỉ có thể cập nhật hồ sơ của chính mình."
        );
      } else if (err.response?.status === 401) {
        setError("Phiên đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.status === 404) {
        setError("Không tìm thấy hồ sơ bệnh nhân.");
      } else {
        setError(err.response?.data?.message || "Cập nhật hồ sơ thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form về dữ liệu ban đầu
    if (profileData) {
      setFormData({
        fullName: profileData.fullName || "",
        dateOfBirth: profileData.dateOfBirth || "",
        gender: profileData.gender || "MALE",
        phoneNumber: profileData.phoneNumber || "",
        address: profileData.address || "",
        medicalHistory: profileData.medicalHistory || "",
      });
    }
    setIsEditing(false);
    setError("");
  };

  const formatGender = (gender) => {
    const genderMap = {
      MALE: "Nam",
      FEMALE: "Nữ",
      OTHER: "Khác",
    };
    return genderMap[gender] || gender;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading && !profileData) {
    return (
      <>
        <Header />
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải hồ sơ...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="patient-profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-header-content">
              <div className="profile-avatar">
                <User size={48} />
              </div>
              <div className="profile-header-text">
                <h1>Hồ sơ bệnh nhân</h1>
                <p>Quản lý thông tin cá nhân và tiền sử bệnh án</p>
              </div>
            </div>
            {!isEditing && profileData && (
              <button
                className="btn-edit"
                onClick={() => setIsEditing(true)}
                disabled={loading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Chỉnh sửa
              </button>
            )}
          </div>

          {error && (
            <div className="alert alert-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {success}
            </div>
          )}

          {profileData && (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="profile-section">
                <h2 className="section-title">Thông tin cá nhân</h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="fullName">
                      <User size={18} />
                      Họ và tên *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      />
                    ) : (
                      <div className="form-value">{profileData.fullName}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <Mail size={18} />
                      Email
                    </label>
                    <div className="form-value disabled">
                      {profileData.email}
                      <span className="field-note">Không thể thay đổi</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="dateOfBirth">
                      <Calendar size={18} />
                      Ngày sinh *
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split("T")[0]}
                        required
                        disabled={loading}
                      />
                    ) : (
                      <div className="form-value">
                        {formatDate(profileData.dateOfBirth)}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">
                      <User size={18} />
                      Giới tính *
                    </label>
                    {isEditing ? (
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      >
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                      </select>
                    ) : (
                      <div className="form-value">
                        {formatGender(profileData.gender)}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phoneNumber">
                      <Phone size={18} />
                      Số điện thoại *
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      />
                    ) : (
                      <div className="form-value">
                        {profileData.phoneNumber}
                      </div>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="address">
                      <MapPin size={18} />
                      Địa chỉ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Nhập địa chỉ của bạn"
                        disabled={loading}
                      />
                    ) : (
                      <div className="form-value">
                        {profileData.address || "Chưa cập nhật"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h2 className="section-title">Tiền sử bệnh án</h2>

                <div className="form-group">
                  <label htmlFor="medicalHistory">
                    <FileText size={18} />
                    Tiền sử bệnh
                  </label>
                  {isEditing ? (
                    <textarea
                      id="medicalHistory"
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleInputChange}
                      rows="5"
                      placeholder="VD: Tiền sử dị ứng thuốc kháng sinh, cao huyết áp..."
                      disabled={loading}
                    />
                  ) : (
                    <div className="form-value medical-history">
                      {profileData.medicalHistory || "Chưa cập nhật"}
                    </div>
                  )}
                  <p className="field-hint">
                    Vui lòng cung cấp thông tin về các bệnh lý hiện tại, tiền sử
                    dị ứng, thuốc đang dùng, v.v.
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="btn-spinner"></span>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default PatientProfile;
