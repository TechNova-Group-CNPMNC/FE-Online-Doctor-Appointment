import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import "./FindADoctor.css";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";

const FindADoctor = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableSpecialties, setAvailableSpecialties] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const navigate = useNavigate();

  // Fetch specialties and doctors on component mount
  useEffect(() => {
    fetchSpecialties();
    fetchAllDoctors();
    generateNext7Days();
  }, []);

  const generateNext7Days = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = date.getDate();
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

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
    // Set today as default
    setSelectedDate(dates[0].value);
  };

  const fetchSpecialties = async () => {
    try {
      const response = await api.get("/specialties");
      console.log("Specialties response:", response);

      const specialtiesData = response.data?.data || response.data || [];
      setAvailableSpecialties(specialtiesData);
      console.log("Available specialties:", specialtiesData);
    } catch (err) {
      console.error("Error fetching specialties:", err);
      setAvailableSpecialties([
        { id: 1, name: "Tim mạch" },
        { id: 2, name: "Da liễu" },
        { id: 3, name: "Nhi khoa" },
        { id: 4, name: "Thần kinh" },
        { id: 5, name: "Chỉnh hình" },
        { id: 6, name: "Ung bướu" },
        { id: 7, name: "Tâm thần" },
        { id: 192, name: "Y khoa tổng quát" },
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
    if (!selectedSpecialty || !selectedDate) {
      setError("Vui lòng chọn chuyên khoa và ngày");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Build query params matching backend API
      const params = new URLSearchParams();
      params.append("specialty", selectedSpecialty);
      params.append("date", selectedDate);

      if (selectedName.trim()) {
        params.append("name", selectedName.trim());
      }

      console.log("Search params:", params.toString());

      const response = await api.get(`/doctors/search?${params.toString()}`);
      console.log("Search response:", response);

      const results = response.data?.data || response.data || [];
      const resultsArray = Array.isArray(results) ? results : [results];

      setSearchResults(resultsArray);
      setHasSearched(true);

      console.log("Search results:", resultsArray);
    } catch (err) {
      console.error("Search error:", err);

      if (err.response?.status === 404) {
        setSearchResults([]);
        setHasSearched(true);
        setError("Không tìm thấy bác sĩ nào phù hợp với tiêu chí của bạn.");
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
    setSelectedDate(availableDates[0]?.value || "");
    setSearchResults([]);
    setHasSearched(false);
    setError("");
    fetchAllDoctors();
  };

  // Show all doctors initially, or search results after search
  const displayedDoctors = hasSearched ? searchResults : doctors;

  const isSearchDisabled = !selectedSpecialty || !selectedDate;

  // Format doctor specialty names for display
  const formatSpecialties = (specialties) => {
    if (
      !specialties ||
      !Array.isArray(specialties) ||
      specialties.length === 0
    ) {
      return "Khoa tổng quát";
    }
    return specialties.map((s) => s.name).join(", ");
  };

  return (
    <>
      <Header />
      <div className="find-doctor-page">
        <div className="container">
          <div className="search-section">
            <h1>Tìm bác sĩ</h1>

            <div className="search-form">
              {/* Specialty Selector */}
              <div className="form-group">
                <label className="form-label">Chuyên khoa *</label>
                <select
                  className="form-select"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Chọn chuyên khoa</option>
                  {availableSpecialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </select>

                {/* Doctor Name Input */}
                <div className="form-group">
                  <label className="form-label">Tên bác sĩ (Tùy chọn)</label>
                  <input
                    type="text"
                    placeholder="Tìm theo tên..."
                    className="form-input"
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Date Selector - Next 7 Days */}
              <div className="form-group date-group">
                <label className="form-label">
                  Ngày có sẵn *
                  <span className="label-hint">(10 ngày tiếp theo)</span>
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
            </div>

            {/* Search Buttons */}
            <div className="search-buttons">
              <button
                className="search-btn"
                onClick={handleSearch}
                disabled={isSearchDisabled || loading}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Đang tìm...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Tìm bác sĩ
                  </>
                )}
              </button>
              {hasSearched && (
                <button
                  className="reset-btn"
                  onClick={handleReset}
                  disabled={loading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 4L20 20M20 4L4 20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Đặt lại
                </button>
              )}
            </div>

            {error && (
              <div className="error-message">
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
          </div>

          <div className="results-section">
            {loading && (
              <div className="loading-message">
                <div className="loading-spinner"></div>
                <p>Loading doctors...</p>
              </div>
            )}

            {!loading && hasSearched && (
              <div className="search-info">
                <h2>Search Results</h2>
                <p>
                  {searchResults.length} doctor
                  {searchResults.length !== 1 ? "s" : ""} found
                  {selectedDate && (
                    <span className="search-date-info">
                      {" "}
                      on{" "}
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </p>
              </div>
            )}

            {!loading && displayedDoctors.length === 0 && hasSearched ? (
              <div className="no-results">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <h3>No doctors found</h3>
                <p>
                  Try adjusting your search criteria or selecting a different
                  date.
                </p>
              </div>
            ) : (
              !loading && (
                <div className="doctors-grid">
                  {displayedDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="doctor-card"
                      onClick={() => navigate(`/doctor/${doctor.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="card-header">
                        {/* <button className="favorite-btn">
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
                        </button> */}
                      </div>

                      <div className="doctor-image">
                        <img
                          src={
                            doctor.profileImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              doctor.fullName
                            )}&size=200&background=667eea&color=fff&bold=true`
                          }
                          alt={doctor.fullName}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              doctor.fullName
                            )}&size=200&background=667eea&color=fff&bold=true`;
                          }}
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
                          <p className="doctor-bio">{doctor.bio}</p>
                        )}

                        <div className="rating">
                          <div className="stars">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                width="14"
                                height="13"
                                viewBox="0 0 14 13"
                                fill="none"
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
                            {doctor.averageRating?.toFixed(1) || "0.0"}
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
    </>
  );
};

export default FindADoctor;
