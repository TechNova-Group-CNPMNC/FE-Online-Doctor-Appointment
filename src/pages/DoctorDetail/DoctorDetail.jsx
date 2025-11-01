import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Header from "../../components/Header/Header";
import "./DoctorDetail.css";

// Mock data for doctors
const mockDoctors = [
  {
    id: 1,
    fullName: "Dr. Richard James",
    degree: "MBBS",
    bio: "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    consultationFee: 50,
    averageRating: 4.8,
    profileImage:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    specialties: [
      { id: 1, name: "Cardiology" },
      { id: 2, name: "Internal Medicine" },
    ],
    experience: 7,
  },
  {
    id: 2,
    fullName: "Dr. Sarah Johnson",
    degree: "MD",
    bio: "Board-certified physician specializing in family medicine with over 10 years of experience. Dedicated to providing personalized care to patients of all ages.",
    consultationFee: 60,
    averageRating: 4.9,
    profileImage:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    specialties: [{ id: 3, name: "Family Practice" }],
    experience: 10,
  },
  {
    id: 3,
    fullName: "Dr. Michael Chen",
    degree: "MBBS, MD",
    bio: "Experienced pediatrician committed to child health and wellness. Specializes in developmental pediatrics and adolescent medicine.",
    consultationFee: 55,
    averageRating: 4.7,
    profileImage:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
    specialties: [{ id: 4, name: "Pediatrics" }],
    experience: 8,
  },
  {
    id: 4,
    fullName: "Dr. Emily Rodriguez",
    degree: "MD",
    bio: "Specialized in neurology with a focus on headache disorders and epilepsy. Committed to evidence-based medicine and patient education.",
    consultationFee: 70,
    averageRating: 4.9,
    profileImage:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
    specialties: [{ id: 5, name: "Neurology" }],
    experience: 12,
  },
  {
    id: 5,
    fullName: "Dr. David Wilson",
    degree: "MBBS",
    bio: "Orthopedic surgeon with expertise in sports medicine and joint replacement. Passionate about helping patients return to active lifestyles.",
    consultationFee: 80,
    averageRating: 4.8,
    profileImage:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face",
    specialties: [{ id: 6, name: "Orthopedics" }],
    experience: 15,
  },
  {
    id: 6,
    fullName: "Dr. Lisa Anderson",
    degree: "MD",
    bio: "Dermatologist specializing in medical and cosmetic dermatology. Expert in skin cancer detection and treatment.",
    consultationFee: 65,
    averageRating: 4.9,
    profileImage:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    specialties: [{ id: 7, name: "Dermatology" }],
    experience: 9,
  },
  {
    id: 7,
    fullName: "Dr. David Lee",
    degree: "MD",
    bio: "Specializing in pediatric care and adolescent health.",
    consultationFee: 50,
    averageRating: 4.7,
    profileImage:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    specialties: [
      { id: 3, name: "Pediatrics" },
      { id: 12, name: "Adolescent Health" },
      { id: 4, name: "Internal Medicine" },
    ],
    experience: 7,
  },
];

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingDates, setBookingDates] = useState([]);

  useEffect(() => {
    fetchDoctorDetail();
    generateBookingDates();
  }, [id]);

  const generateBookingDates = () => {
    const dates = [];
    const today = new Date();
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        day: daysOfWeek[date.getDay()],
        date: date.getDate(),
        fullDate: date,
        month: date.getMonth(),
        year: date.getFullYear(),
      });
    }

    setBookingDates(dates);
    setSelectedDate(dates[0]);
  };

  const fetchDoctorDetail = async () => {
    try {
      setLoading(true);

      // Try to fetch from API first
      try {
        const response = await api.get(`/doctors/${id}`);
        const doctorData = response.data?.data || response.data;
        setDoctor(doctorData);

        // Fetch related doctors (same specialty)
        if (doctorData.specialties && doctorData.specialties.length > 0) {
          fetchRelatedDoctors(doctorData.specialties[0].id);
        }
      } catch (apiError) {
        console.log("API not available, using mock data");

        // Use mock data if API fails
        const mockDoctor = mockDoctors.find((d) => d.id === parseInt(id));

        if (mockDoctor) {
          setDoctor(mockDoctor);

          // Get related doctors with same specialty
          if (mockDoctor.specialties && mockDoctor.specialties.length > 0) {
            const related = mockDoctors
              .filter(
                (d) =>
                  d.id !== mockDoctor.id &&
                  d.specialties.some((s) =>
                    mockDoctor.specialties.some((ms) => ms.id === s.id)
                  )
              )
              .slice(0, 5);
            setRelatedDoctors(related);
          }
        } else {
          // If doctor not found in mock data, show first doctor
          setDoctor(mockDoctors[0]);
          setRelatedDoctors(mockDoctors.slice(1, 6));
        }
      }
    } catch (err) {
      console.error("Error fetching doctor:", err);
      // Fallback to first mock doctor
      setDoctor(mockDoctors[0]);
      setRelatedDoctors(mockDoctors.slice(1, 6));
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedDoctors = async (specialtyId) => {
    try {
      const response = await api.get(`/doctors/search?id=${specialtyId}`);
      const doctors = response.data?.data || response.data || [];
      const filtered = doctors.filter((d) => d.id !== parseInt(id)).slice(0, 5);
      setRelatedDoctors(filtered);
    } catch (err) {
      console.error("Error fetching related doctors:", err);
      // Use mock data as fallback
      const related = mockDoctors
        .filter((d) => d.id !== parseInt(id))
        .slice(0, 5);
      setRelatedDoctors(related);
    }
  };

  const timeSlots = [
    "8:00 am",
    "8:30 am",
    "9:00 am",
    "9:30 am",
    "10:00 am",
    "10:30 am",
    "11:00 am",
    "11:30 am",
  ];

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time");
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book an appointment");
      navigate("/login");
      return;
    }

    // Navigate to booking confirmation page
    navigate("/booking", {
      state: {
        doctor,
        date: selectedDate,
        time: selectedTime,
      },
    });
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
          <button
            onClick={() => navigate("/find-a-doctor")}
            className="back-btn"
          >
            Back to Find Doctors
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
            <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
              Home
            </span>
            <span className="separator">/</span>
            <span
              onClick={() => navigate("/find-a-doctor")}
              style={{ cursor: "pointer" }}
            >
              Doctors
            </span>
            <span className="separator">/</span>
            <span className="current">{doctor.fullName}</span>
          </div>

          {/* Doctor Info Section */}
          <div className="doctor-info-section">
            <div className="doctor-profile-card">
              <div className="doctor-image-wrapper">
                <img
                  src={doctor.profileImage}
                  alt={doctor.fullName}
                  className="doctor-profile-image"
                />
              </div>
            </div>

            <div className="doctor-details-card">
              <div className="doctor-header">
                <h1 className="doctor-name">
                  {doctor.fullName}
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
                  {doctor.degree} - {formatSpecialties(doctor.specialties)}
                  <span className="experience-badge">
                    {doctor.experience || 7} Years
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
                <p>{doctor.bio}</p>
              </div>

              <div className="appointment-fee">
                <span>Appointment fee:</span>
                <span className="fee-amount">${doctor.consultationFee}</span>
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
                    selectedDate?.date === dateObj.date ? "active" : ""
                  }`}
                  onClick={() => setSelectedDate(dateObj)}
                >
                  <span className="date-day">{dateObj.day}</span>
                  <span className="date-number">{dateObj.date}</span>
                </button>
              ))}
            </div>

            <div className="time-selector">
              {timeSlots.map((time, index) => (
                <button
                  key={index}
                  className={`time-button ${
                    selectedTime === time ? "active" : ""
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>

            <button
              className="book-appointment-btn"
              onClick={handleBookAppointment}
            >
              Book an appointment
            </button>
          </div>

          {/* Related Doctors Section */}
          {relatedDoctors.length > 0 && (
            <div className="related-doctors-section">
              <h2>Related Doctors</h2>
              <p className="related-subtitle">
                Simply browse through our extensive list of trusted doctors.
              </p>

              <div className="related-doctors-grid">
                {relatedDoctors.map((relDoc) => (
                  <div
                    key={relDoc.id}
                    className="related-doctor-card"
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate(`/doctor/${relDoc.id}`);
                    }}
                  >
                    <div className="related-doctor-image">
                      <img src={relDoc.profileImage} alt={relDoc.fullName} />
                    </div>
                    <div className="related-doctor-info">
                      <div className="availability-badge">
                        <span className="availability-dot"></span>
                        Available
                      </div>
                      <h3>{relDoc.fullName}</h3>
                      <p>{formatSpecialties(relDoc.specialties)}</p>
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
