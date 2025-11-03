import { useState, useEffect } from "react";
import MainLayout from '../../layouts/MainLayout'
import api from "../../services/api";
import "./FindADoctor.css";

const FindADoctor = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableSpecialties, setAvailableSpecialties] = useState([]);

  const timeSlots = [
    "07:00 - 08:00",
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
  ];

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Fetch specialties and doctors on component mount
  useEffect(() => {
    fetchSpecialties();
    fetchAllDoctors();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const response = await api.get("/specialties");
      console.log("Specialties response:", response);

      const specialtiesData = response.data?.data || response.data || [];
      setAvailableSpecialties(specialtiesData);
    } catch (err) {
      console.error("Error fetching specialties:", err);
      // Fallback to hardcoded list if API fails
      setAvailableSpecialties([
        { id: 1, name: "Cardiology" },
        { id: 2, name: "Dermatology" },
        { id: 3, name: "Pediatrics" },
        { id: 4, name: "Internal Medicine" },
        { id: 5, name: "Neurology" },
        { id: 6, name: "Orthopedics" },
        { id: 7, name: "Psychiatry" },
        { id: 8, name: "Ophthalmology" },
      ]);
    }
  };

  const fetchAllDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/doctors");
      console.log("All doctors response:", response);

      const doctorsData = response.data?.data || response.data || [];
      setDoctors(doctorsData);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Không thể tải danh sách bác sĩ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!selectedSpecialty) {
      setError("Vui lòng chọn chuyên khoa");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Build query parameters
      const params = new URLSearchParams();
      params.append("specialty", selectedSpecialty);

      if (selectedName.trim()) {
        params.append("name", selectedName.trim());
      }
      if (selectedDay) {
        params.append("day", selectedDay);
      }
      if (selectedTimeSlot) {
        params.append("timeSlot", selectedTimeSlot);
      }

      console.log("Search params:", params.toString());

      const response = await api.get(`/doctors/search?${params.toString()}`);
      console.log("Search response:", response);

      const results = response.data?.data || response.data || [];

      // Handle both array and single object responses
      const resultsArray = Array.isArray(results) ? results : [results];

      setSearchResults(resultsArray);
      setHasSearched(true);

      console.log("Search with:", {
        specialty: selectedSpecialty,
        name: selectedName,
        day: selectedDay,
        timeSlot: selectedTimeSlot,
      });
      console.log("Results:", resultsArray);
    } catch (err) {
      console.error("Search error:", err);

      // Handle 404 as "no results found" instead of error
      if (err.response?.status === 404) {
        setSearchResults([]);
        setHasSearched(true);
        setError("");
      } else {
        setError("Không thể tìm kiếm bác sĩ. Vui lòng thử lại.");
        setSearchResults([]);
        setHasSearched(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedSpecialty("");
    setSelectedName("");
    setSelectedDay("");
    setSelectedTimeSlot("");
    setSearchResults([]);
    setHasSearched(false);
    setError("");
    fetchAllDoctors();
  };

  // Show all doctors initially, or search results after search
  const displayedDoctors = hasSearched ? searchResults : doctors;

  const isDisabled = !selectedSpecialty;

  // Format doctor specialty names for display
  const formatSpecialties = (specialties) => {
    if (
      !specialties ||
      !Array.isArray(specialties) ||
      specialties.length === 0
    ) {
      return "General Practice";
    }
    return specialties.map((s) => s.name).join(", ");
  };

  return (
    <MainLayout>
    <div className="find-doctor-page">
      <div className="container">
        <div className="search-section">
          <h1>Find A Doctor</h1>
          <div className="search-form">
            <div className="form-group">
              <select
                className="form-select"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                disabled={loading}
              >
                <option value="">Speciality</option>
                {availableSpecialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.name}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                className="form-input"
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                disabled={isDisabled || loading}
              />
            </div>
            <div className="form-group">
              <select
                className="form-select"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                disabled={isDisabled || loading}
              >
                <option value="">Day</option>
                {days.map((day) => (
                  <option key={day} value={day.toLowerCase()}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <select
                className="form-select"
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                disabled={isDisabled || loading}
              >
                <option value="">Time Slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            <div className="search-buttons">
              <button
                className="search-btn"
                onClick={handleSearch}
                disabled={isDisabled || loading}
              >
                {loading ? "Đang tìm..." : "Search"}
              </button>
              {hasSearched && (
                <button
                  className="reset-btn"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {error && (
            <div
              className="error-message"
              style={{
                marginTop: "20px",
                color: "#d32f2f",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
        </div>

        <div className="results-section">
          {loading && (
            <div
              className="loading-message"
              style={{ textAlign: "center", padding: "40px" }}
            >
              <p>Đang tải...</p>
            </div>
          )}

          {!loading && hasSearched && (
            <div className="search-info">
              <h2>Search Results</h2>
              <p>
                {searchResults.length} doctor
                {searchResults.length !== 1 ? "s" : ""} found
              </p>
            </div>
          )}

          {!loading && displayedDoctors.length === 0 && hasSearched ? (
            <div className="no-results">
              <h3>No doctors found</h3>
              <p>Try adjusting your search criteria to find more results.</p>
            </div>
          ) : (
            !loading && (
              <div className="doctors-grid">
                {displayedDoctors.map((doctor) => (
                  <div key={doctor.id} className="doctor-card">
                    <div className="card-header">
                      <button className="favorite-btn">
                        <svg
                          width="20"
                          height="18"
                          viewBox="0 0 20 18"
                          fill="none"
                        >
                          <path
                            d="M10 17L8.55 15.7C3.4 11.36 0 8.28 0 4.5C0 1.42 2.42 -1 5.5 -1C7.24 -1 8.91 -0.18 10 1.09C11.09 -0.18 12.76 -1 14.5 -1C17.58 -1 20 1.42 20 4.5C20 8.28 16.6 11.36 11.45 15.7L10 17Z"
                            fill="#E0E0E0"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="doctor-image">
                      <img
                        src={
                          doctor.profileImage ||
                          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face"
                        }
                        alt={doctor.fullName}
                      />
                    </div>

                    <div className="doctor-info">
                      <h3 className="doctor-name">
                        {doctor.fullName}
                        {doctor.degree && `, ${doctor.degree}`}
                      </h3>
                      <p className="doctor-specialty">
                        {formatSpecialties(doctor.specialties)}
                      </p>

                      {doctor.bio && (
                        <p
                          className="doctor-bio"
                          style={{
                            fontSize: "13px",
                            color: "#666",
                            marginTop: "8px",
                            marginBottom: "12px",
                          }}
                        >
                          {doctor.bio}
                        </p>
                      )}

                      <div className="rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              width="14"
                              height="13"
                              viewBox="0 0 14 13"
                              fill={
                                i < Math.floor(doctor.averageRating || 0)
                                  ? "none"
                                  : "none"
                              }
                            >
                              <path
                                d="M7 0L8.5716 4.83688H13.6574L9.5429 7.82624L11.1145 12.6631L7 9.67376L2.8855 12.6631L4.4571 7.82624L0.342604 4.83688H5.4284L7 0Z"
                                fill={
                                  i < Math.floor(doctor.averageRating || 0)
                                    ? "#FFD700"
                                    : "#E0E0E0"
                                }
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="rating-text">
                          {doctor.averageRating?.toFixed(1) || "0.0"} (0
                          reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
    </MainLayout>
  );
};

export default FindADoctor;
