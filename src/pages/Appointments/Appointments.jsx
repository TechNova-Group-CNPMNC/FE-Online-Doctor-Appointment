import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserInfo,
  isPatient,
  isAuthenticated,
  getUserId,
  getPatientId,
} from "../../util/jwtdecoder";
import api from "../../services/api";
import Header from "../../components/Header/Header";
import "./Appointments.css";

const Appointments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [patientId, setPatientId] = useState(null);

  const [allAppointments, setAllAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [groupedAppointments, setGroupedAppointments] = useState({});
  const [activeFilter, setActiveFilter] = useState("ALL");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [updateFormData, setUpdateFormData] = useState({
    symptoms: "",
    suspectedDisease: "",
  });

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedNewTimeSlot, setSelectedNewTimeSlot] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const [cancelLoading, setCancelLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  //rating
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingFormData, setRatingFormData] = useState({
    stars: 0,
    feedbackText: "",
  });
  const [ratingLoading, setRatingLoading] = useState(false);

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
    if (!id) {
      setError("Không tìm thấy hồ sơ bệnh nhân. Vui lòng liên hệ hỗ trợ.");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    setPatientId(id);
  }, [navigate]);

  useEffect(() => {
    if (patientId) {
      fetchAppointments();
    }
  }, [patientId]);

  useEffect(() => {
    filterAppointments();
  }, [activeFilter, allAppointments]);

  useEffect(() => {
    groupAppointmentsByDate();
  }, [filteredAppointments]);

  const fetchAppointments = async (status = null) => {
    if (!patientId) return;

    try {
      setLoading(true);
      setError("");

      let url = `/appointments?patientId=${patientId}`;
      if (status) {
        url += `&status=${status}`;
      }

      const response = await api.get(url);
      const appointments = response.data?.data || response.data || [];
      setAllAppointments(Array.isArray(appointments) ? appointments : []);
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);

      if (err.response?.status === 403) {
        setError(
          "Truy cập bị từ chối. Bạn chỉ có thể xem các cuộc hẹn của chính mình."
        );
      } else if (err.response?.status === 401) {
        setError("Phiên đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(err.response?.data?.message || "Không thể tải lịch hẹn");
      }
    } finally {
      setLoading(false);
      setTimeout(() => setError(""), 5000);
    }
  };

  const filterAppointments = () => {
    if (activeFilter === "ALL") {
      setFilteredAppointments(allAppointments);
    } else {
      setFilteredAppointments(
        allAppointments.filter((apt) => apt.status === activeFilter)
      );
    }
  };

  const groupAppointmentsByDate = () => {
    const grouped = {};

    filteredAppointments.forEach((appointment) => {
      const date = new Date(appointment.startTime);
      const dateKey = date.toISOString().split("T")[0];

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(appointment);
    });

    Object.keys(grouped).forEach((dateKey) => {
      grouped[dateKey].sort(
        (a, b) => new Date(a.startTime) - new Date(b.startTime)
      );
    });

    const sortedGrouped = Object.keys(grouped)
      .sort((a, b) => new Date(a) - new Date(b))
      .reduce((acc, key) => {
        acc[key] = grouped[key];
        return acc;
      }, {});

    setGroupedAppointments(sortedGrouped);
  };

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Hôm nay";
    } else if (date.getTime() === tomorrow.getTime()) {
      return "Ngày mai";
    } else {
      return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const formatDateSubtitle = (dateString, count) => {
    return `${count} lịch hẹn`;
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedAppointment) return;

    try {
      setCancelLoading(true);
      setError("");

      await api.delete(`/appointments/${selectedAppointment.id}`);

      setSuccess("Đã hủy lịch hẹn thành công!");
      setShowCancelModal(false);
      setSelectedAppointment(null);

      fetchAppointments();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error canceling appointment:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Hủy lịch hẹn thất bại";

      setError(errorMessage);
      console.log("Error message set to:", errorMessage);

      setShowCancelModal(false);
      setSelectedAppointment(null);

      setTimeout(() => setError(""), 5000);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleUpdateClick = (appointment) => {
    setSelectedAppointment(appointment);
    setUpdateFormData({
      symptoms: appointment.symptoms || "",
      suspectedDisease: appointment.suspectedDisease || "",
    });
    setIsRescheduling(false);
    setSelectedNewTimeSlot(null);
    setShowUpdateModal(true);
  };

  const handleRescheduleClick = async (appointment) => {
    setSelectedAppointment(appointment);
    setUpdateFormData({
      symptoms: appointment.symptoms || "",
      suspectedDisease: appointment.suspectedDisease || "",
    });
    setIsRescheduling(true);
    setShowUpdateModal(true);

    //lấy ngày/giờ trống của bác sĩ
    try {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 14);

      const startDateStr = today.toISOString().split("T")[0];
      const endDateStr = endDate.toISOString().split("T")[0];

      const response = await api.get(
        `/doctors/${appointment.doctorId}/detail`,
        {
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
          },
        }
      );

      const doctorData = response.data?.data || response.data;
      const timeSlotsByDate = [];

      if (doctorData.timeSlotsByDate) {
        const sortedDates = Object.keys(doctorData.timeSlotsByDate).sort(
          (a, b) => new Date(a) - new Date(b)
        );

        sortedDates.forEach((dateKey) => {
          const slotsForDate = doctorData.timeSlotsByDate[dateKey];
          // Chỉ lấy slots AVAILABLE
          const availableSlots = slotsForDate.filter(
            (slot) => slot.status === "AVAILABLE"
          );

          if (availableSlots.length > 0) {
            timeSlotsByDate.push({
              date: dateKey,
              slots: availableSlots.sort(
                (a, b) => new Date(a.startTime) - new Date(b.startTime)
              ),
            });
          }
        });
      }

      setAvailableTimeSlots(timeSlotsByDate);

      if (timeSlotsByDate.length === 0) {
        setError("Bác sĩ không có khung giờ trống trong 14 ngày tới");
      }
    } catch (err) {
      console.error("❌ Error fetching time slots:", err);
      setError(
        err.response?.data?.message ||
          "Không thể tải các khung giờ trống của bác sĩ"
      );
      setAvailableTimeSlots([]);
    }
  };

  const formatDateForSlot = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Hôm nay";
    } else if (date.getTime() === tomorrow.getTime()) {
      return "Ngày mai";
    } else {
      return date.toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  const handleUpdateConfirm = async () => {
    if (!selectedAppointment) return;

    try {
      setUpdateLoading(true);
      setError("");

      const updateData = {
        appointmentId: selectedAppointment.id,
        symptoms: updateFormData.symptoms,
        suspectedDisease: updateFormData.suspectedDisease,
      };

      if (isRescheduling && selectedNewTimeSlot) {
        updateData.newTimeSlotId = selectedNewTimeSlot;
      }

      console.log("Sending update data:", updateData);

      await api.put(`/appointments/${selectedAppointment.id}`, updateData);

      setSuccess(
        isRescheduling
          ? "Đã dời lịch hẹn thành công!"
          : "Đã cập nhật lịch hẹn thành công!"
      );
      setShowUpdateModal(false);
      setSelectedAppointment(null);
      setIsRescheduling(false);
      setSelectedNewTimeSlot(null);

      fetchAppointments();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error updating appointment:", err);

      // Lấy error message từ response
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Cập nhật lịch hẹn thất bại";

      setError(errorMessage);
      console.log("Error message set to:", errorMessage);

      // Không đóng modal để user có thể thấy lỗi và sửa
      // setShowUpdateModal(false);
      // setSelectedAppointment(null);
      // setIsRescheduling(false);
      // setSelectedNewTimeSlot(null);

      setTimeout(() => setError(""), 5000);
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status) => {
    const statusMap = {
      PENDING: "Chờ",
      COMPLETED: "Hoàn thành",
      CANCELED: "Đã hủy",
      CONFIRMED: "Xác nhận",
    };
    return statusMap[status] || status;
  };

  // Chỉ check status để hiển thị button, không check logic nghiệp vụ
  const canCancelAppointment = (appointment) => {
    return appointment.status === "PENDING";
  };

  const canUpdateAppointment = (appointment) => {
    return appointment.status === "PENDING";
  };

  const canRescheduleAppointment = (appointment) => {
    return appointment.status === "PENDING";
  };

  const getStatusCounts = () => {
    return {
      ALL: allAppointments.length,
      PENDING: allAppointments.filter((apt) => apt.status === "PENDING").length,
      COMPLETED: allAppointments.filter((apt) => apt.status === "COMPLETED")
        .length,
      CANCELED: allAppointments.filter((apt) => apt.status === "CANCELED")
        .length,
    };
  };

  const getEmptyStateMessage = () => {
    const messages = {
      ALL: "Bạn chưa đặt lịch hẹn nào",
      PENDING: "Không có lịch hẹn nào đang chờ",
      COMPLETED: "Không có lịch hẹn nào đã hoàn thành",
      CANCELED: "Không có lịch hẹn nào đã hủy",
    };
    return messages[activeFilter] || "Không có lịch hẹn";
  };

  const statusCounts = getStatusCounts();

  const handleRatingClick = (appointment) => {
    setSelectedAppointment(appointment);
    setRatingFormData({
      stars: appointment.rating || 0,
      feedbackText: appointment.feedback || "",
    });
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async () => {
    if (!selectedAppointment) return;

    if (ratingFormData.stars < 1 || ratingFormData.stars > 5) {
      setError("Vui lòng chọn số sao từ 1 đến 5");
      return;
    }

    try {
      setRatingLoading(true);
      setError("");

      const ratingData = {
        stars: ratingFormData.stars,
        feedbackText: ratingFormData.feedbackText.trim() || null,
      };

      console.log("📝 Submitting rating:", ratingData);

      const response = await api.post(
        `/appointments/${selectedAppointment.id}/rating`,
        ratingData
      );
      console.log("✅ Rating response:", response.data);

      setSuccess("Cảm ơn bạn đã đánh giá!");
      setShowRatingModal(false);
      setSelectedAppointment(null);
      setRatingFormData({ stars: 0, feedbackText: "" });

      // refresh để show thằng mới đánh giá
      fetchAppointments();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error submitting rating:", err);

      if (err.response?.status === 400) {
        const errorMsg = err.response?.data?.message || err.response?.data;
        if (errorMsg.includes("already been rated")) {
          setError("Bạn đã đánh giá lịch hẹn này rồi");
        } else if (errorMsg.includes("completed appointments")) {
          setError("Chỉ có thể đánh giá lịch hẹn đã hoàn thành");
        } else if (errorMsg.includes("Stars must be")) {
          setError("Số sao phải từ 1 đến 5");
        } else {
          setError(errorMsg);
        }
      } else if (err.response?.status === 404) {
        setError("Không tìm thấy lịch hẹn");
      } else {
        setError("Gửi đánh giá thất bại. Vui lòng thử lại.");
      }
    } finally {
      setRatingLoading(false);
    }
  };

  const canRateAppointment = (appointment) => {
    return appointment.status === "COMPLETED" && !appointment.rating;
  };

  const hasRating = (appointment) => {
    return appointment.rating !== null && appointment.rating !== undefined;
  };

  return (
    <>
      <Header />
      <div className="appointments-page">
        <div className="appointments-container">
          <div className="page-header">
            <h1>Lịch hẹn của tôi</h1>
            <p>Quản lý và theo dõi các lịch hẹn y tế</p>
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

          <div className="filter-section">
            <div className="filter-tabs">
              <button
                className={`filter-tab ${
                  activeFilter === "ALL" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("ALL")}
              >
                Tất cả
                <span className="tab-count">{statusCounts.ALL}</span>
              </button>
              <button
                className={`filter-tab ${
                  activeFilter === "PENDING" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("PENDING")}
              >
                Chờ
                <span className="tab-count">{statusCounts.PENDING}</span>
              </button>
              <button
                className={`filter-tab ${
                  activeFilter === "COMPLETED" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("COMPLETED")}
              >
                Hoàn thành
                <span className="tab-count">{statusCounts.COMPLETED}</span>
              </button>
              <button
                className={`filter-tab ${
                  activeFilter === "CANCELED" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("CANCELED")}
              >
                Đã hủy
                <span className="tab-count">{statusCounts.CANCELED}</span>
              </button>
            </div>
          </div>

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Đang tải lịch hẹn...</p>
            </div>
          )}

          {!loading && filteredAppointments.length === 0 && (
            <div className="empty-state">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3>Không tìm thấy lịch hẹn</h3>
              <p>{getEmptyStateMessage()}</p>
              {activeFilter === "ALL" && (
                <button
                  className="btn-primary"
                  onClick={() => navigate("/find-a-doctor")}
                >
                  Đặt lịch hẹn
                </button>
              )}
            </div>
          )}

          {!loading && filteredAppointments.length > 0 && (
            <div className="appointments-timeline">
              {Object.entries(groupedAppointments).map(
                ([date, appointments]) => (
                  <div key={date} className="date-group">
                    <div className="date-header">
                      <div className="date-icon">
                        <div className="date-day">
                          {new Date(date).toLocaleDateString("vi-VN", {
                            weekday: "short",
                          })}
                        </div>
                        <div className="date-number">
                          {new Date(date).getDate()}
                        </div>
                      </div>
                      <div className="date-info">
                        <h2 className="date-title">{formatDateHeader(date)}</h2>
                        <p className="date-subtitle">
                          {formatDateSubtitle(date, appointments.length)}
                        </p>
                      </div>
                    </div>

                    <div className="appointments-grid">
                      {appointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`appointment-card ${appointment.status.toLowerCase()}`}
                        >
                          <div className="card-main">
                            <img
                              src={
                                appointment.doctorProfileImage ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  appointment.doctorName
                                )}&size=108&background=667eea&color=fff&bold=true`
                              }
                              alt={appointment.doctorName}
                              className="doctor-avatar"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  appointment.doctorName
                                )}&size=108&background=667eea&color=fff&bold=true`;
                              }}
                            />
                            <div className="card-info">
                              <div className="card-header">
                                <h3 className="doctor-name">
                                  {appointment.doctorName}
                                </h3>
                                <div
                                  className={`status-badge ${appointment.status.toLowerCase()}`}
                                >
                                  <span className="status-dot"></span>
                                  {formatStatus(appointment.status)}
                                </div>
                              </div>
                              <span className="doctor-specialty">
                                {appointment.doctorSpecialty || "Đa khoa"}
                              </span>
                              <div className="time-info">
                                <svg viewBox="0 0 24 24" fill="none">
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
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {formatTime(appointment.startTime)} -{" "}
                                {formatTime(appointment.endTime)}
                              </div>
                            </div>
                          </div>

                          {(appointment.symptoms ||
                            appointment.suspectedDisease) && (
                            <div className="card-details">
                              {appointment.symptoms && (
                                <>
                                  <span className="details-label">
                                    Triệu chứng:
                                  </span>
                                  {" " + appointment.symptoms}
                                </>
                              )}
                              {appointment.suspectedDisease && (
                                <>
                                  {appointment.symptoms && " • "}
                                  <span className="details-label">
                                    Bệnh nghi ngờ:
                                  </span>
                                  {" " + appointment.suspectedDisease}
                                </>
                              )}
                            </div>
                          )}

                          {appointment.rescheduleCount > 0 && (
                            <div className="reschedule-badge">
                              <svg viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                              Dời {appointment.rescheduleCount} lần
                            </div>
                          )}

                          {hasRating(appointment) && (
                            <div className="rating-display">
                              <div className="stars-display">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill={
                                      i < appointment.rating
                                        ? "#FFD700"
                                        : "#E0E0E0"
                                    }
                                  >
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                  </svg>
                                ))}
                                <span className="rating-text">
                                  {appointment.rating}/5
                                </span>
                              </div>
                              {appointment.feedback && (
                                <p className="feedback-text">
                                  "{appointment.feedback}"
                                </p>
                              )}
                            </div>
                          )}

                          <div className="card-actions">
                            {canUpdateAppointment(appointment) && (
                              <button
                                className="btn-sm btn-secondary"
                                onClick={() => handleUpdateClick(appointment)}
                              >
                                <svg viewBox="0 0 24 24" fill="none">
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
                                Sửa
                              </button>
                            )}

                            {canRescheduleAppointment(appointment) && (
                              <button
                                className="btn-sm btn-outline"
                                onClick={() =>
                                  handleRescheduleClick(appointment)
                                }
                              >
                                <svg viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M22 12C22 17.52 17.52 22 12 22C6.48 22 3.11 16.44 3.11 16.44M3.11 16.44H7.63M3.11 16.44V21.44M2 12C2 6.48 6.44 2 12 2C18.67 2 22 7.56 22 7.56M22 7.56V2.56M22 7.56H17.56"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                Dời
                              </button>
                            )}

                            {canCancelAppointment(appointment) && (
                              <button
                                className="btn-sm btn-danger"
                                onClick={() => handleCancelClick(appointment)}
                              >
                                <svg viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M9.17 14.83L14.83 9.17M14.83 14.83L9.17 9.17"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                Hủy
                              </button>
                            )}

                            {canRateAppointment(appointment) && (
                              <button
                                className="btn-sm btn-rating"
                                onClick={() => handleRatingClick(appointment)}
                              >
                                <svg viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                Đánh giá
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {showRatingModal && selectedAppointment && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowRatingModal(false);
            setError("");
          }}
        >
          <div
            className="modal-content rating-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Đánh giá lịch hẹn</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowRatingModal(false);
                  setError("");
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {error && (
                <div
                  className="alert alert-error"
                  style={{ marginBottom: "16px" }}
                >
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

              <div className="appointment-info-summary">
                <p>
                  <strong>Bác sĩ:</strong> {selectedAppointment.doctorName}
                </p>
                <p>
                  <strong>Ngày khám:</strong>{" "}
                  {new Date(selectedAppointment.startTime).toLocaleDateString(
                    "vi-VN",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>

              <div className="form-group">
                <label>Đánh giá của bạn *</label>
                <div className="stars-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${
                        star <= ratingFormData.stars ? "active" : ""
                      }`}
                      onClick={() =>
                        setRatingFormData({ ...ratingFormData, stars: star })
                      }
                      disabled={ratingLoading}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          fill={
                            star <= ratingFormData.stars ? "#FFD700" : "#E0E0E0"
                          }
                          stroke={
                            star <= ratingFormData.stars ? "#FFD700" : "#CBD5E1"
                          }
                          strokeWidth="1.5"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
                <div className="rating-labels">
                  <span>Rất tệ</span>
                  <span>Tệ</span>
                  <span>Tạm ổn</span>
                  <span>Tốt</span>
                  <span>Xuất sắc</span>
                </div>
              </div>

              <div className="form-group">
                <label>Nhận xét (Không bắt buộc)</label>
                <textarea
                  value={ratingFormData.feedbackText}
                  onChange={(e) =>
                    setRatingFormData({
                      ...ratingFormData,
                      feedbackText: e.target.value,
                    })
                  }
                  placeholder="Chia sẻ trải nghiệm của bạn về buổi khám..."
                  rows="4"
                  disabled={ratingLoading}
                />
                <p className="field-hint">
                  Nhận xét của bạn sẽ giúp bác sĩ cải thiện chất lượng dịch vụ
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-outline"
                onClick={() => {
                  setShowRatingModal(false);
                  setError("");
                }}
                disabled={ratingLoading}
              >
                Hủy
              </button>
              <button
                className="btn-primary"
                onClick={handleRatingSubmit}
                disabled={ratingLoading || ratingFormData.stars === 0}
              >
                {ratingLoading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                    Gửi đánh giá
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && selectedAppointment && (
        <div
          className="modal-overlay"
          onClick={() => setShowCancelModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Hủy lịch hẹn</h3>
              <button
                className="modal-close"
                onClick={() => setShowCancelModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Bạn có chắc muốn hủy lịch hẹn với{" "}
                <strong>{selectedAppointment.doctorName}</strong>?
              </p>
              <div className="alert alert-info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Hành động này không thể hoàn tác
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-outline"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
              >
                Không
              </button>
              <button
                className="btn-danger"
                onClick={handleCancelConfirm}
                disabled={cancelLoading}
              >
                {cancelLoading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Đang hủy...
                  </>
                ) : (
                  "Xác nhận hủy"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && selectedAppointment && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowUpdateModal(false);
            setError("");
          }}
        >
          <div
            className="modal-content large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{isRescheduling ? "Dời lịch hẹn" : "Cập nhật lịch hẹn"}</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowUpdateModal(false);
                  setError("");
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {/* Hiển thị lỗi trong modal */}
              {error && (
                <div
                  className="alert alert-error"
                  style={{ marginBottom: "16px" }}
                >
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

              {/* {isRescheduling && (
              <div className="reschedule-warning">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <p>Đã dời {selectedAppointment.rescheduleCount || 0} lần</p>
              </div>
            )} */}

              <div className="form-group">
                <label>Triệu chứng</label>
                <textarea
                  value={updateFormData.symptoms}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      symptoms: e.target.value,
                    })
                  }
                  placeholder="Mô tả triệu chứng..."
                />
              </div>

              <div className="form-group">
                <label>Bệnh nghi ngờ</label>
                <input
                  type="text"
                  value={updateFormData.suspectedDisease}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      suspectedDisease: e.target.value,
                    })
                  }
                  placeholder="VD: Cảm cúm..."
                />
              </div>

              {isRescheduling && (
                <div className="form-group">
                  <label>Chọn khung giờ mới</label>
                  {availableTimeSlots.length > 0 ? (
                    <div className="time-slots-by-date">
                      {availableTimeSlots.map((dateGroup) => (
                        <div key={dateGroup.date} className="date-slot-group">
                          <div className="date-slot-header">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {formatDateForSlot(dateGroup.date)}
                            <span className="slot-count">
                              ({dateGroup.slots.length} khung giờ)
                            </span>
                          </div>
                          <div className="time-slots-grid">
                            {dateGroup.slots.map((slot) => (
                              <button
                                key={slot.id}
                                className={`time-slot-btn ${
                                  selectedNewTimeSlot === slot.id
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() => setSelectedNewTimeSlot(slot.id)}
                              >
                                <div className="slot-time">
                                  {formatTime(slot.startTime)}
                                </div>
                                <div className="slot-end-time">
                                  {formatTime(slot.endTime)}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-slots">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                          stroke="#cbd5e1"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p>Không có khung giờ trống</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn-outline"
                onClick={() => {
                  setShowUpdateModal(false);
                  setError("");
                }}
                disabled={updateLoading}
              >
                Hủy
              </button>
              <button
                className="btn-primary"
                onClick={handleUpdateConfirm}
                disabled={
                  updateLoading || (isRescheduling && !selectedNewTimeSlot)
                }
              >
                {updateLoading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Đang xử lý...
                  </>
                ) : isRescheduling ? (
                  "Xác nhận dời"
                ) : (
                  "Cập nhật"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Appointments;
