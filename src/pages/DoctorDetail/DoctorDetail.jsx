import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Header from "../../components/Header/Header";
import "./DoctorDetail.css";

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingDates, setBookingDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  useEffect(() => {
    fetchDoctorDetail();
    generateBookingDates();
  }, [id]);

  // Fetch time slots when date is selected
  useEffect(() => {
    if (selectedDate && doctor) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDate, doctor]);

  const generateBookingDates = () => {
    const dates = [];
    const today = new Date();
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Skip weekends (Sunday = 0, Saturday = 6)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          day: daysOfWeek[date.getDay()],
          date: date.getDate(),
          fullDate: date,
          month: date.getMonth() + 1, // JavaScript months are 0-indexed
          year: date.getFullYear(),
          formattedDate: date.toISOString().split("T")[0], // YYYY-MM-DD format
        });
      }
    }

    setBookingDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  };

  const fetchDoctorDetail = async () => {
    try {
      setLoading(true);
      console.log("Fetching doctor with ID:", id);

      const response = await api.get(`/doctors/${id}`);
      console.log("Doctor detail response:", response.data);

      const doctorData = response.data?.data || response.data;
      setDoctor(doctorData);


      if (doctorData.specialties && doctorData.specialties.length > 0) {
        fetchRelatedDoctors(doctorData.specialties[0].id);
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

  const fetchRelatedDoctors = async (specialtyId) => {
    try {
      console.log("Fetching related doctors for specialty:", specialtyId);

      const response = await api.get(`/doctors/search`, {
        params: { specialtyId: specialtyId },
      });

      console.log("Related doctors response:", response.data);

      const doctors = response.data?.data || response.data || [];
      const filtered = doctors.filter((d) => d.id !== parseInt(id)).slice(0, 5);

      setRelatedDoctors(filtered);
    } catch (err) {
      console.error("Error fetching related doctors:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  const fetchAvailableTimeSlots = async () => {
    try {
      setLoadingTimeSlots(true);
      console.log("Fetching time slots for:", {
        doctorId: id,
        date: selectedDate.formattedDate,
      });

      // Call API to get availability blocks for the selected date
      const response = await api.get(`/availability-blocks/doctor/${id}`, {
        params: {
          date: selectedDate.formattedDate,
        },
      });

      console.log("Time slots response:", response.data);

      const blocks = response.data?.data || response.data || [];

      // Extract time slots from availability blocks
      const slots = [];
      blocks.forEach((block) => {
        if (block.timeSlots && Array.isArray(block.timeSlots)) {
          block.timeSlots.forEach((slot) => {
            if (slot.status === "AVAILABLE") {
              // Convert ISO timestamp to readable time
              const startTime = new Date(slot.startTime);
              const timeString = startTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });

              slots.push({
                id: slot.id,
                time: timeString,
                startTime: slot.startTime,
                endTime: slot.endTime,
                blockId: block.id,
              });
            }
          });
        }
      });

      console.log("Processed time slots:", slots);
      setAvailableTimeSlots(slots);
      setSelectedTime(null); // Reset selected time when date changes
    } catch (err) {
      console.error("Error fetching time slots:", err);
      console.error("Error details:", err.response?.data);
      setAvailableTimeSlots([]);
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time");
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user.id) {
      alert("Please login to book an appointment");
      navigate("/login");
      return;
    }

    // Navigate to booking confirmation page with all necessary data
    navigate("/booking", {
      state: {
        doctor,
        date: selectedDate,
        timeSlot: selectedTime,
      },
    });
  };

  const handleTimeSlotClick = (slot) => {
    setSelectedTime(slot);
  };

  const formatSpecialties = (specialties) => {
    if (
      !specialties ||
      !Array.isArray(specialties) ||
      specialties.length === 0
    ) {
      return "General Physician";
    }
    return specialties.map((s) => s.name).join(", ");
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
          <button className="back-btn" onClick={() => navigate("/doctors")}>
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
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span onClick={() => navigate("/")}>Home</span>
            <span className="separator">/</span>
            <span onClick={() => navigate("/doctors")}>Doctors</span>
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
              {loadingTimeSlots ? (
                <div className="time-slots-loading">
                  <div className="loading-spinner-small"></div>
                  <p>Loading available time slots...</p>
                </div>
              ) : availableTimeSlots.length > 0 ? (
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
                  <p className="no-slots-hint">Please select another date.</p>
                </div>
              )}
            </div>

            <button
              className="book-appointment-btn"
              onClick={handleBookAppointment}
              disabled={!selectedDate || !selectedTime || loadingTimeSlots}
            >
              {loadingTimeSlots ? "Loading..." : "Book an appointment"}
            </button>
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
      </div>
    </>
  );
};

export default DoctorDetail;
