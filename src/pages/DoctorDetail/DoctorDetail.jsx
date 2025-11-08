import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  isAuthenticated,
  isPatient,
  getPatientId,
} from "../../util/jwtdecoder";
import api from "../../services/api";
import Header from "../../components/Header/Header";
import "./DoctorDetail.css";

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingDates, setBookingDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [symptoms, setSymptoms] = useState("");
  const [suspectedDisease, setSuspectedDisease] = useState("");
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchDoctorDetail();
  }, [id]);

  useEffect(() => {
    if (selectedDate && doctor?.timeSlotsByDate) {
      const dateKey = selectedDate.formattedDate;
      const slots = doctor.timeSlotsByDate[dateKey] || [];

      const formattedSlots = slots
        .filter((slot) => slot.status === "AVAILABLE")
        .map((slot) => {
          const startTime = new Date(slot.startTime);
          const timeString = startTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

          return {
            id: slot.id,
            time: timeString,
            startTime: slot.startTime,
            endTime: slot.endTime,
          };
        });

      setAvailableTimeSlots(formattedSlots);
      setSelectedTime(null);
    }
  }, [selectedDate, doctor]);

  const fetchDoctorDetail = async () => {
    try {
      setLoading(true);
      console.log("Fetching doctor with ID:", id);

      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 14);

      const startDateStr = today.toISOString().split("T")[0];
      const endDateStr = endDate.toISOString().split("T")[0];

      const response = await api.get(`/doctors/${id}/detail`, {
        params: {
          startDate: startDateStr,
          endDate: endDateStr,
        },
      });

      console.log("Doctor detail response:", response.data);

      const doctorData = response.data?.data || response.data;
      setDoctor(doctorData);

      if (doctorData.availableDates && doctorData.availableDates.length > 0) {
        generateBookingDatesFromAvailable(doctorData.availableDates);
      }

      if (doctorData.specialties && doctorData.specialties.length > 0) {
        const firstSpecialtyName = doctorData.specialties[0];
        fetchRelatedDoctorsByName(firstSpecialtyName);
      }
    } catch (err) {
      console.error("Error fetching doctor:", err);
      console.error("Error details:", err.response?.data);

      if (err.response?.status === 404) {
        alert(
          `Không tìm thấy bác sĩ với ID ${id}. Vui lòng chọn bác sĩ hợp lệ.`
        );
        navigate("/find-a-doctor");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateBookingDatesFromAvailable = (availableDates) => {
    const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    const dates = availableDates.map((dateStr) => {
      const date = new Date(dateStr);

      return {
        day: daysOfWeek[date.getDay()],
        date: date.getDate(),
        fullDate: date,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        formattedDate: dateStr,
      };
    });

    setBookingDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  };

  const fetchRelatedDoctorsByName = async (specialtyName) => {
    try {
      console.log("Fetching related doctors for specialty:", specialtyName);

      const response = await api.get(`/doctors`);
      console.log("All doctors response:", response.data);

      const allDoctors = response.data?.data || response.data || [];

      const filtered = allDoctors
        .filter((d) => {
          if (d.id === parseInt(id)) return false;

          if (d.specialties && Array.isArray(d.specialties)) {
            return d.specialties.some(
              (s) => s.name === specialtyName || s === specialtyName
            );
          }
          return false;
        })
        .slice(0, 5);

      setRelatedDoctors(filtered);
    } catch (err) {
      console.error("Error fetching related doctors:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  const handleTimeSlotClick = (slot) => {
    if (!isAuthenticated()) {
      alert("Vui lòng đăng nhập để đặt lịch hẹn");
      navigate("/login");
      return;
    }

    if (!isPatient()) {
      alert("Chỉ bệnh nhân mới có thể đặt lịch hẹn");
      return;
    }

    setSelectedTime(slot);
    setShowReasonModal(true);
    setError("");
    setSuccess("");
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Vui lòng chọn cả ngày và giờ");
      return;
    }

    if (!symptoms.trim()) {
      setError("Vui lòng mô tả triệu chứng của bạn");
      return;
    }

    const patientId = getPatientId();
    if (!patientId) {
      setError("Không tìm thấy hồ sơ bệnh nhân. Vui lòng liên hệ hỗ trợ.");
      return;
    }

    try {
      setBookingLoading(true);
      setError("");
      setSuccess("");

      const appointmentData = {
        patientId: parseInt(patientId),
        doctorId: parseInt(id),
        timeSlotId: selectedTime.id,
        symptoms: symptoms.trim(),
        suspectedDisease: suspectedDisease.trim() || null,
      };

      console.log("📝 Creating appointment:", appointmentData);

      const response = await api.post("/appointments", appointmentData);
      console.log("✅ Appointment created:", response.data);

      const appointmentResponse = response.data?.data || response.data;
      setAppointmentDetails(appointmentResponse);

      setShowReasonModal(false);
      setShowSuccessModal(true);

      setSymptoms("");
      setSuspectedDisease("");

      fetchDoctorDetail();
    } catch (err) {
      console.error("❌ Error creating appointment:", err);

      if (err.response?.status === 401) {
        setError("Phiên đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.status === 409) {
        setError("Khung giờ này không còn trống. Vui lòng chọn giờ khác.");
        fetchDoctorDetail();
      } else if (err.response?.status === 400) {
        setError(
          err.response?.data?.message ||
            err.response?.data ||
            "Dữ liệu lịch hẹn không hợp lệ. Vui lòng thử lại."
        );
      } else {
        setError(err.response?.data?.message || "Tạo lịch hẹn thất bại");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
      CONFIRMED: { bg: "#D1FAE5", text: "#065F46", border: "#34D399" },
      COMPLETED: { bg: "#DBEAFE", text: "#1E40AF", border: "#60A5FA" },
      CANCELLED: { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5" },
    };
    return colors[status] || colors.PENDING;
  };

  const handleCloseModal = () => {
    setShowReasonModal(false);
    setSymptoms("");
    setSuspectedDisease("");
    setError("");
    setSelectedTime(null);
  };

  const formatSpecialties = (specialties) => {
    if (
      !specialties ||
      !Array.isArray(specialties) ||
      specialties.length === 0
    ) {
      return "Bác sĩ Đa khoa";
    }
    return specialties
      .map((s) => (typeof s === "string" ? s : s.name))
      .join(", ");
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="doctor-detail-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin bác sĩ...</p>
        </div>
      </>
    );
  }

  if (!doctor) {
    return (
      <>
        <Header />
        <div className="doctor-detail-error">
          <h2>Không tìm thấy bác sĩ</h2>
          <button
            className="back-btn"
            onClick={() => navigate("/find-a-doctor")}
          >
            Quay lại danh sách bác sĩ
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="doctor-detail-page">
        <div className="doctor-detail-container">
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

          <div className="breadcrumb">
            <span onClick={() => navigate("/")}>Trang chủ</span>
            <span className="separator">/</span>
            <span onClick={() => navigate("/find-a-doctor")}>Bác sĩ</span>
            <span className="separator">/</span>
            <span className="current">{doctor.fullName}</span>
          </div>

          <div className="doctor-info-section">
            <div className="doctor-profile-card">
              <div className="doctor-image-wrapper">
                <img
                  src={
                    doctor.profileImage ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      doctor.fullName
                    )}&size=400&background=667eea&color=fff&bold=true`
                  }
                  alt={doctor.fullName}
                  className="doctor-profile-image"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      doctor.fullName
                    )}&size=400&background=667eea&color=fff&bold=true`;
                  }}
                />
              </div>
            </div>

            <div className="doctor-details-card">
              <div className="doctor-header">
                <h1 className="doctor-name">
                  {doctor.fullName}
                  {doctor.degree && `, ${doctor.degree}`}
                  <svg
                    className="verified-badge"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="#667eea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="#667eea"
                    />
                    <path
                      d="M9 12L11 14L15 10"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </h1>
                <div className="doctor-specialty-badge">
                  {doctor.specialties && doctor.specialties.length > 0
                    ? `${doctor.degree || "MD"} - ${formatSpecialties(
                        doctor.specialties
                      )}`
                    : "Bác sĩ Đa khoa"}
                  <span className="experience-badge">
                    {doctor.experienceYears || 5}+ Năm
                  </span>
                </div>
              </div>

              <div className="doctor-about">
                <h3>
                  Giới thiệu
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
                      stroke="#666"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 10.5V8M8 5.5H8.005"
                      stroke="#666"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </h3>
                <p>
                  {doctor.bio ||
                    "Bác sĩ giàu kinh nghiệm, cam kết cung cấp dịch vụ chăm sóc y tế toàn diện, tập trung vào y học dự phòng, chẩn đoán sớm và chiến lược điều trị hiệu quả."}
                </p>
              </div>

              {doctor.averageRating && (
                <div className="doctor-rating">
                  <span className="rating-label">Đánh giá:</span>
                  <span className="rating-value">
                    ⭐ {doctor.averageRating.toFixed(1)}
                  </span>
                </div>
              )}

              {/* <div className="appointment-fee">
                <span>Phí tư vấn:</span>
                <span className="fee-amount">
                  {doctor.consultationFee
                    ? `${doctor.consultationFee.toLocaleString("vi-VN")} VNĐ`
                    : "600,000 VNĐ"}
                </span>
              </div> */}
            </div>
          </div>

          <div className="booking-section">
            <h2>Khung giờ đặt khám</h2>

            {bookingDates.length > 0 ? (
              <>
                <div className="date-selector">
                  {bookingDates.map((dateObj, index) => (
                    <button
                      key={index}
                      className={`date-button ${
                        selectedDate?.formattedDate === dateObj.formattedDate
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSelectedDate(dateObj)}
                    >
                      <span className="date-day">{dateObj.day}</span>
                      <span className="date-number">{dateObj.date}</span>
                    </button>
                  ))}
                </div>

                <div className="time-selector">
                  {availableTimeSlots.length > 0 ? (
                    availableTimeSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={`time-button ${
                          selectedTime?.id === slot.id ? "active" : ""
                        }`}
                        onClick={() => handleTimeSlotClick(slot)}
                      >
                        {slot.time}
                      </button>
                    ))
                  ) : (
                    <div className="no-slots-message">
                      <p>Không có lịch trống cho ngày này.</p>
                      <p className="no-slots-hint">Vui lòng chọn ngày khác.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="no-slots-message">
                <p>Hiện tại không có lịch khám trống.</p>
                <p className="no-slots-hint">Vui lòng kiểm tra lại sau.</p>
              </div>
            )}
          </div>

          {relatedDoctors.length > 0 && (
            <div className="related-doctors-section">
              <h2>Bác sĩ liên quan</h2>
              <p className="related-subtitle">
                Các chuyên gia khác trong lĩnh vực{" "}
                {formatSpecialties(doctor.specialties)}
              </p>

              <div className="related-doctors-grid">
                {relatedDoctors.map((relDoc) => (
                  <div
                    key={relDoc.id}
                    className="related-doctor-card"
                    onClick={() => {
                      navigate(`/doctor/${relDoc.id}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div className="related-doctor-image">
                      <img
                        src={
                          relDoc.profileImage ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            relDoc.fullName
                          )}&size=300&background=667eea&color=fff&bold=true`
                        }
                        alt={relDoc.fullName}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            relDoc.fullName
                          )}&size=300&background=667eea&color=fff&bold=true`;
                        }}
                      />
                    </div>
                    <div className="related-doctor-info">
                      <div className="availability-badge">
                        <span className="availability-dot"></span>
                        Có lịch khám
                      </div>
                      <h3>{relDoc.fullName}</h3>
                      <p>{formatSpecialties(relDoc.specialties)}</p>
                      {relDoc.averageRating && (
                        <p className="related-rating">
                          ⭐ {relDoc.averageRating.toFixed(1)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {showReasonModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Chi tiết Lịch hẹn</h3>
                <button className="modal-close" onClick={handleCloseModal}>
                  ×
                </button>
              </div>

              <div className="modal-body">
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

                <div className="appointment-summary">
                  <p>
                    <strong>Bác sĩ:</strong> {doctor.fullName}
                  </p>
                  <p>
                    <strong>Ngày:</strong> {selectedDate?.formattedDate}
                  </p>
                  <p>
                    <strong>Giờ:</strong> {selectedTime?.time}
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="symptoms">Triệu chứng *</label>
                  <textarea
                    id="symptoms"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Mô tả triệu chứng của bạn (ví dụ: đau đầu, sốt, ho...)"
                    rows="3"
                    disabled={bookingLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="suspectedDisease">
                    Bệnh nghi ngờ (Không bắt buộc)
                  </label>
                  <input
                    type="text"
                    id="suspectedDisease"
                    value={suspectedDisease}
                    onChange={(e) => setSuspectedDisease(e.target.value)}
                    placeholder="Nếu bạn nghi ngờ bất kỳ tình trạng cụ thể nào..."
                    disabled={bookingLoading}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-cancel"
                  onClick={handleCloseModal}
                  disabled={bookingLoading}
                >
                  Hủy
                </button>
                <button
                  className="btn-confirm"
                  onClick={handleBookAppointment}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <>
                      <div className="spinner-small"></div>
                      Đang đặt lịch...
                    </>
                  ) : (
                    "Xác nhận Đặt lịch"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {showSuccessModal && appointmentDetails && (
          <div
            className="modal-overlay"
            onClick={() => setShowSuccessModal(false)}
          >
            <div
              className="modal-content success-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="success-icon-wrapper">
                <svg
                  className="success-icon"
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle cx="12" cy="12" r="10" fill="#10B981" />
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="modal-header success-header">
                <h3>Đặt lịch hẹn thành công! 🎉</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowSuccessModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="appointment-card">
                  <div className="appointment-card-header">
                    <h4>Chi tiết Lịch hẹn</h4>
                    <span
                      className="status-badge"
                      style={{
                        background: getStatusColor(appointmentDetails.status)
                          .bg,
                        color: getStatusColor(appointmentDetails.status).text,
                        border: `2px solid ${
                          getStatusColor(appointmentDetails.status).border
                        }`,
                      }}
                    >
                      {appointmentDetails.status}
                    </span>
                  </div>

                  <div className="appointment-info-grid">
                    <div className="info-item">
                      <div className="info-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                            stroke="#667eea"
                            strokeWidth="2"
                          />
                          <path
                            d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                            stroke="#667eea"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="info-label">Bác sĩ</p>
                        <p className="info-value">
                          {appointmentDetails.doctorName}
                        </p>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            x="3"
                            y="6"
                            width="18"
                            height="15"
                            rx="2"
                            stroke="#667eea"
                            strokeWidth="2"
                          />
                          <path d="M3 10H21" stroke="#667eea" strokeWidth="2" />
                          <path
                            d="M8 3V6"
                            stroke="#667eea"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M16 3V6"
                            stroke="#667eea"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="info-label">Ngày & Giờ</p>
                        <p className="info-value">
                          {formatDateTime(appointmentDetails.startTime)}
                        </p>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="#667eea"
                            strokeWidth="2"
                          />
                          <path
                            d="M12 7V12L15 15"
                            stroke="#667eea"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="info-label">Thời lượng</p>
                        <p className="info-value">30 phút</p>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                            stroke="#667eea"
                            strokeWidth="2"
                          />
                          <path
                            d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5V5Z"
                            stroke="#667eea"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="info-label">Triệu chứng</p>
                        <p className="info-value">
                          {appointmentDetails.symptoms}
                        </p>
                      </div>
                    </div>

                    {appointmentDetails.suspectedDisease && (
                      <div className="info-item">
                        <div className="info-icon">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                              stroke="#667eea"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="info-label">Bệnh nghi ngờ</p>
                          <p className="info-value">
                            {appointmentDetails.suspectedDisease}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="appointment-id">
                    <p>
                      Mã lịch hẹn: <strong>#{appointmentDetails.id}</strong>
                    </p>
                  </div>
                </div>

                <div className="next-steps">
                  <h4>Tiếp theo là gì?</h4>
                  <ul>
                    <li>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 12L11 14L15 10"
                          stroke="#10B981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Vui lòng đến trước 10 phút so với giờ hẹn
                    </li>
                    <li>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 12L11 14L15 10"
                          stroke="#10B981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Sau khi khám xong, bạn có thể đánh giá bác sĩ
                    </li>
                  </ul>
                </div>
              </div>

              <div className="modal-footer success-footer">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate("/");
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Về Trang chủ
                </button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate("/appointments");
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="6"
                      width="18"
                      height="15"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Xem Lịch hẹn của tôi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoctorDetail;
