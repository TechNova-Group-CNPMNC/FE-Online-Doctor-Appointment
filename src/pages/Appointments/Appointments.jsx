import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserInfo,
  isPatient,
  isAuthenticated,
  getUserId,
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

  // Appointments data
  const [allAppointments, setAllAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Update form data
  const [updateFormData, setUpdateFormData] = useState({
    symptoms: "",
    suspectedDisease: "",
  });

  // Reschedule data
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedNewTimeSlot, setSelectedNewTimeSlot] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Loading states
  const [cancelLoading, setCancelLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("Please login to access this page");
      navigate("/login");
      return;
    }

    if (!isPatient()) {
      setError("Access denied. Only patients can access this page.");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    const id = getUserId();
    if (!id) {
      setError("Patient profile not found. Please contact support.");
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

  const fetchAppointments = async (status = null) => {
    if (!patientId) return;

    try {
      setLoading(true);
      setError("");

      let url = `/appointments?patientId=${patientId}`;
      if (status) {
        url += `&status=${status}`;
      }

      console.log("📡 Fetching appointments from:", url);
      const response = await api.get(url);
      console.log("✅ Appointments response:", response.data);

      const appointments = response.data?.data || response.data || [];
      setAllAppointments(Array.isArray(appointments) ? appointments : []);
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);

      if (err.response?.status === 403) {
        setError("Access denied. You can only view your own appointments.");
      } else if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(err.response?.data?.message || "Failed to load appointments");
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

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedAppointment) return;

    try {
      setCancelLoading(true);
      setError("");

      console.log("🗑️ Canceling appointment:", selectedAppointment.id);

      const response = await api.delete(
        `/appointments/${selectedAppointment.id}`
      );
      console.log("✅ Cancel response:", response.data);

      setSuccess("Appointment canceled successfully!");
      setShowCancelModal(false);
      setSelectedAppointment(null);

      // Refresh appointments
      fetchAppointments();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error canceling appointment:", err);

      if (err.response?.status === 400) {
        setError(
          err.response?.data?.message ||
            "Cannot cancel appointment. Must cancel at least 48 hours in advance."
        );
      } else if (err.response?.status === 403) {
        setError("You can only cancel your own appointments.");
      } else {
        setError(err.response?.data?.message || "Failed to cancel appointment");
      }
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

    // Fetch available time slots for the same doctor
    try {
      const response = await api.get(
        `/doctors/${appointment.doctorId}/timeslots?status=AVAILABLE`
      );
      const timeSlots = response.data?.data || response.data || [];
      setAvailableTimeSlots(Array.isArray(timeSlots) ? timeSlots : []);
    } catch (err) {
      console.error("❌ Error fetching time slots:", err);
      setError("Failed to load available time slots");
    }
  };

  const handleUpdateConfirm = async () => {
    if (!selectedAppointment) return;

    try {
      setUpdateLoading(true);
      setError("");

      const updateData = {
        symptoms: updateFormData.symptoms,
        suspectedDisease: updateFormData.suspectedDisease,
      };

      if (isRescheduling && selectedNewTimeSlot) {
        updateData.newTimeSlotId = selectedNewTimeSlot;
      }

      console.log("📝 Updating appointment:", selectedAppointment.id);
      console.log("📝 Update data:", updateData);

      const response = await api.put(
        `/appointments/${selectedAppointment.id}`,
        updateData
      );
      console.log("✅ Update response:", response.data);

      setSuccess(
        isRescheduling
          ? "Appointment rescheduled successfully!"
          : "Appointment updated successfully!"
      );
      setShowUpdateModal(false);
      setSelectedAppointment(null);
      setIsRescheduling(false);
      setSelectedNewTimeSlot(null);

      // Refresh appointments
      fetchAppointments();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error updating appointment:", err);

      if (err.response?.status === 400) {
        setError(
          err.response?.data?.message ||
            "Cannot update appointment. Please check the requirements."
        );
      } else if (err.response?.status === 403) {
        setError("You can only update your own appointments.");
      } else {
        setError(err.response?.data?.message || "Failed to update appointment");
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canCancelAppointment = (appointment) => {
    if (appointment.status !== "PENDING") return false;

    const appointmentTime = new Date(appointment.startTime);
    const now = new Date();
    const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);

    return hoursUntilAppointment >= 48;
  };

  const canUpdateAppointment = (appointment) => {
    return appointment.status === "PENDING";
  };

  const canRescheduleAppointment = (appointment) => {
    if (appointment.status !== "PENDING") return false;
    if ((appointment.rescheduleCount || 0) >= 2) return false;

    const appointmentTime = new Date(appointment.startTime);
    const now = new Date();
    const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);

    return hoursUntilAppointment >= 48;
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

  const statusCounts = getStatusCounts();

  return (
    <>
      <Header />
      <div className="appointments-page">
        <div className="appointments-container">
          <div className="page-header">
            <h1>My Appointments</h1>
            <p>Manage and track your medical appointments</p>
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
                All Appointments
                <span className="tab-count">{statusCounts.ALL}</span>
              </button>
              <button
                className={`filter-tab ${
                  activeFilter === "PENDING" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("PENDING")}
              >
                Pending
                <span className="tab-count">{statusCounts.PENDING}</span>
              </button>
              <button
                className={`filter-tab ${
                  activeFilter === "COMPLETED" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("COMPLETED")}
              >
                Completed
                <span className="tab-count">{statusCounts.COMPLETED}</span>
              </button>
              <button
                className={`filter-tab ${
                  activeFilter === "CANCELED" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("CANCELED")}
              >
                Canceled
                <span className="tab-count">{statusCounts.CANCELED}</span>
              </button>
            </div>
          </div>

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading appointments...</p>
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
              <h3>No appointments found</h3>
              <p>
                {activeFilter === "ALL"
                  ? "You haven't booked any appointments yet"
                  : `No ${activeFilter.toLowerCase()} appointments`}
              </p>
              {activeFilter === "ALL" && (
                <button
                  className="btn-primary"
                  onClick={() => navigate("/find-a-doctor")}
                >
                  Book an Appointment
                </button>
              )}
            </div>
          )}

          {!loading && filteredAppointments.length > 0 && (
            <div className="appointments-list">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`appointment-card ${appointment.status.toLowerCase()}`}
                >
                  <div className="card-header">
                    <div className="doctor-info-section">
                      <img
                        src={
                          appointment.doctorProfileImage ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            appointment.doctorName
                          )}&size=120&background=667eea&color=fff&bold=true`
                        }
                        alt={appointment.doctorName}
                        className="doctor-avatar"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            appointment.doctorName
                          )}&size=120&background=667eea&color=fff&bold=true`;
                        }}
                      />
                      <div className="doctor-details">
                        <h3>{appointment.doctorName}</h3>
                        <span className="doctor-specialty">
                          {appointment.doctorSpecialty || "General Practice"}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`status-badge ${appointment.status.toLowerCase()}`}
                    >
                      <span className="status-dot"></span>
                      {appointment.status}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="info-row">
                      <div className="info-item">
                        <div className="info-icon">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                              stroke="#667eea"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="info-content">
                          <p className="info-label">Appointment Date</p>
                          <p className="info-value">
                            {formatDateTime(appointment.startTime)}
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
                            <path
                              d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                              stroke="#667eea"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M12 7V12L15 15"
                              stroke="#667eea"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="info-content">
                          <p className="info-label">Duration</p>
                          <p className="info-value">
                            {formatTime(appointment.startTime)} -{" "}
                            {formatTime(appointment.endTime)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {(appointment.symptoms || appointment.suspectedDisease) && (
                      <div className="symptoms-section">
                        {appointment.symptoms && (
                          <>
                            <h4>Symptoms</h4>
                            <p>{appointment.symptoms}</p>
                          </>
                        )}
                        {appointment.suspectedDisease && (
                          <>
                            <h4>Suspected Disease</h4>
                            <p>{appointment.suspectedDisease}</p>
                          </>
                        )}
                      </div>
                    )}

                    {appointment.rescheduleCount > 0 && (
                      <div className="reschedule-warning">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        <p>
                          Rescheduled {appointment.rescheduleCount} time
                          {appointment.rescheduleCount > 1 ? "s" : ""}
                          {appointment.rescheduleCount >= 2 &&
                            " (Maximum reached)"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    {canUpdateAppointment(appointment) && (
                      <button
                        className="btn-secondary"
                        onClick={() => handleUpdateClick(appointment)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
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
                        Update Info
                      </button>
                    )}

                    {canRescheduleAppointment(appointment) && (
                      <button
                        className="btn-outline"
                        onClick={() => handleRescheduleClick(appointment)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M22 12C22 17.52 17.52 22 12 22C6.48 22 3.11 16.44 3.11 16.44M3.11 16.44H7.63M3.11 16.44V21.44M2 12C2 6.48 6.44 2 12 2C18.67 2 22 7.56 22 7.56M22 7.56V2.56M22 7.56H17.56"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Reschedule
                      </button>
                    )}

                    {canCancelAppointment(appointment) && (
                      <button
                        className="btn-danger"
                        onClick={() => handleCancelClick(appointment)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
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
                        Cancel
                      </button>
                    )}

                    {!canCancelAppointment(appointment) &&
                      appointment.status === "PENDING" && (
                        <div className="alert alert-info">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                          Cannot cancel (less than 48 hours)
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedAppointment && (
        <div
          className="modal-overlay"
          onClick={() => setShowCancelModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Cancel Appointment</h3>
              <button
                className="modal-close"
                onClick={() => setShowCancelModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to cancel your appointment with{" "}
                <strong>{selectedAppointment.doctorName}</strong> on{" "}
                <strong>{formatDateTime(selectedAppointment.startTime)}</strong>
                ?
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
                This action cannot be undone. The time slot will become
                available for other patients.
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-outline"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
              >
                No, Keep It
              </button>
              <button
                className="btn-danger"
                onClick={handleCancelConfirm}
                disabled={cancelLoading}
              >
                {cancelLoading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Canceling...
                  </>
                ) : (
                  "Yes, Cancel Appointment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update/Reschedule Modal */}
      {showUpdateModal && selectedAppointment && (
        <div
          className="modal-overlay"
          onClick={() => setShowUpdateModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {isRescheduling
                  ? "Reschedule Appointment"
                  : "Update Appointment"}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowUpdateModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {isRescheduling && (
                <div className="reschedule-warning">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p>
                    You have rescheduled this appointment{" "}
                    {selectedAppointment.rescheduleCount || 0} time
                    {(selectedAppointment.rescheduleCount || 0) !== 1
                      ? "s"
                      : ""}
                    . Maximum 2 reschedules allowed.
                  </p>
                </div>
              )}

              <div className="form-group">
                <label>Symptoms</label>
                <textarea
                  value={updateFormData.symptoms}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      symptoms: e.target.value,
                    })
                  }
                  placeholder="Describe your symptoms..."
                />
              </div>

              <div className="form-group">
                <label>Suspected Disease (Optional)</label>
                <input
                  type="text"
                  value={updateFormData.suspectedDisease}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      suspectedDisease: e.target.value,
                    })
                  }
                  placeholder="e.g., Flu, Migraine..."
                />
              </div>

              {isRescheduling && (
                <div className="form-group">
                  <label>Select New Time Slot</label>
                  <div className="time-slots-grid">
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          className={`time-slot-btn ${
                            selectedNewTimeSlot === slot.id ? "selected" : ""
                          }`}
                          onClick={() => setSelectedNewTimeSlot(slot.id)}
                        >
                          {formatTime(slot.startTime)}
                        </button>
                      ))
                    ) : (
                      <p>No available time slots</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn-outline"
                onClick={() => setShowUpdateModal(false)}
                disabled={updateLoading}
              >
                Cancel
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
                    Updating...
                  </>
                ) : isRescheduling ? (
                  "Confirm Reschedule"
                ) : (
                  "Update Appointment"
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
