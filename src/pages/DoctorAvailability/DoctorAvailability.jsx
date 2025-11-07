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
      alert("Vui lòng đăng nhập để truy cập trang này");
      navigate("/login");
      return;
    }

    if (!isDoctor()) {
      setError("Truy cập bị từ chối. Chỉ bác sĩ mới có thể truy cập trang này.");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    const id = getDoctorId();
    console.log("✅ Doctor ID from token:", id);

    if (!id) {
      setError("Không tìm thấy hồ sơ bác sĩ. Vui lòng liên hệ hỗ trợ.");
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
        setError("Truy cập bị từ chối. Chỉ bác sĩ mới có thể truy cập trang này.");
        setTimeout(() => navigate("/"), 2000);
      } else if (err.response?.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
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
            "Không thể tải khối thời gian có sẵn. Hồ sơ bác sĩ của bạn có thể chưa được thiết lập."
          );
        }
      } else {
        setError(
          err.response?.data?.message || "Không thể tải khối thời gian có sẵn"
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
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Validate time range
    if (formData.startTime >= formData.endTime) {
      setError("Thời gian bắt đầu phải trước thời gian kết thúc");
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
        "Khối thời gian có sẵn đã được tạo thành công! Các khung giờ sẽ được tạo tự động."
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
        setError("Truy cập bị từ chối. Chỉ bác sĩ mới có thể tạo khối thời gian có sẵn.");
      } else if (err.response?.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(
          err.response?.data?.message || "Không thể tạo khối thời gian có sẵn"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvailability = async (blockId) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa khối thời gian có sẵn này? Tất cả các khung giờ liên quan sẽ bị xóa."
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

      setSuccess("Khối thời gian có sẵn đã được xóa thành công");

      // Refresh availability blocks
      fetchAvailabilityBlocks(filterDate);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error deleting availability:", err);

      // Handle permission error
      if (err.response?.status === 403 || err.response?.status === 400) {
        setError(
          "Truy cập bị từ chối. Bạn chỉ có thể xóa khối thời gian có sẵn của mình."
        );
      } else if (err.response?.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.status === 409) {
        setError(
          "Không thể xóa khối thời gian có sẵn. Một số khung giờ có thể đã được đặt."
        );
      } else {
        setError(
          err.response?.data?.message || "Không thể xóa khối thời gian có sẵn"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByDate = () => {
    if (!filterDate) {
      setError("Vui lòng chọn ngày để lọc");
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
            <h1>Quản lý lịch trình của bạn</h1>
            <p>Tạo và quản lý giờ làm việc và khung giờ của bạn</p>
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
              <h2>Tạo khối thời gian có sẵn mới</h2>
              <form onSubmit={handleCreateAvailability}>
                <div className="form-group">
                  <label htmlFor="workDate">Ngày làm việc *</label>
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
                    <label htmlFor="startTime">Thời gian bắt đầu *</label>
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
                    <label htmlFor="endTime">Thời gian kết thúc *</label>
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

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || !doctorId}
                >
                  {loading ? "Đang tạo..." : "Tạo khối thời gian có sẵn"}
                </button>
              </form>
            </div>

            {/* Availability Blocks List */}
            <div className="list-card">
              <div className="list-header">
                <h2>Khối thời gian có sẵn của bạn</h2>

                <div className="filter-section">
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    placeholder="Lọc theo ngày"
                  />
                  <button
                    onClick={handleFilterByDate}
                    className="btn-secondary"
                    disabled={loading || !filterDate}
                  >
                    Lọc
                  </button>
                  {filterDate && (
                    <button
                      onClick={handleClearFilter}
                      className="btn-text"
                      disabled={loading}
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>

              {loading && (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Đang tải khối thời gian có sẵn...</p>
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
                  <h3>Chưa có khối thời gian nào</h3>
                  <p>
                    Tạo khối thời gian có sẵn đầu tiên để bắt đầu nhận lịch hẹn
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
                        title="Xóa khối thời gian có sẵn"
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
