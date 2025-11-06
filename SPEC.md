# SPECIFICATION - HỆ THỐNG ĐẶT LỊCH KHÁM BỆNH TRỰC TUYẾN

## TỔNG QUAN DỰ ÁN

**Tên dự án:** Online Doctor Appointment System  
**Mục tiêu:** Xây dựng hệ thống đặt lịch khám bệnh trực tuyến cho phép bệnh nhân tìm kiếm và đặt lịch với bác sĩ một cách dễ dàng.

**Công nghệ sử dụng:**
- **Backend:** Spring Boot (Java), Spring Security, JWT Authentication
- **Frontend:** React.js, React Router, Vite
- **Database:** MySQL/PostgreSQL (JPA/Hibernate)
- **API:** RESTful API

---

## SPRINT 1: TÌM KIẾM BÁC SĨ (FINDING DOCTOR)

### 🎯 MỤC TIÊU SPRINT 1
Xây dựng chức năng tìm kiếm bác sĩ với các bộ lọc và hiển thị thông tin chi tiết bác sĩ.

### 📋 DANH SÁCH CHỨC NĂNG

#### US 5: Finding Doctor
**Mô tả:** Bệnh nhân có thể tìm kiếm bác sĩ theo chuyên khoa, tên bác sĩ và ngày khám.

**Acceptance Criteria:**
1. **Trang tìm kiếm bác sĩ (`/find-a-doctor`)**
   - Hiển thị form tìm kiếm với các trường:
     - Chuyên khoa (dropdown, bắt buộc)
     - Tên bác sĩ (text input, tùy chọn)
     - Ngày khám (date picker cho 7 ngày tiếp theo, bắt buộc)
   - Nút "Search Doctors" và "Reset"
   - Hiển thị loading state khi đang tìm kiếm

2. **Hiển thị kết quả tìm kiếm**
   - Grid layout hiển thị danh sách bác sĩ
   - Mỗi card bác sĩ bao gồm:
     - Avatar (tự động tạo từ tên)
     - Tên bác sĩ và bằng cấp
     - Chuyên khoa
     - Đánh giá (sao và điểm số)
     - Mô tả ngắn (bio)
     - Nút "View Details"
   - Hiển thị số lượng kết quả tìm thấy
   - Xử lý trường hợp không tìm thấy bác sĩ

3. **Tích hợp API Backend**
   - `GET /api/specialties` - Lấy danh sách chuyên khoa
   - `GET /api/doctors` - Lấy tất cả bác sĩ (hiển thị ban đầu)
   - `GET /api/doctors/search?specialtyId={id}&doctorName={name}&date={date}` - Tìm kiếm bác sĩ

**Technical Requirements:**
- Responsive design cho mobile và desktop
- Error handling cho API calls
- Loading states và empty states
- Form validation
- URL state management

### 🛠️ BACKEND IMPLEMENTATION

#### 1. Entity Models
```java
// User.java - Quản lý tài khoản
@Entity
public class User {
    private Long id;
    private String email;
    private String passwordHash;
    private UserRole role; // PATIENT, DOCTOR, ADMIN
    private LocalDateTime createdAt;
}

// Doctor.java - Thông tin bác sĩ
@Entity
public class Doctor {
    private Long id;
    private Long userId;
    private String fullName;
    private String degree;
    private String bio;
    private Double averageRating;
    private List<Specialty> specialties;
}

// Specialty.java - Chuyên khoa
@Entity
public class Specialty {
    private Long id;
    private String name;
    private String description;
}
```

#### 2. API Endpoints
```java
// SpecialtyController.java
@GetMapping("/api/specialties")
public ResponseEntity<List<SpecialtyDTO>> getAllSpecialties()

// DoctorController.java
@GetMapping("/api/doctors")
public ResponseEntity<List<DoctorDTO>> getAllDoctors()

@GetMapping("/api/doctors/search")
public ResponseEntity<List<DoctorSearchDTO>> searchDoctors(
    @RequestParam(required = false) Long specialtyId,
    @RequestParam(required = false) String doctorName,
    @RequestParam(required = false) String date
)
```

#### 3. Business Logic
- **DoctorService.searchDoctors():**
  - Tìm kiếm theo chuyên khoa (nếu có)
  - Tìm kiếm theo tên bác sĩ (case-insensitive, partial match)
  - Lọc theo ngày có lịch làm việc
  - Chỉ trả về bác sĩ có time slots AVAILABLE
  - Sắp xếp theo rating giảm dần

### 🎨 FRONTEND IMPLEMENTATION

#### 1. Components Structure
```
src/pages/FindADoctor/
├── FindADoctor.jsx          # Main component
├── FindADoctor.css          # Styles
└── components/
    ├── SearchForm.jsx       # Form tìm kiếm
    ├── DoctorCard.jsx       # Card hiển thị bác sĩ
    └── SearchResults.jsx    # Kết quả tìm kiếm
```

#### 2. State Management
```javascript
const [selectedSpecialty, setSelectedSpecialty] = useState("");
const [selectedName, setSelectedName] = useState("");
const [selectedDate, setSelectedDate] = useState("");
const [doctors, setDoctors] = useState([]);
const [searchResults, setSearchResults] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
```

#### 3. Key Features
- Date picker hiển thị 7 ngày tiếp theo
- Real-time form validation
- Debounced search cho tên bác sĩ
- Responsive grid layout
- Error boundaries

### 📱 UI/UX DESIGN

#### 1. Search Form
- Clean, modern design với card layout
- Dropdown chuyên khoa với search functionality
- Date picker dạng button grid (7 ngày)
- Visual feedback cho validation errors

#### 2. Doctor Cards
- Card-based layout với hover effects
- Avatar placeholder với gradient background
- Star rating component
- Truncated bio với "Read more" option
- Call-to-action button prominent

#### 3. States Handling
- Loading skeleton cho cards
- Empty state với illustration
- Error state với retry button
- Success state với result count

### ✅ DEFINITION OF DONE - SPRINT 1

1. **Functional Requirements:**
   - [ ] Trang tìm kiếm bác sĩ hoạt động đầy đủ
   - [ ] Tìm kiếm theo chuyên khoa, tên, ngày
   - [ ] Hiển thị kết quả tìm kiếm chính xác
   - [ ] Navigation đến trang chi tiết bác sĩ

2. **Technical Requirements:**
   - [ ] API endpoints hoạt động ổn định
   - [ ] Error handling đầy đủ
   - [ ] Responsive design
   - [ ] Performance optimization

3. **Testing:**
   - [ ] Unit tests cho services
   - [ ] Integration tests cho API
   - [ ] E2E tests cho user flow
   - [ ] Cross-browser testing

---

## SPRINT 2: ĐẶT LỊCH KHÁM (MAKE APPOINTMENT)

### 🎯 MỤC TIÊU SPRINT 2
Xây dựng chức năng đặt lịch khám bệnh và quản lý lịch làm việc của bác sĩ.

### 📋 DANH SÁCH CHỨC NĂNG

#### US 5: Finding Doctor (Cont.) - Chi tiết bác sĩ
**Mô tả:** Hiển thị thông tin chi tiết bác sĩ và các khung giờ có sẵn.

**Acceptance Criteria:**
1. **Trang chi tiết bác sĩ (`/doctor/:id`)**
   - Thông tin bác sĩ đầy đủ (tên, bằng cấp, chuyên khoa, bio, rating)
   - Hiển thị lịch làm việc trong 7 ngày tiếp theo
   - Calendar view với time slots available
   - Nút "Book Appointment" cho mỗi time slot

2. **Time Slots Management**
   - Hiển thị time slots theo ngày
   - Phân biệt trạng thái: AVAILABLE, BOOKED
   - Real-time update khi slot được đặt
   - Responsive calendar layout

#### US 4: Make an Appointment
**Mô tả:** Bệnh nhân có thể đặt lịch khám với bác sĩ.

**Acceptance Criteria:**
1. **Quy trình đặt lịch**
   - Click vào time slot available → Mở form đặt lịch
   - Form bao gồm:
     - Thông tin bác sĩ (read-only)
     - Thông tin time slot đã chọn (read-only)
     - Lý do khám (textarea, bắt buộc)
     - Triệu chứng (textarea, tùy chọn)
   - Xác nhận đặt lịch

2. **Validation và Security**
   - Chỉ PATIENT mới được đặt lịch
   - Kiểm tra time slot vẫn available
   - Validate thông tin đầu vào
   - JWT authentication required

3. **Confirmation và Feedback**
   - Hiển thị thông báo thành công
   - Gửi email xác nhận (future enhancement)
   - Redirect đến trang appointments của user

### 🛠️ BACKEND IMPLEMENTATION

#### 1. Enhanced Entity Models
```java
// AvailabilityBlock.java - Khung giờ làm việc lớn
@Entity
public class AvailabilityBlock {
    private Long id;
    private Long doctorId;
    private LocalDate workDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private List<TimeSlot> timeSlots;
}

// TimeSlot.java - Slot 30 phút
@Entity
public class TimeSlot {
    private Long id;
    private Long availabilityBlockId;
    private Long doctorId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private TimeSlotStatus status; // AVAILABLE, BOOKED
}

// Appointment.java - Lịch hẹn
@Entity
public class Appointment {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private Long timeSlotId;
    private String symptoms;
    private String suspectedDisease;
    private AppointmentStatus status; // PENDING, COMPLETED, CANCELED
}
```

#### 2. API Endpoints
```java
// DoctorController.java
@GetMapping("/api/doctors/{doctorId}/detail")
public ResponseEntity<DoctorDetailDTO> getDoctorDetail(
    @PathVariable Long doctorId,
    @RequestParam(required = false) String startDate,
    @RequestParam(required = false) String endDate
)

// AvailabilityBlockController.java (Doctor only)
@PostMapping("/api/doctors/{doctorId}/availability")
public ResponseEntity<AvailabilityBlockDTO> createAvailabilityBlock(
    @PathVariable Long doctorId,
    @RequestBody AvailabilityBlockRequest request
)

@GetMapping("/api/doctors/{doctorId}/availability")
public ResponseEntity<List<AvailabilityBlockDTO>> getAvailabilityBlocks(
    @PathVariable Long doctorId,
    @RequestParam(required = false) String date
)

// AppointmentController.java
@PostMapping("/api/appointments")
public ResponseEntity<AppointmentResponse> createAppointment(
    @RequestBody AppointmentRequest request
)
```

#### 3. Business Logic
- **AvailabilityBlockService:**
  - Tự động tạo time slots 30 phút từ availability block
  - Validate thời gian không trùng lặp
  - Chỉ DOCTOR mới được tạo availability

- **AppointmentService:**
  - Validate time slot available
  - Atomic transaction: tạo appointment + update slot status
  - Send confirmation (email/SMS - future)

### 🎨 FRONTEND IMPLEMENTATION

#### 1. Doctor Detail Page
```javascript
// DoctorDetail.jsx
const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // Fetch doctor details and available slots
  // Handle slot selection and booking
};
```

#### 2. Booking Flow Components
```
src/pages/DoctorDetail/
├── DoctorDetail.jsx
├── DoctorDetail.css
└── components/
    ├── DoctorInfo.jsx          # Thông tin bác sĩ
    ├── TimeSlotCalendar.jsx    # Calendar view
    ├── TimeSlotGrid.jsx        # Grid view slots
    ├── BookingModal.jsx        # Form đặt lịch
    └── ConfirmationModal.jsx   # Xác nhận đặt lịch
```

#### 3. State Management
```javascript
// Booking state
const [bookingData, setBookingData] = useState({
  doctorId: null,
  timeSlotId: null,
  symptoms: "",
  reason: ""
});

// UI state
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
```

### 📱 UI/UX DESIGN

#### 1. Doctor Detail Layout
- Hero section với thông tin bác sĩ
- Tabs: Overview, Available Times, Reviews
- Sticky booking button
- Mobile-first responsive design

#### 2. Time Slot Selection
- Calendar view cho desktop
- List view cho mobile
- Color-coded slots (available/booked/past)
- Time zone display
- Quick date navigation

#### 3. Booking Modal
- Step-by-step wizard
- Progress indicator
- Form validation feedback
- Confirmation summary
- Loading states

### 🔐 SECURITY & VALIDATION

#### 1. Authentication
- JWT token validation
- Role-based access control
- Session management
- CORS configuration

#### 2. Input Validation
- Server-side validation
- XSS protection
- SQL injection prevention
- Rate limiting

#### 3. Business Rules
- Time slot availability check
- Double booking prevention
- Appointment time constraints
- User permission validation

### ✅ DEFINITION OF DONE - SPRINT 2

1. **Functional Requirements:**
   - [ ] Trang chi tiết bác sĩ hoạt động
   - [ ] Hiển thị time slots chính xác
   - [ ] Đặt lịch thành công
   - [ ] Validation đầy đủ

2. **Technical Requirements:**
   - [ ] API security implemented
   - [ ] Database transactions
   - [ ] Error handling robust
   - [ ] Performance optimized

3. **User Experience:**
   - [ ] Intuitive booking flow
   - [ ] Clear feedback messages
   - [ ] Mobile responsive
   - [ ] Accessibility compliant

---

## SPRINT 3: QUẢN LÝ LỊCH HẸN (APPOINTMENT MANAGEMENT)

### 🎯 MỤC TIÊU SPRINT 3
Xây dựng chức năng xem, hủy, thay đổi lịch hẹn và xem thông tin bệnh nhân.

### 📋 DANH SÁCH CHỨC NĂNG

#### US 3: View Doctor's Schedule
**Mô tả:** Bác sĩ có thể xem lịch làm việc và các cuộc hẹn của mình.

**Acceptance Criteria:**
1. **Dashboard bác sĩ (`/doctor/dashboard`)**
   - Overview: Tổng số appointments hôm nay, tuần này
   - Calendar view với appointments
   - List view chi tiết appointments
   - Filter theo ngày, trạng thái

2. **Quản lý availability (`/doctor/my-availability`)**
   - Tạo availability blocks mới
   - Xem danh sách availability blocks
   - Xóa/chỉnh sửa availability blocks
   - Partial delete functionality

3. **Chi tiết appointment**
   - Thông tin bệnh nhân
   - Lý do khám, triệu chứng
   - Thời gian hẹn
   - Actions: Complete, Cancel, Reschedule

#### US 10: Canceling or Changing Appointment
**Mô tả:** Bệnh nhân và bác sĩ có thể hủy hoặc thay đổi lịch hẹn.

**Acceptance Criteria:**
1. **Hủy lịch hẹn**
   - Chỉ hủy được appointments có status PENDING
   - Confirmation dialog
   - Lý do hủy (optional)
   - Update time slot status về AVAILABLE
   - Notification cho bên kia

2. **Thay đổi lịch hẹn**
   - Reschedule limit (tối đa 2 lần)
   - Chọn time slot mới
   - Confirmation từ bác sĩ (future enhancement)
   - Update database atomically

3. **Business Rules**
   - Không thể hủy/đổi trong vòng 2 giờ trước hẹn
   - Chỉ patient hoặc doctor của appointment mới được thao tác
   - Ghi log mọi thay đổi

#### US 2: View Information of Patient
**Mô tả:** Bác sĩ có thể xem thông tin chi tiết bệnh nhân.

**Acceptance Criteria:**
1. **Thông tin bệnh nhân**
   - Thông tin cá nhân (tên, tuổi, giới tính, SĐT)
   - Lịch sử khám bệnh
   - Appointments trước đó với bác sĩ này
   - Medical notes (future enhancement)

2. **Privacy & Security**
   - Chỉ bác sĩ được xem thông tin bệnh nhân của appointments mình
   - Audit log cho việc truy cập thông tin
   - GDPR compliance considerations

### 🛠️ BACKEND IMPLEMENTATION

#### 1. Enhanced Entity Models
```java
// Patient.java - Thông tin bệnh nhân
@Entity
public class Patient {
    private Long id;
    private Long userId;
    private String fullName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String phoneNumber;
    private List<Appointment> appointments;
}

// AppointmentHistory.java - Lịch sử thay đổi
@Entity
public class AppointmentHistory {
    private Long id;
    private Long appointmentId;
    private String action; // CREATED, RESCHEDULED, CANCELLED, COMPLETED
    private String reason;
    private LocalDateTime timestamp;
    private Long performedBy;
}
```

#### 2. API Endpoints
```java
// AppointmentController.java
@GetMapping("/api/appointments/my-appointments")
public ResponseEntity<List<AppointmentResponse>> getMyAppointments(
    @RequestParam(required = false) String status,
    @RequestParam(required = false) String startDate,
    @RequestParam(required = false) String endDate
)

@PutMapping("/api/appointments/{appointmentId}/cancel")
public ResponseEntity<String> cancelAppointment(
    @PathVariable Long appointmentId,
    @RequestBody(required = false) CancelRequest request
)

@PutMapping("/api/appointments/{appointmentId}/reschedule")
public ResponseEntity<AppointmentResponse> rescheduleAppointment(
    @PathVariable Long appointmentId,
    @RequestBody RescheduleRequest request
)

@PutMapping("/api/appointments/{appointmentId}/complete")
public ResponseEntity<String> completeAppointment(
    @PathVariable Long appointmentId
)

// PatientController.java (Doctor only)
@GetMapping("/api/patients/{patientId}/profile")
public ResponseEntity<PatientProfileDTO> getPatientProfile(
    @PathVariable Long patientId
)

@GetMapping("/api/patients/{patientId}/appointment-history")
public ResponseEntity<List<AppointmentResponse>> getPatientAppointmentHistory(
    @PathVariable Long patientId
)
```

#### 3. Business Logic
- **AppointmentService:**
  - validateCancellation(): Check time constraints
  - validateReschedule(): Check reschedule count, availability
  - atomicReschedule(): Update appointment + time slots
  - createAppointmentHistory(): Log all changes

- **PatientService:**
  - getPatientProfile(): With privacy checks
  - getAppointmentHistory(): Filter by doctor access

### 🎨 FRONTEND IMPLEMENTATION

#### 1. Patient Dashboard
```javascript
// PatientDashboard.jsx
const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled
  
  // Fetch and display appointments
  // Handle cancel/reschedule actions
};
```

#### 2. Doctor Dashboard
```javascript
// DoctorDashboard.jsx
const DoctorDashboard = () => {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Dashboard overview and management
};
```

#### 3. Components Structure
```
src/pages/Dashboard/
├── PatientDashboard/
│   ├── PatientDashboard.jsx
│   ├── AppointmentCard.jsx
│   ├── CancelModal.jsx
│   └── RescheduleModal.jsx
├── DoctorDashboard/
│   ├── DoctorDashboard.jsx
│   ├── AppointmentList.jsx
│   ├── PatientModal.jsx
│   └── StatsOverview.jsx
└── shared/
    ├── Calendar.jsx
    ├── TimeSlotPicker.jsx
    └── ConfirmationDialog.jsx
```

### 📱 UI/UX DESIGN

#### 1. Dashboard Layout
- Sidebar navigation
- Main content area với tabs
- Quick actions toolbar
- Statistics cards
- Calendar integration

#### 2. Appointment Management
- Card-based appointment list
- Status badges (Pending, Confirmed, Completed, Cancelled)
- Quick actions (Cancel, Reschedule, Complete)
- Filtering và sorting options
- Bulk actions (future enhancement)

#### 3. Modal Dialogs
- Cancel appointment: Reason input, confirmation
- Reschedule: Time slot picker, confirmation
- Patient info: Tabbed layout với history
- Responsive modal design

### 🔔 NOTIFICATIONS & ALERTS

#### 1. In-App Notifications
- Toast messages cho actions
- Badge notifications cho new appointments
- Real-time updates (WebSocket - future)

#### 2. Email Notifications (Future Enhancement)
- Appointment confirmation
- Reminder 24h trước
- Cancellation/reschedule notifications
- Doctor availability updates

### 📊 ANALYTICS & REPORTING

#### 1. Doctor Analytics
- Appointment statistics
- Patient demographics
- Revenue tracking (future)
- Performance metrics

#### 2. System Analytics
- Usage statistics
- Popular specialties
- Peak booking times
- User engagement metrics

### ✅ DEFINITION OF DONE - SPRINT 3

1. **Functional Requirements:**
   - [ ] Dashboard cho patient và doctor
   - [ ] Cancel/reschedule appointments
   - [ ] View patient information
   - [ ] Manage doctor availability

2. **Technical Requirements:**
   - [ ] Real-time data updates
   - [ ] Audit logging
   - [ ] Performance optimization
   - [ ] Security compliance

3. **User Experience:**
   - [ ] Intuitive dashboard design
   - [ ] Clear action feedback
   - [ ] Mobile responsive
   - [ ] Accessibility features

---

## 🚀 DEPLOYMENT & INFRASTRUCTURE

### Development Environment
- **Backend:** Spring Boot với embedded Tomcat
- **Frontend:** Vite dev server
- **Database:** H2 (development), PostgreSQL (production)
- **Authentication:** JWT với 24h expiration

### Production Deployment
- **Backend:** Docker container trên AWS ECS/Azure Container Instances
- **Frontend:** Static hosting trên Netlify/Vercel
- **Database:** AWS RDS/Azure Database
- **CDN:** CloudFront/Azure CDN cho static assets

### CI/CD Pipeline
- **Source Control:** Git với feature branch workflow
- **Build:** GitHub Actions/Azure DevOps
- **Testing:** Automated unit, integration, e2e tests
- **Deployment:** Blue-green deployment strategy

---

## 📈 FUTURE ENHANCEMENTS

### Phase 2 Features
- Video consultation integration
- Payment processing
- Medical records management
- Prescription management
- Multi-language support

### Phase 3 Features
- Mobile app (React Native)
- AI-powered symptom checker
- Telemedicine platform
- Integration với hospital systems
- Advanced analytics dashboard

---

## 📋 TESTING STRATEGY

### Unit Testing
- Backend: JUnit 5, Mockito
- Frontend: Jest, React Testing Library
- Coverage target: 80%+

### Integration Testing
- API testing với TestContainers
- Database integration tests
- Authentication flow tests

### E2E Testing
- Playwright/Cypress
- Critical user journeys
- Cross-browser testing
- Mobile responsive testing

### Performance Testing
- Load testing với JMeter
- API response time < 200ms
- Frontend bundle size optimization
- Database query optimization

---

**Tài liệu này sẽ được cập nhật thường xuyên trong quá trình phát triển để phản ánh các thay đổi và cải tiến.**
