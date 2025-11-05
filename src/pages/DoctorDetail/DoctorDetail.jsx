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
  // const [reason, setReason] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [suspectedDisease, setSuspectedDisease] = useState("");
  //
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchDoctorDetail();
  }, [id]);

  // Update time slots when date is selected
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
        alert(`Doctor with ID ${id} not found. Please select a valid doctor.`);
        navigate("/find-a-doctor");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateBookingDatesFromAvailable = (availableDates) => {
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

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
    // Check authentication first
    if (!isAuthenticated()) {
      alert("Please login to book an appointment");
      navigate("/login");
      return;
    }

    if (!isPatient()) {
      alert("Only patients can book appointments");
      return;
    }

    setSelectedTime(slot);
    setShowReasonModal(true);
    setError("");
    setSuccess("");
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time");
      return;
    }

    if (!symptoms.trim()) {
      setError("Please describe your symptoms");
      return;
    }

    const patientId = getPatientId();
    if (!patientId) {
      setError("Patient profile not found. Please contact support.");
      return;
    }

    try {
      setBookingLoading(true);
      setError("");
      setSuccess("");

      // Gửi đúng format theo backend AppointmentRequest
      const appointmentData = {
        patientId: parseInt(patientId),
        doctorId: parseInt(id),
        timeSlotId: selectedTime.id,
        symptoms: symptoms.trim(),
        suspectedDisease: suspectedDisease.trim() || null, // Optional
      };

      console.log("📝 Creating appointment:", appointmentData);

      const response = await api.post("/appointments", appointmentData);
      console.log("✅ Appointment created:", response.data);

      setSuccess("Appointment booked successfully!");
      setShowReasonModal(false);
      setSymptoms("");
      setSuspectedDisease("");

      // Refresh doctor detail to update available slots
      setTimeout(() => {
        fetchDoctorDetail();
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("❌ Error creating appointment:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.status === 409) {
        setError(
          "This time slot is no longer available. Please choose another time."
        );
        fetchDoctorDetail();
      } else if (err.response?.status === 400) {
        setError(
          err.response?.data?.message ||
            err.response?.data ||
            "Invalid appointment data. Please try again."
        );
      } else {
        setError(err.response?.data?.message || "Failed to create appointment");
      }
    } finally {
      setBookingLoading(false);
    }
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
      return "General Physician";
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
          <p>Loading doctor information...</p>
        </div>
      </>
    );
  }

  if (!doctor) {
    return (
      <>
        <Header />
        <div className="doctor-detail-error">
          <h2>Doctor not found</h2>
          <button
            className="back-btn"
            onClick={() => navigate("/find-a-doctor")}
          >
            Back to Doctors
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
          {/* Success/Error Alerts */}
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

          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span onClick={() => navigate("/")}>Home</span>
            <span className="separator">/</span>
            <span onClick={() => navigate("/find-a-doctor")}>Doctors</span>
            <span className="separator">/</span>
            <span className="current">{doctor.fullName}</span>
          </div>

          {/* Doctor Info Section */}
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
                    : "General Physician"}
                  <span className="experience-badge">
                    {doctor.experienceYears || 5}+ Years
                  </span>
                </div>
              </div>

              <div className="doctor-about">
                <h3>
                  About
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
                    "Experienced physician committed to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies."}
                </p>
              </div>

              {doctor.averageRating && (
                <div className="doctor-rating">
                  <span className="rating-label">Rating:</span>
                  <span className="rating-value">
                    ⭐ {doctor.averageRating.toFixed(1)}
                  </span>
                </div>
              )}

              <div className="appointment-fee">
                <span>Appointment fee:</span>
                <span className="fee-amount">
                  ${doctor.consultationFee || 50}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="booking-section">
            <h2>Booking slots</h2>

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
                      <p>No available time slots for this date.</p>
                      <p className="no-slots-hint">
                        Please select another date.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="no-slots-message">
                <p>No available booking slots at the moment.</p>
                <p className="no-slots-hint">Please check back later.</p>
              </div>
            )}
          </div>

          {/* Related Doctors Section */}
          {relatedDoctors.length > 0 && (
            <div className="related-doctors-section">
              <h2>Related Doctors</h2>
              <p className="related-subtitle">
                Other specialists in {formatSpecialties(doctor.specialties)}
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
                        Available
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

        {/* Reason Modal */}
        {showReasonModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Appointment Details</h3>
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
                    <strong>Doctor:</strong> {doctor.fullName}
                  </p>
                  <p>
                    <strong>Date:</strong> {selectedDate?.formattedDate}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedTime?.time}
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="symptoms">Symptoms *</label>
                  <textarea
                    id="symptoms"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe your symptoms (e.g., headache, fever, cough)..."
                    rows="3"
                    disabled={bookingLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="suspectedDisease">
                    Suspected Disease (Optional)
                  </label>
                  <input
                    type="text"
                    id="suspectedDisease"
                    value={suspectedDisease}
                    onChange={(e) => setSuspectedDisease(e.target.value)}
                    placeholder="If you suspect any specific condition..."
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
                  Cancel
                </button>
                <button
                  className="btn-confirm"
                  onClick={handleBookAppointment}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <>
                      <div className="spinner-small"></div>
                      Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
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
