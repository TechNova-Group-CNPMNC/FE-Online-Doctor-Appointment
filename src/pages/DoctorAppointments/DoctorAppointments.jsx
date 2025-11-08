import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, isDoctor, getDoctorId } from "../../util/jwtdecoder";
import api from "../../services/api";
import Header from "../../components/Header/Header";
import "./DoctorAppointments.css";

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [doctorId, setDoctorId] = useState(null);

  const [allAppointments, setAllAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [groupedAppointments, setGroupedAppointments] = useState({});
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("Vui lòng đăng nhập để truy cập trang này");
      navigate("/login");
      return;
    }

    if (!isDoctor()) {
      setError(
        "Truy cập bị từ chối. Chỉ bác sĩ mới có thể truy cập trang này."
      );
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    const id = getDoctorId();
    if (!id) {
      setError("Không tìm thấy hồ sơ bác sĩ. Vui lòng liên hệ hỗ trợ.");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    setDoctorId(id);
    generateNext7Days();
  }, [navigate]);

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId, selectedDate]);

  useEffect(() => {
    filterAppointments();
  }, [activeFilter, allAppointments]);

  useEffect(() => {
    groupAppointmentsByDate();
  }, [filteredAppointments]);

  const generateNext7Days = () => {
    const dates = [];
    const today = new Date();

    for (let i = -9; i < 9; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("vi-VN", { weekday: "short" });
      const dayNum = date.getDate();
      const monthName = date.toLocaleDateString("vi-VN", { month: "short" });

      dates.push({
        value: dateStr,
        label: `${dayName}, ${monthName} ${dayNum}`,
        dayName: dayName,
        dayNum: dayNum,
        monthName: monthName,
        isToday: i === 0,
      });
    }

    setAvailableDates(dates);
    setSelectedDate(dates[0].value);
  };

  const fetchAppointments = async () => {
    if (!doctorId || !selectedDate) return;

    try {
      setLoading(true);
      setError("");

      const params = {
        date: selectedDate,
      };

      const url = `/doctors/${doctorId}/appointments`;
      const response = await api.get(url, { params });
      const appointments = response.data?.data || response.data || [];
      setAllAppointments(Array.isArray(appointments) ? appointments : []);
    } catch (err) {
      console.error("Error fetching appointments:", err);

      if (err.response?.status === 404) {
        setAllAppointments([]);
      } else {
        setError(
          err.response?.data?.message || "Không thể tải danh sách lịch hẹn"
        );
      }
    } finally {
      setLoading(false);
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
      const dateKey = new Date(appointment.startTime)
        .toISOString()
        .split("T")[0];

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
    }

    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
      PENDING: "Chờ khám",
      CONFIRMED: "Đã xác nhận",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      setUpdateLoading(true);
      setError("");
      setSuccess("");

      if (newStatus === "COMPLETED") {
        await api.put(
          `/doctors/${doctorId}/appointments/${appointmentId}/complete`
        );
        setSuccess("Xác nhận hoàn thành lịch hẹn thành công!");

        fetchAppointments();
        setShowUpdateModal(false);

        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Error updating status:", err);

      if (err.response?.status === 403) {
        setError("Bạn chỉ có thể xác nhận lịch hẹn của chính mình");
      } else if (err.response?.status === 400) {
        const errorMsg = err.response?.data?.message || err.response?.data;
        if (errorMsg.includes("đã được hoàn thành")) {
          setError("Lịch hẹn này đã được hoàn thành trước đó");
        } else if (errorMsg.includes("đã bị hủy")) {
          setError("Không thể hoàn thành lịch hẹn đã bị hủy");
        } else if (errorMsg.includes("không thuộc về bác sĩ")) {
          setError("Lịch hẹn này không thuộc về bạn");
        } else {
          setError(errorMsg);
        }
      } else if (err.response?.status === 404) {
        setError("Không tìm thấy lịch hẹn");
      } else {
        setError(
          err.response?.data?.message || "Không thể cập nhật trạng thái"
        );
      }
    } finally {
      setTimeout(() => setError(""), 5000);
      setUpdateLoading(false);
    }
  };

  const getStatusCounts = () => {
    return {
      ALL: allAppointments.length,
      PENDING: allAppointments.filter((apt) => apt.status === "PENDING").length,
      CONFIRMED: allAppointments.filter((apt) => apt.status === "CONFIRMED")
        .length,
      COMPLETED: allAppointments.filter((apt) => apt.status === "COMPLETED")
        .length,
      CANCELLED: allAppointments.filter((apt) => apt.status === "CANCELLED")
        .length,
    };
  };

  const statusCounts = getStatusCounts();

  const canUpdateStatus = (appointment) => {
    return appointment.status === "PENDING";
  };

  return (
    <>
      <Header />
      <div className="doctor-appointments-page">
        <div className="appointments-container">
          <div className="page-header">
            <h1>Quản lý Lịch hẹn</h1>
            <p>Xem và quản lý các lịch hẹn của bệnh nhân</p>
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
            {/* Date Picker Grid - Card riêng */}
            <div className="form-group date-group">
              <label className="form-label">
                Chọn ngày xem lịch hẹn
                {/* <span className="label-hint"> (10 ngày tiếp theo)</span> */}
              </label>
              <div className="date-picker-grid">
                {availableDates.map((dateObj) => (
                  <button
                    key={dateObj.value}
                    type="button"
                    className={`date-picker-btn ${
                      selectedDate === dateObj.value ? "active" : ""
                    } ${dateObj.isToday ? "today" : ""}`}
                    onClick={() => setSelectedDate(dateObj.value)}
                    disabled={loading}
                  >
                    <span className="date-day">{dateObj.dayName}</span>
                    <span className="date-number">{dateObj.dayNum}</span>
                    <span className="date-month">{dateObj.monthName}</span>
                    {dateObj.isToday && (
                      <span className="today-badge">Hôm nay</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Tabs - Card riêng */}
            <div className="filter-tabs-container">
              <label className="filter-tabs-label">Lọc theo trạng thái</label>
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
                  Chờ khám
                  <span className="tab-count">{statusCounts.PENDING}</span>
                </button>
                <button
                  className={`filter-tab ${
                    activeFilter === "CONFIRMED" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter("CONFIRMED")}
                >
                  Đã xác nhận
                  <span className="tab-count">{statusCounts.CONFIRMED}</span>
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
                    activeFilter === "CANCELLED" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter("CANCELLED")}
                >
                  Đã hủy
                  <span className="tab-count">{statusCounts.CANCELLED}</span>
                </button>
              </div>
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
              <h3>Không có lịch hẹn nào</h3>
              <p>Chưa có lịch hẹn nào trong ngày này</p>
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
                          {appointments.length} lịch hẹn
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
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                appointment.patientName
                              )}&size=108&background=667eea&color=fff&bold=true`}
                              alt={appointment.patientName}
                              className="patient-avatar"
                            />
                            <div className="card-info">
                              <div className="card-header">
                                <h3 className="patient-name">
                                  {appointment.patientName}
                                </h3>
                                <div
                                  className={`status-badge ${appointment.status.toLowerCase()}`}
                                >
                                  <span className="status-dot"></span>
                                  {formatStatus(appointment.status)}
                                </div>
                              </div>
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
                            appointment.suspectedDisease ||
                            appointment.medicalHistory) && (
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
                              {appointment.medicalHistory && (
                                <>
                                  {(appointment.symptoms ||
                                    appointment.suspectedDisease) &&
                                    " • "}
                                  <span className="details-label">
                                    Tiền sử bệnh:
                                  </span>
                                  {" " + appointment.medicalHistory}
                                </>
                              )}
                            </div>
                          )}

                          {appointment.rating && (
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

                          {canUpdateStatus(appointment) && (
                            <div className="card-actions">
                              {appointment.status === "PENDING" && (
                                <button
                                  className="btn-sm btn-confirm-action"
                                  onClick={() =>
                                    handleUpdateStatus(
                                      appointment.id,
                                      "COMPLETED"
                                    )
                                  }
                                  disabled={updateLoading}
                                >
                                  <svg viewBox="0 0 24 24" fill="none">
                                    <path
                                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  Hoàn thành khám
                                </button>
                              )}
                              {appointment.status === "CONFIRMED" && (
                                <button
                                  className="btn-sm btn-complete-action"
                                  onClick={() =>
                                    handleUpdateStatus(
                                      appointment.id,
                                      "COMPLETED"
                                    )
                                  }
                                  disabled={updateLoading}
                                >
                                  <svg viewBox="0 0 24 24" fill="none">
                                    <path
                                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  Hoàn thành
                                </button>
                              )}
                            </div>
                          )}
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
    </>
  );
};

export default DoctorAppointments;
