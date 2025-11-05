import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserInfo,
  isDoctor,
  isAuthenticated,
  getDoctorId,
} from "../../util/jwtdecoder";
import api from "../../services/api";
import Header from "../../components/Header/Header";
import "./DoctorAvailability.css";

const DoctorAvailability = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [doctorId, setDoctorId] = useState(null);

  // Availability blocks data
  const [availabilityBlocks, setAvailabilityBlocks] = useState([]);

  // Form state for creating new availability
  const [formData, setFormData] = useState({
    workDate: "",
    startTime: "08:00",
    endTime: "12:00",
  });

  // Filter state
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("Please login to access this page");
      navigate("/login");
      return;
    }

    if (!isDoctor()) {
      setError("Access denied. Only doctors can access this page.");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    const id = getDoctorId();
    console.log("✅ Doctor ID from token:", id);

    if (!id) {
      setError("Doctor profile not found. Please contact support.");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    setDoctorId(id);
  }, [navigate]);

  // Fetch availability blocks when doctorId is set
  useEffect(() => {
    if (doctorId) {
      fetchAvailabilityBlocks();
    }
  }, [doctorId]);

  const fetchAvailabilityBlocks = async (date = null) => {
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
      console.log("✅ Availability blocks response:", response.data);

      const blocks = response.data?.data || response.data || [];
      setAvailabilityBlocks(Array.isArray(blocks) ? blocks : []);
    } catch (err) {
      console.error("❌ Error fetching availability:", err);
      console.error("❌ Error response:", err.response);

      // Handle permission error
      if (err.response?.status === 403 || err.response?.status === 400) {
        setError("Access denied. Only doctors can access this page.");
        setTimeout(() => navigate("/"), 2000);
      } else if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.status === 404) {
        // Doctor not found - might need to use different endpoint
        console.error("🔍 Doctor not found. Trying alternative endpoint...");

        // Try alternative endpoint: /availability/my or /me/availability
        try {
          const altResponse = await api.get("/doctors/me/availability");
          console.log("✅ Alternative endpoint worked:", altResponse.data);
          const blocks = altResponse.data?.data || altResponse.data || [];
          setAvailabilityBlocks(Array.isArray(blocks) ? blocks : []);
          setError("");
        } catch (altErr) {
          console.error("❌ Alternative endpoint also failed:", altErr);
          setError(
            "Could not load availability blocks. Your doctor profile may not be set up yet."
          );
        }
      } else {
        setError(
          err.response?.data?.message || "Failed to load availability blocks"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateAvailability = async (e) => {
    e.preventDefault();

    if (!formData.workDate || !formData.startTime || !formData.endTime) {
      setError("Please fill in all fields");
      return;
    }

    // Validate time range
    if (formData.startTime >= formData.endTime) {
      setError("Start time must be before end time");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      console.log("📝 Creating availability for doctor:", doctorId);

      let response;
      try {
        response = await api.post(
          `/doctors/${doctorId}/availability`,
          formData
        );
      } catch (err) {
        if (err.response?.status === 404) {
          // Try alternative endpoint
          console.log("🔄 Trying alternative create endpoint...");
          response = await api.post("/doctors/me/availability", formData);
        } else {
          throw err;
        }
      }

      console.log("✅ Create availability response:", response.data);

      setSuccess(
        "Availability block created successfully! Time slots generated automatically."
      );

      // Reset form
      setFormData({
        workDate: "",
        startTime: "08:00",
        endTime: "12:00",
      });

      // Refresh availability blocks
      fetchAvailabilityBlocks(filterDate);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error creating availability:", err);

      // Handle permission error
      if (err.response?.status === 403 || err.response?.status === 400) {
        setError("Access denied. Only doctors can create availability blocks.");
      } else if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(
          err.response?.data?.message || "Failed to create availability block"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvailability = async (blockId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this availability block? All associated time slots will be deleted."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      console.log(
        `🗑️ Deleting availability block ${blockId} for doctor ${doctorId}`
      );

      try {
        await api.delete(`/doctors/${doctorId}/availability/${blockId}`);
      } catch (err) {
        if (err.response?.status === 404) {
          // Try alternative endpoint
          console.log("🔄 Trying alternative delete endpoint...");
          await api.delete(`/doctors/me/availability/${blockId}`);
        } else {
          throw err;
        }
      }

      setSuccess("Availability block deleted successfully");

      // Refresh availability blocks
      fetchAvailabilityBlocks(filterDate);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error deleting availability:", err);

      // Handle permission error
      if (err.response?.status === 403 || err.response?.status === 400) {
        setError(
          "Access denied. You can only delete your own availability blocks."
        );
      } else if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.status === 409) {
        setError(
          "Cannot delete availability block. Some time slots may already be booked."
        );
      } else {
        setError(
          err.response?.data?.message || "Failed to delete availability block"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByDate = () => {
    if (!filterDate) {
      setError("Please select a date to filter");
      return;
    }
    fetchAvailabilityBlocks(filterDate);
  };

  const handleClearFilter = () => {
    setFilterDate("");
    fetchAvailabilityBlocks();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    // Convert HH:mm:ss to HH:mm AM/PM
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <>
      <Header />
      <div className="availability-page">
        <div className="availability-container">
          <div className="page-header">
            <h1>Manage Your Availability</h1>
            <p>Create and manage your working hours and time slots</p>
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

          <div className="content-grid">
            {/* Create Availability Form */}
            <div className="form-card">
              <h2>Create New Availability Block</h2>
              <form onSubmit={handleCreateAvailability}>
                <div className="form-group">
                  <label htmlFor="workDate">Work Date *</label>
                  <input
                    type="date"
                    id="workDate"
                    name="workDate"
                    value={formData.workDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startTime">Start Time *</label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endTime">End Time *</label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="info-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 16V12M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p>
                    Time slots will be automatically generated in 30-minute
                    intervals
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || !doctorId}
                >
                  {loading ? "Creating..." : "Create Availability Block"}
                </button>
              </form>
            </div>

            {/* Availability Blocks List */}
            <div className="list-card">
              <div className="list-header">
                <h2>Your Availability Blocks</h2>

                <div className="filter-section">
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    placeholder="Filter by date"
                  />
                  <button
                    onClick={handleFilterByDate}
                    className="btn-secondary"
                    disabled={loading || !filterDate}
                  >
                    Filter
                  </button>
                  {filterDate && (
                    <button
                      onClick={handleClearFilter}
                      className="btn-text"
                      disabled={loading}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {loading && (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading availability blocks...</p>
                </div>
              )}

              {!loading && availabilityBlocks.length === 0 && (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                      stroke="#cbd5e1"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <h3>No availability blocks yet</h3>
                  <p>
                    Create your first availability block to start accepting
                    appointments
                  </p>
                </div>
              )}

              {!loading && availabilityBlocks.length > 0 && (
                <div className="blocks-list">
                  {availabilityBlocks.map((block) => (
                    <div key={block.id} className="block-item">
                      <div className="block-info">
                        <div className="block-date">
                          <svg
                            width="20"
                            height="20"
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
                          <span>{formatDate(block.workDate)}</span>
                        </div>
                        <div className="block-time">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M12 7V12L15 15"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>
                            {formatTime(block.startTime)} -{" "}
                            {formatTime(block.endTime)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAvailability(block.id)}
                        className="btn-delete"
                        disabled={loading}
                        title="Delete availability block"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97M18.85 9.14L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5H13.66M9.5 12.5H14.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorAvailability;
