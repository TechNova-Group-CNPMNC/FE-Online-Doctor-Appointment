import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  isAuthenticated,
  isPatient,
  getPatientId,
} from "../../util/jwtdecoder";
import api from "../../services/api";
import Header from "../../components/Header/Header";
import "./CreateAppointment.css";

const CreateAppointment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [patientId, setPatientId] = useState(null);

  const [formData, setFormData] = useState({
    doctorId: "",
    availabilityId: "",
    reason: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("Vui lòng đăng nhập để truy cập trang này");
      navigate("/login");
      return;
    }

    if (!isPatient()) {
      setError("Truy cập bị từ chối. Chỉ bệnh nhân mới có thể đặt lịch hẹn.");
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
    fetchDoctors();
  }, [navigate]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/doctors");
      console.log("✅ Doctors response:", response.data);

      const doctorsList = response.data?.data || response.data || [];
      setDoctors(Array.isArray(doctorsList) ? doctorsList : []);
    } catch (err) {
      console.error("❌ Error fetching doctors:", err);
      setError("Không thể tải danh sách bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async (doctorId, date = null) => {
    if (!doctorId) return;

    try {
      setLoading(true);
      setError("");

      let url = `/doctors/${doctorId}/availability`;
      if (date) {
        url += `?date=${date}`;
      }

      console.log("📡 Fetching availability from:", url);
      const response = await api.get(url);
      console.log("✅ Availability response:", response.data);

      const availability = response.data?.data || response.data || [];
      setAvailabilities(Array.isArray(availability) ? availability : []);

      if (availability.length === 0) {
        setError(
          "Không tìm thấy slot trống cho bác sĩ này. Vui lòng thử ngày khác hoặc bác sĩ khác."
        );
      }
    } catch (err) {
      console.error("❌ Error fetching availability:", err);
      setError("Không thể tải các slot trống");
      setAvailabilities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      doctorId: doctorId,
      availabilityId: "",
      appointmentDate: "",
      appointmentTime: "",
    }));

    const doctor = doctors.find((d) => d.id === parseInt(doctorId));
    setSelectedDoctor(doctor);
    setAvailabilities([]);

    if (doctorId) {
      fetchAvailability(doctorId, filterDate);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateFilterChange = (e) => {
    const date = e.target.value;
    setFilterDate(date);
    if (formData.doctorId) {
      fetchAvailability(formData.doctorId, date);
    }
  };

  const handleAvailabilitySelect = (availability) => {
    setFormData((prev) => ({
      ...prev,
      availabilityId: availability.id,
      appointmentDate: availability.workDate,
      appointmentTime: availability.startTime,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.doctorId ||
      !formData.availabilityId ||
      !formData.reason ||
      !formData.appointmentDate ||
      !formData.appointmentTime
    ) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const appointmentDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`;

      const appointmentData = {
        patientId: patientId,
        doctorId: parseInt(formData.doctorId),
        appointmentDateTime: appointmentDateTime,
        reason: formData.reason.trim(),
      };

      console.log("📝 Creating appointment:", appointmentData);

      const response = await api.post("/appointments", appointmentData);
      console.log("✅ Appointment created:", response.data);

      setSuccess(
        "Đặt lịch hẹn thành công! Đang chuyển hướng đến lịch hẹn của bạn..."
      );

      setFormData({
        doctorId: "",
        availabilityId: "",
        reason: "",
        appointmentDate: "",
        appointmentTime: "",
      });
      setSelectedDoctor(null);
      setAvailabilities([]);
      setFilterDate("");

      setTimeout(() => {
        navigate("/appointments");
      }, 2000);
    } catch (err) {
      console.error("❌ Error creating appointment:", err);

      if (err.response?.status === 401) {
        setError("Phiên hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.status === 409) {
        setError(
          "Khung giờ này không còn trống. Vui lòng chọn thời gian khác."
        );
        if (formData.doctorId) {
          fetchAvailability(formData.doctorId, filterDate);
        }
      } else {
        setError(err.response?.data?.message || "Không thể tạo lịch hẹn");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "CH" : "SA";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <>
      <Header />
      <div className="appointment-page">
        <div className="appointment-hero">
          <div className="hero-background">
            <div className="hero-shape hero-shape-1"></div>
            <div className="hero-shape hero-shape-2"></div>
            <div className="particles">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="particle"></div>
              ))}
            </div>
          </div>
          <h1 className="appointment-title">Đặt lịch hẹn</h1>
          <p className="appointment-subtitle">
            Chọn bác sĩ và lên lịch thăm khám
          </p>
        </div>

        <div className="appointment-section">
          <div className="container">
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

            <div className="appointment-wrapper">
              <div className="appointment-form-container">
                <h2 className="form-title">Chi tiết lịch hẹn</h2>
                <form onSubmit={handleSubmit} className="appointment-form">
                  <div className="form-group">
                    <label htmlFor="doctorId">Chọn bác sĩ *</label>
                    <select
                      id="doctorId"
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleDoctorChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Chọn bác sĩ</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          Bác sĩ {doctor.fullName} - {doctor.degree}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedDoctor && (
                    <div className="doctor-info-card">
                      <div className="doctor-avatar">
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                            stroke="#667eea"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M3.41016 22C3.41016 18.13 7.26015 15 12.0002 15C12.9602 15 13.8902 15.13 14.7602 15.37"
                            stroke="#667eea"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div className="doctor-details">
                        <h3>Dr. {selectedDoctor.fullName}</h3>
                        <p className="doctor-degree">{selectedDoctor.degree}</p>
                        {selectedDoctor.bio && (
                          <p className="doctor-bio">{selectedDoctor.bio}</p>
                        )}
                        <div className="doctor-rating">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#fbbf24"
                          >
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                          </svg>
                          <span>
                            {selectedDoctor.averageRating?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Date Filter */}
                  {formData.doctorId && (
                    <div className="form-group">
                      <label htmlFor="filterDate">Filter by Date</label>
                      <input
                        type="date"
                        id="filterDate"
                        value={filterDate}
                        onChange={handleDateFilterChange}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <p className="field-hint">
                        Optional: Filter available slots by specific date
                      </p>
                    </div>
                  )}

                  {/* Select Availability Slot */}
                  {formData.doctorId && (
                    <div className="form-group">
                      <label>
                        Select Available Time Slot *
                        {loading && (
                          <span className="loading-indicator">
                            Loading slots...
                          </span>
                        )}
                      </label>

                      {availabilities.length === 0 && !loading ? (
                        <div className="no-slots-message">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                              stroke="#cbd5e1"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M12 7V12L15 15"
                              stroke="#cbd5e1"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          <p>No available time slots</p>
                        </div>
                      ) : (
                        <div className="time-slots-grid">
                          {availabilities.map((availability) => (
                            <label
                              key={availability.id}
                              className={`time-slot-option ${
                                formData.availabilityId === availability.id
                                  ? "selected"
                                  : ""
                              }`}
                            >
                              <input
                                type="radio"
                                name="availabilityId"
                                value={availability.id}
                                checked={
                                  formData.availabilityId === availability.id
                                }
                                onChange={() =>
                                  handleAvailabilitySelect(availability)
                                }
                              />
                              <div className="slot-content">
                                <div className="slot-date">
                                  {formatDate(availability.workDate)}
                                </div>
                                <div className="slot-time">
                                  {formatTime(availability.startTime)} -{" "}
                                  {formatTime(availability.endTime)}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reason for Visit */}
                  <div className="form-group">
                    <label htmlFor="reason">Reason for Visit *</label>
                    <textarea
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      placeholder="Describe your symptoms or reason for consultation..."
                      rows="4"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={
                      loading ||
                      !patientId ||
                      !formData.doctorId ||
                      !formData.availabilityId
                    }
                  >
                    {loading ? (
                      <>
                        <div className="spinner-small"></div>
                        Booking...
                      </>
                    ) : (
                      "Book Appointment"
                    )}
                  </button>
                </form>
              </div>

              {/* Info Sidebar */}
              <div className="appointment-info-container">
                <h2 className="info-title">Booking Information</h2>
                <div className="info-list">
                  <div className="info-item">
                    <div className="info-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M12 7V12L15 15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="info-content">
                      <h3>Flexible Scheduling</h3>
                      <p>
                        Choose from available time slots that fit your schedule
                      </p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="info-content">
                      <h3>Instant Confirmation</h3>
                      <p>
                        Receive immediate booking confirmation for your
                        appointment
                      </p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M3.41016 22C3.41016 18.13 7.26015 15 12.0002 15C16.7402 15 20.5902 18.13 20.5902 22"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="info-content">
                      <h3>Expert Doctors</h3>
                      <p>
                        Consult with qualified and experienced medical
                        professionals
                      </p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="info-content">
                      <h3>Easy Rescheduling</h3>
                      <p>
                        Need to change your appointment? Modify or cancel
                        anytime
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAppointment;
