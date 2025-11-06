# SOFTWARE REQUIREMENTS SPECIFICATION
## HỆ THỐNG ĐẶT LỊCH KHÁM BỆNH TRỰC TUYẾN
### (Online Doctor Appointment System)

---

**Phiên bản:** 1.0  
**Ngày:** 06/11/2025  
**Người soạn:** Development Team  
**Trạng thái:** Draft  

---

## MỤC LỤC

1. [GIỚI THIỆU](#1-giới-thiệu)
2. [MÔ TẢ TỔNG QUAN](#2-mô-tả-tổng-quan)
3. [YÊU CẦU CHỨC NĂNG](#3-yêu-cầu-chức-năng)
4. [YÊU CẦU PHI CHỨC NĂNG](#4-yêu-cầu-phi-chức-năng)
5. [YÊU CẦU GIAO DIỆN](#5-yêu-cầu-giao-diện)
6. [YÊU CẦU HỆ THỐNG](#6-yêu-cầu-hệ-thống)
7. [YÊU CẦU BẢO MẬT](#7-yêu-cầu-bảo-mật)
8. [KẾ HOẠCH PHÁT TRIỂN](#8-kế-hoạch-phát-triển)

---

## 1. GIỚI THIỆU

### 1.1 Mục đích tài liệu
Tài liệu này mô tả các yêu cầu phần mềm cho Hệ thống Đặt lịch Khám bệnh Trực tuyến (Online Doctor Appointment System). Tài liệu này được sử dụng làm cơ sở cho việc thiết kế, phát triển và kiểm thử hệ thống.

### 1.2 Phạm vi dự án
Hệ thống cho phép bệnh nhân tìm kiếm bác sĩ theo chuyên khoa, xem thông tin chi tiết và đặt lịch khám trực tuyến. Bác sĩ có thể quản lý lịch làm việc, xem thông tin bệnh nhân và quản lý các cuộc hẹn.

### 1.3 Đối tượng sử dụng
- **Bệnh nhân (Patient):** Người cần đặt lịch khám bệnh
- **Bác sĩ (Doctor):** Người cung cấp dịch vụ khám chữa bệnh
- **Quản trị viên (Admin):** Người quản lý hệ thống

### 1.4 Định nghĩa và thuật ngữ
- **Appointment:** Lịch hẹn khám bệnh
- **Time Slot:** Khung giờ 30 phút có thể đặt lịch
- **Availability Block:** Khung giờ làm việc lớn của bác sĩ
- **Specialty:** Chuyên khoa y tế
- **JWT:** JSON Web Token - phương thức xác thực

---

## 2. MÔ TẢ TỔNG QUAN

### 2.1 Tổng quan sản phẩm
Hệ thống Đặt lịch Khám bệnh Trực tuyến là một ứng dụng web cho phép kết nối bệnh nhân và bác sĩ thông qua việc đặt lịch hẹn trực tuyến. Hệ thống giúp tối ưu hóa quy trình đặt lịch, giảm thời gian chờ đợi và nâng cao trải nghiệm người dùng.

### 2.2 Chức năng chính
- Tìm kiếm và lọc bác sĩ theo chuyên khoa
- Xem thông tin chi tiết bác sĩ và lịch trình
- Đặt lịch hẹn trực tuyến
- Quản lý lịch hẹn (xem, hủy, thay đổi)
- Quản lý lịch làm việc của bác sĩ
- Xem thông tin bệnh nhân

### 2.3 Đặc điểm người dùng
- **Bệnh nhân:** Độ tuổi từ 18-70, có kiến thức cơ bản về internet
- **Bác sĩ:** Chuyên gia y tế, quen thuộc với công nghệ
- **Quản trị viên:** Có kiến thức kỹ thuật về hệ thống

### 2.4 Ràng buộc
- Hệ thống phải tuân thủ quy định về bảo mật thông tin y tế
- Giao diện phải thân thiện và dễ sử dụng
- Hỗ trợ đa thiết bị (desktop, tablet, mobile)
- Thời gian phản hồi API < 2 giây

---

## 3. YÊU CẦU CHỨC NĂNG

### 3.1 SPRINT 1: ĐĂNG NHẬP VÀ TÌM KIẾM BÁC SĨ (2 tuần)

**Mục tiêu Sprint:** Xây dựng hệ thống authentication và chức năng tìm kiếm bác sĩ cơ bản.

#### 3.1.1 US1: Đăng ký/Đăng nhập (Login/Register)

**Mô tả:** Người dùng có thể tạo tài khoản mới hoặc đăng nhập vào hệ thống.

**Priority:** Critical (P0)  
**Story Points:** 8  
**Estimated Time:** 3-4 ngày

##### Backend Tasks:

**Task 1.1: Database Schema Setup**
- Tạo bảng `users` với các trường:
  - id (Primary Key, Auto Increment)
  - email (VARCHAR, UNIQUE, NOT NULL)
  - password_hash (VARCHAR, NOT NULL)
  - role (ENUM: PATIENT, DOCTOR, ADMIN)
  - created_at, updated_at (TIMESTAMP)
- Tạo bảng `patients` liên kết 1:1 với users:
  - id, user_id (Foreign Key)
  - full_name, date_of_birth, gender, phone_number
- Setup indexes cho email và phone_number
- Migration scripts và rollback

**Task 1.2: Authentication Service Implementation**
- Implement `AuthService` class với methods:
  - `register(RegisterRequest)`: Đăng ký user mới
  - `login(LoginRequest)`: Xác thực và tạo token
  - `validateToken(String token)`: Validate JWT token
  - `refreshToken(String token)`: Refresh expired token
- Password hashing với BCrypt (strength = 12)
- Email validation (format và uniqueness check)
- Phone number validation (format VN hoặc international)

**Task 1.3: JWT Token Management**
- Implement `JwtUtil` class:
  - Generate access token (24h expiration)
  - Generate refresh token (7 days expiration)
  - Parse và validate token
  - Extract user info từ token
- Configure secret key và signing algorithm (HS256)
- Token blacklist mechanism cho logout

**Task 1.4: API Endpoints**
- `POST /api/auth/register`:
  - Request body: email, password, fullName, dateOfBirth, gender, phoneNumber
  - Response: user info + JWT token
  - Status codes: 201 Created, 400 Bad Request, 409 Conflict
- `POST /api/auth/login`:
  - Request body: email, password
  - Response: user info + JWT token
  - Status codes: 200 OK, 401 Unauthorized
- `POST /api/auth/refresh`:
  - Request header: Refresh token
  - Response: New access token
- `POST /api/auth/logout`:
  - Invalidate current token

**Task 1.5: Security Configuration**
- Setup Spring Security configuration
- Configure CORS settings
- JWT authentication filter
- Exception handling cho authentication errors
- Rate limiting cho login attempts (5 attempts/15 minutes)

##### Frontend Tasks:

**Task 1.6: Authentication UI Components**
- Create `LoginPage.jsx`:
  - Email input với validation
  - Password input với show/hide toggle
  - "Remember me" checkbox
  - "Forgot password" link (placeholder)
  - Loading state khi submit
- Create `SignupPage.jsx`:
  - Multi-step form hoặc single page form
  - Email, password, confirm password
  - Full name, date of birth (date picker)
  - Gender selection (radio buttons)
  - Phone number với country code
  - Terms & conditions checkbox
  - Form validation real-time

**Task 1.7: Authentication Logic**
- Create `authService.js`:
  - API calls cho register/login
  - Token storage (localStorage hoặc sessionStorage)
  - Token refresh logic
  - Auto-logout khi token expires
- Create `useAuth` custom hook:
  - Current user state
  - Login/logout functions
  - Token validation
  - Role checking helpers

**Task 1.8: Protected Routes**
- Implement `ProtectedRoute` component
- Redirect to login nếu chưa authenticated
- Role-based route protection
- Redirect sau login theo role (patient → home, doctor → dashboard)

**Task 1.9: UI/UX Polish**
- Form validation messages
- Loading indicators
- Success/error toast notifications
- Smooth transitions
- Responsive design cho mobile
- Accessibility (ARIA labels, keyboard navigation)

##### Testing Tasks:

**Task 1.10: Backend Testing**
- Unit tests cho AuthService (JUnit + Mockito):
  - Test successful registration
  - Test duplicate email
  - Test invalid email format
  - Test password validation
  - Test successful login
  - Test invalid credentials
  - Test token generation/validation
- Integration tests cho API endpoints:
  - Test full registration flow
  - Test login flow
  - Test token refresh
  - Test concurrent login attempts

**Task 1.11: Frontend Testing**
- Component tests (Jest + React Testing Library):
  - Test form rendering
  - Test form validation
  - Test successful submission
  - Test error handling
- E2E tests (Cypress):
  - Complete registration flow
  - Complete login flow
  - Token persistence
  - Auto-logout

**Acceptance Criteria:**
- ✅ User có thể đăng ký tài khoản với thông tin hợp lệ
- ✅ Hệ thống reject email đã tồn tại
- ✅ Password được hash trước khi lưu database
- ✅ User có thể đăng nhập với credentials đúng
- ✅ JWT token được tạo và lưu trữ đúng cách
- ✅ Token tự động refresh trước khi expire
- ✅ User tự động logout khi token invalid
- ✅ Redirect đúng theo role sau login
- ✅ Form validation hiển thị lỗi rõ ràng
- ✅ Responsive và accessible trên mọi thiết bị

**Definition of Done:**
- [ ] Code reviewed và approved
- [ ] Unit tests passed (>80% coverage)
- [ ] Integration tests passed
- [ ] E2E tests passed
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] QA testing passed

---

#### 3.1.2 US5: Tìm kiếm bác sĩ (Finding Doctor)

**Mô tả:** Bệnh nhân có thể tìm kiếm bác sĩ theo chuyên khoa, tên và ngày khám.

**Priority:** Critical (P0)  
**Story Points:** 13  
**Estimated Time:** 5-6 ngày

##### Backend Tasks:

**Task 5.1: Database Schema**
- Tạo bảng `doctors`:
  - id, user_id, full_name, degree, bio, average_rating
  - Indexes: user_id (unique), average_rating
- Tạo bảng `specialties`:
  - id, name, description
  - Index: name (unique)
- Tạo bảng `doctor_specialties` (Many-to-Many):
  - doctor_id, specialty_id
  - Composite index: (doctor_id, specialty_id)
- Sample data seeding script

**Task 5.2: Specialty Service**
- Implement `SpecialtyService`:
  - `getAllSpecialties()`: Lấy tất cả specialties
  - `getSpecialtyById(Long id)`: Lấy specialty theo ID
  - `getSpecialtiesByDoctor(Long doctorId)`: Lấy specialties của doctor
- API endpoint:
  - `GET /api/specialties`: Public access, return list specialties
  - Response format: `[{id, name, description}]`
  - Caching (1 hour) vì data ít thay đổi

**Task 5.3: Doctor Search Service**
- Implement `DoctorService` với complex search logic:
  - `getAllDoctors()`: Lấy tất cả doctors (basic info)
  - `searchDoctors(SearchCriteria)`: Advanced search với filters:
    - Filter by specialtyId (required)
    - Filter by doctorName (optional, case-insensitive, partial match)
    - Filter by date (required) - doctors có availability trong ngày đó
    - Return doctors với available time slots count
  - Query optimization với JOIN và WHERE clauses
  - Pagination support (page, size, sort)

**Task 5.4: Search API Endpoints**
- `GET /api/doctors`:
  - Public access hoặc authenticated
  - Return: List of all doctors với basic info
  - Include: id, fullName, degree, specialties[], averageRating, bio
  - Pagination: ?page=0&size=20
- `GET /api/doctors/search`:
  - Query params: specialtyId, doctorName, date
  - Validation: specialtyId và date bắt buộc
  - Business logic:
    - Join với AvailabilityBlocks và TimeSlots
    - Filter TimeSlots có status = AVAILABLE
    - Filter theo ngày
    - Group by doctor và count available slots
    - Sort by averageRating DESC
  - Return: `[{doctorId, fullName, degree, specialty, bio, averageRating, availableSlotsCount}]`

**Task 5.5: Performance Optimization**
- Database indexing strategy:
  - Index on doctors.average_rating
  - Composite index on time_slots(doctor_id, work_date, status)
- Query optimization:
  - Use JOIN FETCH để avoid N+1 queries
  - Projection để chỉ lấy fields cần thiết
- Response caching cho popular searches (15 minutes TTL)
- Database query logging và monitoring

##### Frontend Tasks:

**Task 5.6: Search Page Layout**
- Create `FindADoctor.jsx` page:
  - Header section với title "Find A Doctor"
  - Search form section (sticky trên mobile)
  - Results grid section
  - Empty state illustration
  - Loading skeleton

**Task 5.7: Search Form Component**
- Create `DoctorSearchForm.jsx`:
  - **Specialty Dropdown:**
    - Fetch specialties on mount
    - Searchable dropdown (react-select or custom)
    - Required field indicator
    - Placeholder: "Select Specialty"
  - **Doctor Name Input:**
    - Text input với search icon
    - Debounced input (300ms) để reduce API calls
    - Optional field
    - Placeholder: "Search by doctor name..."
    - Clear button
  - **Date Picker:**
    - Display 7 ngày tiếp theo as button grid
    - Visual: "Thu, Dec 14" format
    - Highlight "Today" badge
    - Default: hôm nay
    - Mobile-friendly date selector
  - **Action Buttons:**
    - "Search" button (primary, disabled khi invalid)
    - "Reset" button (secondary, show after search)
    - Loading spinner trên button khi searching

**Task 5.8: Search Results Component**
- Create `DoctorCard.jsx`:
  - Doctor avatar (generated từ name hoặc uploaded image)
  - Doctor name + degree
  - Specialties (comma-separated)
  - Star rating display (visual stars + number)
  - Bio snippet (truncate to 2 lines với "Read more")
  - Available slots indicator: "X slots available"
  - "View Details" button
  - Card hover effect
  - Click anywhere on card → navigate to detail
- Create `DoctorSearchResults.jsx`:
  - Grid layout: 3 columns desktop, 2 tablet, 1 mobile
  - Result count: "Found X doctors"
  - Date filter display: "on [selected date]"
  - Sort options (future): By rating, by name, by availability
  - Loading state: Skeleton cards
  - Empty state: Illustration + message + "Try different filters"

**Task 5.9: Search State Management**
- Create `useDoctorSearch` custom hook:
  - States: specialties, doctors, searchResults, filters, loading, error
  - Functions:
    - `fetchSpecialties()`: Load specialty list
    - `fetchAllDoctors()`: Load default doctor list
    - `searchDoctors(filters)`: Perform search với filters
    - `resetSearch()`: Clear filters và results
  - Handle loading và error states
  - Debounce name input
  - Cache search results (session)

**Task 5.10: Search Experience Enhancement**
- URL state management:
  - Sync filters với URL query params
  - Deep linking support: `/find-a-doctor?specialty=1&date=2025-11-10`
  - Browser back/forward navigation
- Recent searches (localStorage):
  - Save last 5 searches
  - Quick filter buttons
- Search suggestions:
  - Popular specialties
  - Trending doctors
- Keyboard shortcuts:
  - Enter to search
  - Esc to clear

##### Testing Tasks:

**Task 5.11: Backend Testing**
- Unit tests cho SpecialtyService:
  - Test getAllSpecialties
  - Test caching behavior
- Unit tests cho DoctorService:
  - Test search với full filters
  - Test search với partial filters
  - Test empty results
  - Test date filtering logic
  - Test name partial matching (case-insensitive)
- Integration tests:
  - Test search API với different combinations
  - Test pagination
  - Test performance với large dataset

**Task 5.12: Frontend Testing**
- Component tests:
  - Test form rendering
  - Test specialty dropdown
  - Test date picker
  - Test search button enable/disable
  - Test doctor card rendering
  - Test empty state
- Integration tests:
  - Test search flow
  - Test filter changes
  - Test reset functionality
  - Test navigation to doctor detail
- E2E tests (Cypress):
  - Complete search journey
  - Test different filter combinations
  - Test responsive behavior

**Acceptance Criteria:**
- ✅ Hiển thị form tìm kiếm với đầy đủ fields
- ✅ Specialty dropdown load đúng data
- ✅ Date picker hiển thị 7 ngày tiếp theo
- ✅ Search button disabled khi thiếu required fields
- ✅ Search results chính xác theo filters
- ✅ Hiển thị "No results" với message rõ ràng
- ✅ Doctor cards hiển thị đầy đủ thông tin
- ✅ Click vào card navigate đến doctor detail
- ✅ Loading states hiển thị đúng
- ✅ Error handling graceful
- ✅ Responsive trên mobile, tablet, desktop
- ✅ Performance: Search results < 2s

**Definition of Done:**
- [ ] Code reviewed
- [ ] Unit tests passed (>80% coverage)
- [ ] Integration tests passed
- [ ] E2E tests passed
- [ ] Performance testing passed
- [ ] Accessibility audit passed
- [ ] Cross-browser testing passed
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Product owner approval

### 3.2 SPRINT 2: ĐẶT LỊCH KHÁM (3 tuần)

**Mục tiêu Sprint:** Xây dựng trang chi tiết bác sĩ, quản lý lịch làm việc của bác sĩ và chức năng đặt lịch hẹn.

#### 3.2.1 US5: Tìm kiếm bác sĩ (Tiếp tục) - Chi tiết bác sĩ

**Mô tả:** Hiển thị thông tin chi tiết bác sĩ và các khung giờ có sẵn để đặt lịch.

**Priority:** Critical (P0)  
**Story Points:** 13  
**Estimated Time:** 5-6 ngày

##### Backend Tasks:

**Task 5.13: Availability Blocks và Time Slots Schema**
- Tạo bảng `availability_blocks`:
  - id, doctor_id, work_date, start_time, end_time, created_at
  - Indexes: doctor_id, work_date, (doctor_id, work_date)
- Tạo bảng `time_slots`:
  - id, availability_block_id, doctor_id, start_time, end_time, status
  - status: ENUM('AVAILABLE', 'BOOKED')
  - Indexes: availability_block_id, doctor_id, status, (doctor_id, start_time)
- Foreign keys với CASCADE delete

**Task 5.14: Availability Block Service (Doctor Only)**
- Implement `AvailabilityBlockService`:
  - `createAvailabilityBlock(DoctorId, AvailabilityBlockRequest)`:
    - Validate: startTime < endTime
    - Validate: không overlap với blocks khác
    - Create availability block
    - **Auto-generate time slots 30 phút:**
      - Example: 08:00-12:00 → 8 slots (08:00-08:30, 08:30-09:00, ..., 11:30-12:00)
      - Mỗi slot có status = AVAILABLE
    - Return: Block info + số slots đã tạo
  - `getAvailabilityBlocksByDoctor(doctorId, date)`:
    - Optional date filter
    - Return: List blocks với số slots available
  - `deleteAvailabilityBlock(blockId)`:
    - Check: Không có slots nào BOOKED
    - If có slots BOOKED → throw exception
    - Delete block (cascade delete slots)

**Task 5.15: Doctor Detail Service**
- Implement method trong `DoctorService`:
  - `getDoctorDetail(doctorId, startDate, endDate)`:
    - Get doctor full info (name, degree, specialties, bio, rating)
    - Get time slots trong date range (default: hôm nay + 7 ngày)
    - Filter: Chỉ slots có status = AVAILABLE
    - Group slots by date
    - Sort by start_time ASC
    - Return: DoctorDetailDTO với timeSlots grouped by date

**Task 5.16: API Endpoints**
- `GET /api/doctors/{doctorId}/detail`:
  - Query params: startDate (optional), endDate (optional)
  - Default: startDate = today, endDate = today + 7 days
  - Response:
    ```json
    {
      "doctorId": 1,
      "fullName": "Dr. John Smith",
      "degree": "MD, Cardiology",
      "specialties": ["Cardiology"],
      "bio": "15 years experience...",
      "averageRating": 4.8,
      "timeSlotsByDate": {
        "2025-11-10": [
          {"slotId": 101, "startTime": "09:00", "endTime": "09:30", "status": "AVAILABLE"},
          {"slotId": 102, "startTime": "09:30", "endTime": "10:00", "status": "AVAILABLE"}
        ],
        "2025-11-11": [...]
      }
    }
    ```
  - Authentication: Required
  - Error handling: 404 if doctor not found

- `POST /api/doctors/{doctorId}/availability` (Doctor only):
  - Request body: `{workDate, startTime, endTime}`
  - Validation: Doctor role check, time validation
  - Response: Created block + generated slots count
  - Status: 201 Created, 403 Forbidden, 400 Bad Request

- `GET /api/doctors/{doctorId}/availability` (Doctor only):
  - Query param: date (optional)
  - Return: List of availability blocks
  - Authentication: Required, DOCTOR role

- `DELETE /api/doctors/{doctorId}/availability/{blockId}` (Doctor only):
  - Check: No booked slots
  - Delete block và all slots
  - Response: 204 No Content, 400 if has bookings

##### Frontend Tasks:

**Task 5.17: Doctor Detail Page**
- Create `DoctorDetail.jsx` (`/doctor/:id`):
  - Hero section với doctor info:
    - Large avatar
    - Name + degree
    - Specialties badges
    - Rating stars + số đánh giá
    - "Book Appointment" sticky button (mobile)
  - Tabs layout (hoặc sections):
    - Tab 1: About (bio, experience, education)
    - Tab 2: Available Times (calendar + slots)
    - Tab 3: Reviews (future - placeholder)
  - Responsive: Stack vertically on mobile

**Task 5.18: Time Slot Calendar Component**
- Create `TimeSlotCalendar.jsx`:
  - **Date Navigator:**
    - Show 7 ngày tiếp theo
    - Horizontal scroll on mobile
    - Visual: Date card với số slots available
    - Active date highlight
    - Click to view slots
  - **Time Slots Grid:**
    - Show slots cho selected date
    - Grid layout: 3-4 slots per row
    - Slot card format: "09:00 - 09:30"
    - Visual states:
      - Available: Blue, clickable
      - Selected: Blue filled
      - Past: Grey, disabled
      - Booked: Red, disabled (không hiển thị)
    - Click slot → select (single selection)
    - Selected slot highlighted
  - **Empty State:**
    - "No available slots on this date"
    - Suggest checking other dates
  - **Loading State:**
    - Skeleton loaders cho calendar

**Task 5.19: Booking Confirmation Flow**
- Create `BookingConfirmation.jsx`:
  - Hiển thị khi user chọn một slot
  - Modal hoặc sidebar layout
  - Confirmation details:
    - Doctor info (name, specialty)
    - Selected date và time
    - Duration: 30 minutes
    - Location (future - placeholder)
  - Action buttons:
    - "Confirm Booking" (primary)
    - "Cancel" (secondary)
    - "Choose Another Time"
  - Navigate to booking form khi confirm

**Task 5.20: State Management**
- Create `useDoctorDetail` custom hook:
  - States: doctor, timeSlots, selectedDate, selectedSlot, loading
  - Functions:
    - `fetchDoctorDetail(doctorId, dateRange)`: Load doctor + slots
    - `selectDate(date)`: Filter slots by date
    - `selectSlot(slotId)`: Mark slot as selected
    - `refreshSlots()`: Reload slots (after booking)
  - Handle loading/error states
  - Real-time slot availability check

**Task 5.21: Doctor Availability Management (Doctor View)**
- Create `DoctorAvailability.jsx` page (route: `/doctor/my-availability`):
  - Only accessible by DOCTOR role
  - **Create Availability Section:**
    - Date picker
    - Start time picker
    - End time picker
    - "Create Block" button
    - Preview: "This will create X slots"
  - **Availability List:**
    - Calendar view hoặc list view
    - Show all availability blocks
    - Each block: Date, time range, slots count, booked count
    - Actions: Delete block (if no bookings)
  - **Validation:**
    - Cannot create blocks in past
    - Cannot overlap existing blocks
    - Cannot delete blocks với bookings

##### Testing Tasks:

**Task 5.22: Backend Testing**
- Unit tests cho AvailabilityBlockService:
  - Test create block + auto-generate slots
  - Test time validation
  - Test overlap detection
  - Test delete with bookings (should fail)
  - Test delete without bookings (success)
- Unit tests cho DoctorService.getDoctorDetail:
  - Test with date range
  - Test filtering available slots
  - Test grouping by date
- Integration tests:
  - Test complete flow: Create block → Generate slots → Fetch detail
  - Test doctor detail API
  - Test availability management APIs

**Task 5.23: Frontend Testing**
- Component tests:
  - Test doctor detail page rendering
  - Test time slot calendar rendering
  - Test date selection
  - Test slot selection
  - Test empty states
- Integration tests:
  - Test fetching và displaying doctor detail
  - Test slot selection flow
  - Test date navigation
- E2E tests:
  - Navigate từ search → doctor detail
  - Select time slot
  - Verify booking confirmation display

**Acceptance Criteria:**
- ✅ Trang detail hiển thị đầy đủ thông tin bác sĩ
- ✅ Calendar hiển thị 7 ngày với số slots available
- ✅ Time slots hiển thị chính xác cho selected date
- ✅ Click slot → show confirmation
- ✅ Past slots và booked slots không thể chọn
- ✅ Doctor có thể tạo availability blocks
- ✅ Tự động generate time slots 30 phút
- ✅ Doctor có thể xem và delete blocks (nếu không có bookings)
- ✅ Loading states mượt mà
- ✅ Error handling đầy đủ
- ✅ Responsive design

**Definition of Done:**
- [ ] Code reviewed
- [ ] Unit tests passed (>80% coverage)
- [ ] Integration tests passed
- [ ] E2E tests passed
- [ ] Performance testing passed
- [ ] UI/UX review approved
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Product owner approval

---

#### 3.2.2 US4: Đặt lịch hẹn (Make an Appointment)

**Mô tả:** Bệnh nhân có thể đặt lịch hẹn với bác sĩ thông qua time slot đã chọn.

**Priority:** Critical (P0)  
**Story Points:** 13  
**Estimated Time:** 5-6 ngày

##### Backend Tasks:

**Task 4.1: Appointments Database Schema**
- Tạo bảng `appointments`:
  - id, patient_id, doctor_id, time_slot_id (unique)
  - symptoms (TEXT), suspected_disease (TEXT, optional)
  - status (ENUM: 'PENDING', 'COMPLETED', 'CANCELLED')
  - reschedule_count (INT, default 0)
  - created_at, updated_at
- Indexes: patient_id, doctor_id, time_slot_id (unique), status
- Foreign keys với appropriate constraints

**Task 4.2: Appointment Service Implementation**
- Implement `AppointmentService`:
  - `createAppointment(AppointmentRequest)`:
    - **Validation:**
      - Check patient exists và có role PATIENT
      - Check doctor exists
      - Check time_slot exists và status = AVAILABLE
      - Check time_slot belongs to specified doctor
      - Check time_slot không phải quá khứ
    - **Atomic Transaction:**
      - Create appointment record với status = PENDING
      - Update time_slot.status = BOOKED
      - Commit hoặc rollback together
    - **Response:** AppointmentDTO với full details
  - Handle concurrency: Optimistic locking cho time_slot
  - Handle race condition: Double booking prevention

**Task 4.3: Appointment API Endpoints**
- `POST /api/appointments`:
  - Authentication: Required (PATIENT only)
  - Request body:
    ```json
    {
      "patientId": 1,
      "doctorId": 2,
      "timeSlotId": 101,
      "symptoms": "Đau đầu, chóng mặt",
      "suspectedDisease": "Migraine" // optional
    }
    ```
  - Validation:
    - All required fields present
    - IDs valid và exist
    - Patient matches authenticated user
  - Response (201 Created):
    ```json
    {
      "appointmentId": 1,
      "patientName": "Nguyễn Văn A",
      "doctorName": "Dr. John Smith",
      "specialty": "Cardiology",
      "appointmentDateTime": "2025-11-10T09:00:00",
      "endDateTime": "2025-11-10T09:30:00",
      "symptoms": "Đau đầu, chóng mặt",
      "status": "PENDING",
      "createdAt": "2025-11-04T15:30:00"
    }
    ```
  - Error responses:
    - 400: Invalid input, time slot not available
    - 401: Not authenticated
    - 403: Not a patient
    - 404: Doctor/patient/slot not found
    - 409: Time slot already booked (race condition)

**Task 4.4: Concurrent Booking Handling**
- Implement optimistic locking:
  - Add version column to time_slots
  - Check version khi update
  - Throw exception nếu version changed
- Implement retry logic (3 attempts)
- User-friendly error messages

**Task 4.5: Appointment Retrieval**
- `GET /api/appointments/my-appointments`:
  - Authentication: Required
  - Query params: status (optional), startDate, endDate
  - Filter by patient_id (for patients) hoặc doctor_id (for doctors)
  - Return: List appointments với sorting (newest first)
  - Pagination support

##### Frontend Tasks:

**Task 4.6: Booking Form Component**
- Create `AppointmentBookingForm.jsx`:
  - Trigger: Khi user confirm time slot từ doctor detail
  - Layout: Modal hoặc full-page form
  - **Form Sections:**
    1. **Booking Summary (Read-only):**
       - Doctor name + specialty
       - Date và time
       - Duration
    2. **Patient Information (Auto-filled):**
       - Name (from profile)
       - Phone number
       - Email
    3. **Appointment Details:**
       - Symptoms (textarea, required):
         - Placeholder: "Describe your symptoms..."
         - Min length: 10 characters
         - Max length: 500 characters
       - Suspected Disease (text input, optional):
         - Autocomplete suggestions (future)
       - Additional Notes (textarea, optional)
    4. **Confirmation:**
       - Terms & conditions checkbox
       - "I understand the cancellation policy"
  - **Actions:**
    - "Book Appointment" button
    - "Back" button
  - **Validation:**
    - Real-time validation
    - Show errors inline
    - Disable submit nếu invalid

**Task 4.7: Booking Submission Flow**
- Create `useAppointmentBooking` hook:
  - States: formData, loading, error, success
  - Functions:
    - `submitBooking(appointmentData)`: API call
    - `validateForm()`: Client-side validation
  - Handle loading states
  - Handle errors (with retry option)
  - Handle success (show confirmation)

**Task 4.8: Booking Confirmation Modal**
- Create `BookingConfirmationModal.jsx`:
  - Hiển thị sau khi book thành công
  - **Content:**
    - Success icon/animation
    - "Appointment Booked Successfully!"
    - Appointment details card:
      - Doctor name
      - Date + time
      - Appointment ID
      - Location (future)
    - Instructions:
      - "You will receive a confirmation email"
      - "Add to calendar" button (future)
      - "View my appointments" link
  - **Actions:**
    - "Done" button → navigate to appointments page
    - "Book Another" button → return to search

**Task 4.9: My Appointments Page**
- Create `MyAppointments.jsx` (`/my-appointments`):
  - Tab layout:
    - Upcoming appointments
    - Past appointments
    - Cancelled appointments
  - **Appointment Card:**
    - Doctor info (name, specialty, avatar)
    - Date + time
    - Status badge
    - Symptoms snippet
    - Actions:
      - "View Details"
      - "Cancel" (for upcoming only)
      - "Reschedule" (for upcoming only)
      - "Rate Doctor" (for completed only)
  - Empty states cho mỗi tab
  - Pull-to-refresh (mobile)

**Task 4.10: Booking Error Handling**
- Handle race condition (slot booked by someone else):
  - Show error: "This time slot is no longer available"
  - Suggest: "Please choose another time"
  - Auto-refresh available slots
  - Highlight alternative slots
- Handle network errors:
  - Retry mechanism
  - Offline detection
  - Queue booking when offline (future)
- Handle validation errors:
  - Inline error messages
  - Focus on first error field

##### Testing Tasks:

**Task 4.11: Backend Testing**
- Unit tests cho AppointmentService:
  - Test successful booking
  - Test patient không tồn tại
  - Test doctor không tồn tại
  - Test time slot not available
  - Test time slot không thuộc doctor
  - Test past time slot
  - Test double booking prevention
  - Test atomic transaction (rollback on error)
- Integration tests:
  - Test complete booking flow
  - Test concurrent booking attempts
  - Test optimistic locking
  - Test my-appointments retrieval

**Task 4.12: Frontend Testing**
- Component tests:
  - Test booking form rendering
  - Test form validation
  - Test form submission
  - Test error display
  - Test success confirmation
- Integration tests:
  - Test complete booking flow từ slot selection đến confirmation
  - Test error scenarios
  - Test navigation flows
- E2E tests (Cypress):
  - Complete user journey: Search → Detail → Select Slot → Book → Confirmation
  - Test validation errors
  - Test double booking scenario
  - Test my appointments page

**Acceptance Criteria:**
- ✅ Chỉ authenticated patients mới có thể book
- ✅ Form validation đầy đủ và rõ ràng
- ✅ Không thể book past slots
- ✅ Không thể double booking cùng slot
- ✅ Race condition được handle gracefully
- ✅ Transaction atomic (appointment + slot update)
- ✅ Success confirmation hiển thị đầy đủ thông tin
- ✅ Navigate đến my appointments sau booking
- ✅ Error messages helpful và actionable
- ✅ Loading states mượt mà
- ✅ Responsive design

**Definition of Done:**
- [ ] Code reviewed
- [ ] Unit tests passed (>80% coverage)
- [ ] Integration tests passed
- [ ] E2E tests passed
- [ ] Concurrency testing passed
- [ ] Security review completed
- [ ] Performance testing passed
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Product owner approval

### 3.3 SPRINT 3: QUẢN LÝ LỊCH HẸN VÀ THÔNG TIN BỆNH NHÂN (3 tuần)

**Mục tiêu Sprint:** Xây dựng dashboard quản lý appointments, chức năng cancel/reschedule và xem thông tin bệnh nhân.

#### 3.3.1 US3: Xem lịch trình bác sĩ (View Doctor's Schedule)

**Mô tả:** Bác sĩ có thể xem dashboard với tổng quan appointments và quản lý lịch trình.

**Priority:** High (P1)  
**Story Points:** 13  
**Estimated Time:** 5-6 ngày

##### Backend Tasks:

**Task 3.1: Doctor Dashboard Statistics**
- Implement `DoctorDashboardService`:
  - `getDashboardStats(doctorId)`:
    - Count appointments hôm nay (by status)
    - Count appointments tuần này (by status)
    - Count appointments tháng này (by status)
    - Upcoming appointments trong 7 ngày
    - Recent completed appointments
    - Average rating trong tháng
  - Query optimization với indexed queries
  - Caching dashboard stats (5 minutes TTL)

**Task 3.2: Doctor Appointments Management**
- Enhance `AppointmentService`:
  - `getDoctorAppointments(doctorId, filters)`:
    - Filter by date range
    - Filter by status (PENDING, COMPLETED, CANCELLED)
    - Sort by appointment date
    - Pagination support
    - Include patient basic info (name, phone)
  - `completeAppointment(appointmentId, doctorId)`:
    - Validate: Doctor owns appointment
    - Validate: Status is PENDING
    - Update status to COMPLETED
    - Record completion timestamp
  - `getAppointmentDetail(appointmentId, doctorId)`:
    - Full appointment info
    - Patient info
    - Symptoms, suspected disease
    - Medical notes (future)

**Task 3.3: API Endpoints - Doctor Dashboard**
- `GET /api/doctors/{doctorId}/dashboard/stats`:
  - Authentication: Required, DOCTOR role
  - Response:
    ```json
    {
      "today": {"pending": 5, "completed": 2, "cancelled": 1},
      "thisWeek": {"pending": 15, "completed": 8, "cancelled": 2},
      "thisMonth": {"pending": 40, "completed": 25, "cancelled": 5},
      "upcomingAppointments": [...],
      "recentCompleted": [...],
      "averageRating": 4.8
    }
    ```

- `GET /api/doctors/{doctorId}/appointments`:
  - Query params: status, startDate, endDate, page, size
  - Return: Paginated appointment list
  - Each appointment includes patient basic info

- `PUT /api/appointments/{appointmentId}/complete`:
  - Authentication: Required, DOCTOR role
  - Validate: Doctor owns appointment
  - Update status to COMPLETED
  - Response: 200 OK, 403 Forbidden, 404 Not Found

##### Frontend Tasks:

**Task 3.4: Doctor Dashboard Page**
- Create `DoctorDashboard.jsx` (`/doctor/dashboard`):
  - **Stats Overview Section:**
    - 4 stat cards in grid:
      - Today's Appointments (với breakdown by status)
      - This Week (với chart)
      - This Month (với trend)
      - Average Rating (với stars)
    - Visual: Cards with icons, colors, trends
  - **Upcoming Appointments Section:**
    - List view với timeline
    - Next 5 upcoming appointments
    - Each item: Patient name, time, symptoms snippet
    - Quick actions: Complete, Cancel, View Details
    - "View All" link
  - **Quick Actions:**
    - "Create Availability" button
    - "View My Schedule" button
    - "Manage Availability" button
  - Loading states và error handling

**Task 3.5: Appointments Management Page**
- Create `DoctorAppointmentsManagement.jsx` (`/doctor/appointments`):
  - **Filter Bar:**
    - Date range picker
    - Status filter (All, Pending, Completed, Cancelled)
    - Search by patient name
    - "Export" button (future)
  - **Appointments List/Calendar Toggle:**
    - List View:
      - Table layout with sorting
      - Columns: Date/Time, Patient, Symptoms, Status, Actions
      - Pagination
    - Calendar View:
      - Monthly calendar
      - Dots indicator cho appointments
      - Click date → show appointments that day
  - **Appointment Actions:**
    - Complete appointment
    - Cancel appointment
    - View patient info
    - View detailed appointment
  - Empty states, loading states

**Task 3.6: Appointment Detail Modal**
- Create `AppointmentDetailModal.jsx`:
  - Trigger: Click "View Details" trong appointment list
  - **Content Sections:**
    1. Patient Information:
       - Name, age, gender
       - Contact: Phone, email
       - "View Full Profile" link
    2. Appointment Information:
       - Date and time
       - Duration
       - Status badge
       - Created date
    3. Medical Information:
       - Symptoms (full text)
       - Suspected disease
       - Medical notes (editable by doctor)
    4. Action History:
       - Created at
       - Completed at (if applicable)
       - Rescheduled history (if any)
  - **Actions:**
    - Complete (if pending)
    - Cancel (if pending)
    - Add Notes (doctor only)
    - Print/Export (future)

**Task 3.7: Complete Appointment Flow**
- Create `CompleteAppointmentModal.jsx`:
  - Confirmation dialog
  - Optional fields:
    - Medical notes (textarea)
    - Diagnosis (text input)
    - Prescription (textarea, future)
    - Follow-up recommendation
  - Confirmation checkbox
  - Submit button

##### Testing Tasks:

**Task 3.8: Backend Testing**
- Unit tests cho DoctorDashboardService:
  - Test stats calculation
  - Test date filtering
  - Test caching behavior
- Unit tests cho AppointmentService:
  - Test complete appointment
  - Test authorization (doctor owns appointment)
  - Test invalid status transitions
- Integration tests:
  - Test dashboard API
  - Test appointments management API
  - Test complete appointment flow

**Task 3.9: Frontend Testing**
- Component tests:
  - Test dashboard rendering
  - Test stats display
  - Test appointments list
  - Test filters
  - Test complete appointment modal
- Integration tests:
  - Test fetching và displaying dashboard
  - Test filtering appointments
  - Test complete appointment flow
- E2E tests:
  - Doctor login → view dashboard
  - View appointments list
  - Complete an appointment

**Acceptance Criteria:**
- ✅ Chỉ DOCTOR role truy cập được dashboard
- ✅ Dashboard hiển thị stats chính xác
- ✅ Appointments list có filtering và sorting
- ✅ Doctor có thể complete appointments
- ✅ Authorization checks đúng
- ✅ Real-time stats updates
- ✅ Loading và error states
- ✅ Responsive design

**Definition of Done:**
- [ ] Code reviewed
- [ ] Unit tests passed (>80% coverage)
- [ ] Integration tests passed
- [ ] E2E tests passed
- [ ] Authorization testing passed
- [ ] Performance testing passed
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Product owner approval

---

#### 3.3.2 US10: Hủy hoặc thay đổi lịch hẹn (Canceling or Changing Appointment)

**Mô tả:** Bệnh nhân và bác sĩ có thể hủy hoặc reschedule appointments với business rules.

**Priority:** Critical (P0)  
**Story Points:** 13  
**Estimated Time:** 5-6 ngày

##### Backend Tasks:

**Task 10.1: Appointment History Schema**
- Tạo bảng `appointment_history`:
  - id, appointment_id, action, performed_by_user_id
  - reason (TEXT), old_time_slot_id, new_time_slot_id
  - timestamp
- Indexes: appointment_id, performed_by_user_id, timestamp
- Track all changes: CREATED, RESCHEDULED, CANCELLED, COMPLETED

**Task 10.2: Cancel Appointment Service**
- Implement trong `AppointmentService`:
  - `cancelAppointment(appointmentId, userId, reason)`:
    - **Authorization:**
      - Check user is patient of appointment hoặc doctor of appointment
    - **Validation:**
      - Check status is PENDING
      - Check appointment time > 2 hours from now
    - **Business Logic:**
      - Update appointment status to CANCELLED
      - Update time_slot status to AVAILABLE (atomic)
      - Create history record
      - Send notification (future)
    - **Response:** Success message hoặc error
  - Handle edge cases:
    - Already cancelled
    - Too close to appointment time
    - Unauthorized user

**Task 10.3: Reschedule Appointment Service**
- Implement `rescheduleAppointment(appointmentId, newTimeSlotId, userId, reason)`:
  - **Authorization:**
    - Check user owns appointment
  - **Validation:**
    - Check status is PENDING
    - Check reschedule_count < 2 (max 2 reschedules)
    - Check new time slot AVAILABLE
    - Check new time slot belongs to same doctor
    - Check appointment time > 2 hours from now
    - Check new slot không phải quá khứ
  - **Business Logic (Atomic Transaction):**
    - Release old time_slot (set AVAILABLE)
    - Book new time_slot (set BOOKED)
    - Update appointment with new time_slot_id
    - Increment reschedule_count
    - Create history record
    - Send notification to doctor
  - **Response:** Updated appointment info
  - Handle race conditions: New slot booked by someone else

**Task 10.4: API Endpoints**
- `PUT /api/appointments/{appointmentId}/cancel`:
  - Authentication: Required
  - Authorization: Patient hoặc Doctor của appointment
  - Request body: `{reason: "Có việc đột xuất"}`
  - Validation: Status PENDING, time > 2h
  - Response: 200 OK, 403 Forbidden, 400 Bad Request
  - Error messages:
    - "Cannot cancel within 2 hours of appointment"
    - "Appointment already cancelled"
    - "Only patient or doctor can cancel"

- `PUT /api/appointments/{appointmentId}/reschedule`:
  - Authentication: Required
  - Authorization: Patient của appointment
  - Request body:
    ```json
    {
      "newTimeSlotId": 202,
      "reason": "Có việc đột xuất"
    }
    ```
  - Validation:
    - Status PENDING
    - reschedule_count < 2
    - New slot available
    - Time constraints
  - Response (200 OK):
    ```json
    {
      "appointmentId": 1,
      "oldDateTime": "2025-11-10T09:00:00",
      "newDateTime": "2025-11-11T10:00:00",
      "rescheduleCount": 1,
      "message": "Appointment rescheduled successfully"
    }
    ```
  - Error responses:
    - 400: Max reschedules reached (2)
    - 409: New slot already booked
    - 400: Cannot reschedule within 2 hours

- `GET /api/appointments/{appointmentId}/history`:
  - Return: Timeline of all changes
  - Include: action, timestamp, performed_by, reason

##### Frontend Tasks:

**Task 10.5: Cancel Appointment Flow**
- Create `CancelAppointmentModal.jsx`:
  - **Trigger:** "Cancel" button trên appointment card/detail
  - **Content:**
    - Warning message về cancellation policy
    - Time constraint warning (if < 24h)
    - Reason input (dropdown hoặc textarea):
      - Predefined reasons: "Schedule conflict", "Feeling better", "Emergency", "Other"
      - If "Other" → show textarea
    - Confirmation checkbox: "I understand this cannot be undone"
  - **Actions:**
    - "Confirm Cancel" button (destructive color)
    - "Keep Appointment" button (default)
  - **Success:**
    - Show success message
    - Refresh appointments list
    - Redirect to appointments page

**Task 10.6: Reschedule Appointment Flow**
- Create `RescheduleAppointmentFlow.jsx`:
  - **Step 1: Confirmation**
    - Show current appointment details
    - Show reschedule count (1/2 or 2/2)
    - Warning if max reschedules reached
    - Reason input
    - "Continue to Select New Time" button
  - **Step 2: Select New Time Slot**
    - Reuse TimeSlotCalendar component
    - Show only future slots
    - Same doctor's slots only
    - Highlight suggested slots (similar time/day)
    - "Confirm New Time" button (disabled until select)
  - **Step 3: Review Changes**
    - Side-by-side comparison:
      - Old time → New time
      - Same doctor
      - Same duration
    - Total reschedules: X/2
    - Reason summary
    - "Confirm Reschedule" button
  - **Success:**
    - Animated transition
    - New appointment details
    - "Add to calendar" button
    - "Done" button

**Task 10.7: Business Rules Enforcement - UI**
- Disable "Cancel" button if:
  - Appointment < 2 hours away
  - Status not PENDING
  - Tooltip: "Cannot cancel within 2 hours"
- Disable "Reschedule" button if:
  - Appointment < 2 hours away
  - reschedule_count >= 2
  - Status not PENDING
  - Tooltip: "Maximum reschedules reached (2)"
- Show warnings:
  - < 24 hours: "Cancelling on short notice"
  - Last reschedule: "This is your final reschedule"

**Task 10.8: Appointment History Timeline**
- Create `AppointmentHistoryTimeline.jsx`:
  - Visual timeline component
  - Each entry:
    - Icon (created, rescheduled, cancelled, completed)
    - Action description
    - Timestamp (relative time)
    - Performed by (user name)
    - Reason (if applicable)
  - Color coding: Green (completed), Yellow (rescheduled), Red (cancelled)
  - Expandable details

##### Testing Tasks:

**Task 10.9: Backend Testing**
- Unit tests cho cancelAppointment:
  - Test successful cancellation
  - Test time constraint (< 2 hours)
  - Test unauthorized user
  - Test already cancelled
  - Test atomic transaction
- Unit tests cho rescheduleAppointment:
  - Test successful reschedule
  - Test max reschedules (2)
  - Test time constraints
  - Test race condition
  - Test slot validation
  - Test atomic transaction
- Integration tests:
  - Test complete cancel flow
  - Test complete reschedule flow
  - Test appointment history tracking
  - Test concurrent reschedule attempts

**Task 10.10: Frontend Testing**
- Component tests:
  - Test cancel modal rendering
  - Test reschedule flow steps
  - Test validation messages
  - Test button enable/disable states
- Integration tests:
  - Test cancel appointment flow
  - Test reschedule appointment flow
  - Test history timeline display
- E2E tests (Cypress):
  - Complete cancel journey
  - Complete reschedule journey
  - Test business rules enforcement
  - Test error scenarios

**Acceptance Criteria:**
- ✅ Chỉ patient/doctor của appointment mới cancel được
- ✅ Không thể cancel/reschedule trong vòng 2 giờ
- ✅ Max 2 lần reschedule per appointment
- ✅ Atomic transaction (appointment + time slots)
- ✅ Cancel/reschedule release old slot và book new slot (reschedule)
- ✅ Appointment history tracked đầy đủ
- ✅ Error messages clear và actionable
- ✅ Confirmation steps prevent accidental actions
- ✅ UI enforces business rules (disabled buttons)
- ✅ Real-time updates sau cancel/reschedule

**Definition of Done:**
- [ ] Code reviewed
- [ ] Unit tests passed (>80% coverage)
- [ ] Integration tests passed
- [ ] E2E tests passed
- [ ] Business rules testing passed
- [ ] Concurrency testing passed
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Product owner approval

---

#### 3.3.3 US2: Xem thông tin bệnh nhân (View Information of Patient)

**Mô tả:** Bác sĩ có thể xem thông tin chi tiết bệnh nhân với proper authorization và audit logging.

**Priority:** High (P1)  
**Story Points:** 8  
**Estimated Time:** 3-4 ngày

##### Backend Tasks:

**Task 2.1: Patient Information Service**
- Implement `PatientService`:
  - `getPatientProfile(patientId, requestingDoctorId)`:
    - **Authorization:**
      - Check doctor có appointment với patient này (past hoặc upcoming)
      - Chỉ doctors với appointments mới có quyền access
    - **Audit Logging:**
      - Log mỗi lần doctor access patient info
      - Log: doctorId, patientId, timestamp, purpose (viewing profile)
    - **Return:**
      - Basic info: name, age, gender, phone, email
      - Date of birth (calculated age)
      - Registration date
      - Không return: password, sensitive PII
  
  - `getPatientAppointmentHistory(patientId, doctorId)`:
    - **Authorization:** Same as above
    - **Return:**
      - All appointments của patient với doctor này
      - Include: date, symptoms, diagnosis (if any), status
      - Sort by date DESC

**Task 2.2: Privacy và GDPR Compliance**
- Implement audit logging:
  - Create `audit_logs` table:
    - id, user_id, action, resource_type, resource_id
    - ip_address, user_agent, timestamp
  - Log mọi access to patient data
  - Retention: 90 days (or as per GDPR requirements)
- Data masking:
  - Mask sensitive fields in logs
  - Email: show first 2 chars + "***@domain.com"
  - Phone: show last 4 digits only in some views

**Task 2.3: API Endpoints**
- `GET /api/patients/{patientId}/profile`:
  - Authentication: Required, DOCTOR role
  - Authorization: Doctor must have appointment với patient
  - Response:
    ```json
    {
      "patientId": 1,
      "fullName": "Nguyễn Văn A",
      "age": 35,
      "gender": "MALE",
      "phoneNumber": "0912345678",
      "email": "patient@example.com",
      "registrationDate": "2025-01-15",
      "totalAppointments": 5
    }
    ```
  - Error: 403 if no appointments found

- `GET /api/patients/{patientId}/appointment-history`:
  - Query param: doctorId
  - Authorization: Doctor accessing own appointments với patient
  - Response: List of appointments with details
  - Error: 403 Forbidden

- `GET /api/audit-logs/patient-access/{patientId}`:
  - Admin only (future)
  - Show who accessed patient data

##### Frontend Tasks:

**Task 2.4: Patient Profile Modal**
- Create `PatientProfileModal.jsx`:
  - **Trigger:** "View Patient" link trong appointment detail
  - **Layout:** Modal hoặc side panel
  - **Content Sections:**
    1. **Basic Information:**
       - Profile picture (placeholder)
       - Full name
       - Age and Date of Birth
       - Gender
       - Contact: Phone, Email (masked initially, click to reveal)
    2. **Appointment History với Doctor:**
       - Timeline view
       - Past appointments:
         - Date và time
         - Symptoms
         - Diagnosis/notes
         - Status
       - Upcoming appointments
       - Total appointments count
    3. **Medical Information (Future):**
       - Allergies
       - Chronic conditions
       - Current medications
       - Blood type
  - **Privacy Notice:**
    - "This information is confidential"
    - "Access is logged for security"
  - **Actions:**
    - "Close" button
    - "Print Profile" (future)

**Task 2.5: Access Authorization UI**
- Show authorization errors gracefully:
  - If doctor tries to access patient without appointment:
    - Error modal: "You don't have permission to view this patient's information"
    - Reason: "You must have an appointment with this patient"
  - Suggest: "Contact admin if you need access"

**Task 2.6: Appointment History View**
- Create `PatientAppointmentHistory.jsx`:
  - Card-based timeline layout
  - Each appointment card:
    - Date badge
    - Status indicator
    - Symptoms summary
    - Diagnosis/notes (if added by doctor)
    - "View Full Details" link
  - Filter options:
    - All appointments
    - Completed only
    - Pending only
  - Empty state: "No appointment history with this patient"

##### Testing Tasks:

**Task 2.7: Backend Testing**
- Unit tests cho PatientService:
  - Test get patient profile
  - Test authorization (doctor has appointment)
  - Test authorization failure (no appointment)
  - Test audit logging
  - Test data masking
- Integration tests:
  - Test complete patient info access flow
  - Test audit log creation
  - Test appointment history retrieval
- Security tests:
  - Test unauthorized access attempts
  - Test SQL injection protection
  - Test data exposure

**Task 2.8: Frontend Testing**
- Component tests:
  - Test patient profile modal rendering
  - Test appointment history display
  - Test authorization error handling
- Integration tests:
  - Test fetching patient info
  - Test viewing appointment history
  - Test authorization enforcement
- E2E tests:
  - Doctor views patient profile
  - Doctor views patient history
  - Test unauthorized access blocked

**Acceptance Criteria:**
- ✅ Chỉ doctor có appointment với patient mới xem được
- ✅ Mọi access được audit log
- ✅ Patient info hiển thị đầy đủ nhưng secure
- ✅ Appointment history chỉ show appointments với doctor đó
- ✅ Authorization errors clear và helpful
- ✅ Privacy notice visible
- ✅ Sensitive data masked appropriately
- ✅ GDPR compliance considerations met

**Definition of Done:**
- [ ] Code reviewed
- [ ] Unit tests passed (>80% coverage)
- [ ] Integration tests passed
- [ ] Security testing passed
- [ ] Authorization testing passed
- [ ] Audit logging verified
- [ ] Privacy review completed
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Product owner approval

---

## 4. YÊU CẦU PHI CHỨC NĂNG

### 4.1 Hiệu suất (Performance)
- **NFR-1:** Thời gian phản hồi API < 2 giây cho 95% requests
- **NFR-2:** Hệ thống hỗ trợ tối thiểu 100 concurrent users
- **NFR-3:** Database query time < 500ms
- **NFR-4:** Frontend bundle size < 2MB
- **NFR-5:** Page load time < 3 giây trên 3G connection

### 4.2 Khả năng mở rộng (Scalability)
- **NFR-6:** Hệ thống có thể scale horizontal
- **NFR-7:** Database hỗ trợ sharding
- **NFR-8:** API stateless để dễ load balancing
- **NFR-9:** CDN cho static assets

### 4.3 Độ tin cậy (Reliability)
- **NFR-10:** Uptime 99.5%
- **NFR-11:** Automatic failover cho database
- **NFR-12:** Backup dữ liệu hàng ngày
- **NFR-13:** Disaster recovery plan

### 4.4 Khả năng sử dụng (Usability)
- **NFR-14:** Giao diện trực quan, dễ sử dụng
- **NFR-15:** Responsive design cho mọi thiết bị
- **NFR-16:** Accessibility compliance (WCAG 2.1)
- **NFR-17:** Multi-language support (future)

### 4.5 Tương thích (Compatibility)
- **NFR-18:** Hỗ trợ browsers: Chrome, Firefox, Safari, Edge
- **NFR-19:** Mobile browsers: iOS Safari, Android Chrome
- **NFR-20:** Backward compatibility cho API versions

---

## 5. YÊU CẦU GIAO DIỆN

### 5.1 Giao diện người dùng (UI)
- **UIR-1:** Design system nhất quán
- **UIR-2:** Color scheme: Primary blue (#667eea), Secondary colors
- **UIR-3:** Typography: Sans-serif fonts, readable sizes
- **UIR-4:** Icons: Consistent icon library
- **UIR-5:** Loading states và animations

### 5.2 Trải nghiệm người dùng (UX)
- **UXR-1:** User flow trực quan và logic
- **UXR-2:** Minimize số clicks để hoàn thành task
- **UXR-3:** Clear error messages và recovery paths
- **UXR-4:** Progressive disclosure cho complex forms
- **UXR-5:** Feedback rõ ràng cho mọi action

### 5.3 Responsive Design
- **RDR-1:** Mobile-first approach
- **RDR-2:** Breakpoints: 320px, 768px, 1024px, 1440px
- **RDR-3:** Touch-friendly interface cho mobile
- **RDR-4:** Optimized layouts cho tablet

---

## 6. YÊU CẦU HỆ THỐNG

### 6.1 Kiến trúc hệ thống
- **SR-1:** Microservices architecture (future)
- **SR-2:** RESTful API design
- **SR-3:** JWT-based authentication
- **SR-4:** Stateless application servers

### 6.2 Công nghệ
- **TR-1:** Backend: Spring Boot, Java 11+
- **TR-2:** Frontend: React.js, Modern JavaScript
- **TR-3:** Database: PostgreSQL/MySQL
- **TR-4:** Caching: Redis (future)
- **TR-5:** Message Queue: RabbitMQ (future)

### 6.3 Deployment
- **DR-1:** Containerization với Docker
- **DR-2:** Cloud deployment (AWS/Azure)
- **DR-3:** CI/CD pipeline
- **DR-4:** Blue-green deployment
- **DR-5:** Monitoring và logging

### 6.4 Tích hợp
- **IR-1:** Email service integration
- **IR-2:** SMS service integration (future)
- **IR-3:** Payment gateway integration (future)
- **IR-4:** Calendar integration (future)

---


## 7. KẾ HOẠCH PHÁT TRIỂN

### 7.1 Timeline
- **Sprint 1 (2 tuần):** Authentication + Finding Doctor
- **Sprint 2 (3 tuần):** Doctor Details + Make Appointment
- **Sprint 3 (3 tuần):** Appointment Management + Patient Info

### 7.2 Milestones
- **M1:** MVP với core features
- **M2:** Full appointment management
- **M3:** Advanced features và optimizations

### 7.3 Testing Strategy
- **Unit Testing:** 80%+ code coverage
- **Integration Testing:** API và database
- **E2E Testing:** Critical user journeys
- **Performance Testing:** Load và stress testing
- **Security Testing:** Vulnerability scanning

### 7.4 Deployment Strategy
- **Development:** Local development environment
- **Staging:** Pre-production testing
- **Production:** Blue-green deployment
- **Monitoring:** Application và infrastructure monitoring

### 7.5 Maintenance
- **Bug fixes:** Priority-based resolution
- **Feature updates:** Regular releases
- **Security patches:** Immediate deployment
- **Performance optimization:** Ongoing monitoring

---

## 8. RỦI RO VÀ GIẢM THIỂU

### 8.1 Technical Risks
- **Risk:** Database performance issues
  - **Mitigation:** Query optimization, indexing, caching
- **Risk:** API scalability problems
  - **Mitigation:** Load testing, horizontal scaling
- **Risk:** Security vulnerabilities
  - **Mitigation:** Regular audits, penetration testing

### 8.2 Business Risks
- **Risk:** User adoption challenges
  - **Mitigation:** User testing, feedback incorporation
- **Risk:** Regulatory compliance issues
  - **Mitigation:** Legal consultation, compliance audits

### 8.3 Project Risks
- **Risk:** Timeline delays
  - **Mitigation:** Agile methodology, regular reviews
- **Risk:** Resource constraints
  - **Mitigation:** Priority management, scope adjustment

---

## 9. YÊU CẦU BẢO MẬT

### 9.1 Xác thực và Phân quyền
- **SEC-1:** JWT-based authentication với secure token generation
  - Token expiration: 24 giờ cho access token
  - Refresh token mechanism với sliding expiration
  - Secure token storage (httpOnly cookies)
  - Token blacklisting khi logout

- **SEC-2:** Role-based access control (RBAC)
  - Roles: PATIENT, DOCTOR, ADMIN
  - Permission-based access cho từng endpoint
  - Resource-level authorization (user chỉ truy cập data của mình)
  - Hierarchical role inheritance

- **SEC-3:** Password security
  - BCrypt hashing với salt rounds >= 12
  - Password complexity requirements (8+ chars, mixed case, numbers, symbols)
  - Password history tracking (không được trùng 5 password gần nhất)
  - Account lockout sau 5 lần đăng nhập sai

- **SEC-4:** Session management
  - Secure session handling
  - Concurrent session limits
  - Session timeout sau 30 phút inactive
  - Session invalidation khi detect suspicious activity

- **SEC-5:** Multi-factor authentication (Future)
  - SMS-based OTP
  - Email-based verification
  - Authenticator app support
  - Backup codes

### 9.2 Bảo mật dữ liệu
- **SEC-6:** Encryption
  - HTTPS/TLS 1.3 cho tất cả communications
  - Database encryption at rest (AES-256)
  - Sensitive field encryption (PII, medical data)
  - Key management với HSM hoặc cloud KMS

- **SEC-7:** Input validation và sanitization
  - Server-side validation cho tất cả inputs
  - SQL injection prevention (parameterized queries)
  - XSS protection (output encoding, CSP headers)
  - File upload validation (type, size, content scanning)
  - CSRF token validation

- **SEC-8:** API security
  - Rate limiting (100 requests/minute per user)
  - CORS configuration restrictive
  - API versioning và backward compatibility
  - Request/response logging cho audit
  - IP whitelisting cho admin endpoints

### 9.3 Privacy và Compliance
- **SEC-9:** Data privacy
  - GDPR compliance (EU users)
  - HIPAA considerations (US healthcare data)
  - Data minimization principles
  - Consent management system
  - Privacy policy và terms of service

- **SEC-10:** Audit và monitoring
  - Comprehensive audit logging
  - Real-time security monitoring
  - Anomaly detection
  - Incident response procedures
  - Security information và event management (SIEM)

- **SEC-11:** Data retention và disposal
  - Automated data purging policies
  - Right to be forgotten implementation
  - Backup encryption và secure deletion
  - Legal hold capabilities
  - Data anonymization cho analytics

### 9.4 Security Testing
- **SEC-12:** Regular security assessments
  - Quarterly penetration testing
  - Automated vulnerability scanning
  - Code security reviews
  - Dependency vulnerability checks
  - Security compliance audits

---

## 10. KIẾN TRÚC VÀ THIẾT KẾ HỆ THỐNG

### 10.1 Kiến trúc tổng thể
**Layered Architecture Pattern:**

- **Presentation Layer (Frontend):**
  - React.js single-page application
  - Component-based architecture
  - State management với React hooks
  - Client-side routing
  - Responsive design framework

- **API Gateway Layer:**
  - RESTful API endpoints
  - Request validation và authentication
  - Rate limiting và throttling
  - API versioning
  - CORS handling

- **Business Logic Layer:**
  - Service classes với business rules
  - Transaction management
  - Validation logic
  - Business workflow orchestration
  - Event handling

- **Data Access Layer:**
  - JPA/Hibernate ORM
  - Repository pattern implementation
  - Query optimization
  - Connection pooling
  - Transaction boundaries

- **Database Layer:**
  - PostgreSQL relational database
  - Normalized schema design
  - Indexing strategy
  - Backup và replication
  - Performance tuning

### 10.2 Design Patterns
- **Repository Pattern:** Abstraction layer cho data access
- **Service Layer Pattern:** Business logic encapsulation
- **DTO Pattern:** Data transfer giữa layers
- **Factory Pattern:** Object creation
- **Strategy Pattern:** Interchangeable algorithms
- **Observer Pattern:** Event notifications

### 10.3 Database Design

**Core Tables:**

1. **Users Table:**
   - id, email, password_hash, role, created_at, updated_at
   - Indexes: email (unique), role
   - Relationships: 1:1 với Patients/Doctors

2. **Patients Table:**
   - id, user_id, full_name, date_of_birth, gender, phone_number
   - Indexes: user_id (unique), phone_number
   - Relationships: 1:M với Appointments

3. **Doctors Table:**
   - id, user_id, full_name, degree, bio, average_rating
   - Indexes: user_id (unique), average_rating
   - Relationships: M:N với Specialties, 1:M với Appointments

4. **Specialties Table:**
   - id, name, description
   - Indexes: name (unique)
   - Relationships: M:N với Doctors

5. **AvailabilityBlocks Table:**
   - id, doctor_id, work_date, start_time, end_time
   - Indexes: doctor_id, work_date, (doctor_id, work_date)
   - Relationships: 1:M với TimeSlots

6. **TimeSlots Table:**
   - id, availability_block_id, doctor_id, start_time, end_time, status
   - Indexes: availability_block_id, doctor_id, status, start_time
   - Relationships: 1:1 với Appointments

7. **Appointments Table:**
   - id, patient_id, doctor_id, time_slot_id, symptoms, status, reschedule_count
   - Indexes: patient_id, doctor_id, time_slot_id (unique), status
   - Relationships: M:1 với Patients, Doctors, TimeSlots

**Indexing Strategy:**
- Primary keys: Clustered indexes
- Foreign keys: Non-clustered indexes
- Search columns: Composite indexes (e.g., doctor_id + work_date)
- Date ranges: Covering indexes
- Full-text search: Text indexes (future)

**Data Integrity:**
- Foreign key constraints với appropriate cascading
- Check constraints cho enums và value ranges
- Unique constraints cho business rules
- Trigger-based audit trails
- Optimistic locking cho concurrent updates

### 10.4 API Design Principles

**RESTful Standards:**
- Resource-based URL structure: `/api/v1/resource`
- HTTP methods: GET, POST, PUT, DELETE, PATCH
- Stateless operations
- Standard HTTP status codes
- JSON response format

**API Endpoints Structure:**
```
Authentication:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

Specialties:
- GET /api/specialties

Doctors:
- GET /api/doctors
- GET /api/doctors/search
- GET /api/doctors/{id}
- GET /api/doctors/{id}/detail

Availability:
- POST /api/doctors/{id}/availability
- GET /api/doctors/{id}/availability
- DELETE /api/doctors/{id}/availability/{blockId}

Appointments:
- POST /api/appointments
- GET /api/appointments/my-appointments
- PUT /api/appointments/{id}/cancel
- PUT /api/appointments/{id}/reschedule
```

**Response Format:**
```json
{
  "status": "success|error",
  "data": {},
  "message": "Optional message",
  "errors": [],
  "pagination": {
    "page": 1,
    "size": 20,
    "total": 100
  }
}
```

---

## 11. TESTING VÀ QUALITY ASSURANCE

### 11.1 Testing Pyramid

**Unit Tests (70% coverage target):**
- Service layer business logic
- Utility functions
- Validators và transformers
- Repository methods
- Mock external dependencies

**Integration Tests (20% coverage target):**
- API endpoint testing
- Database integration
- External service integration
- Authentication flow
- Transaction boundaries

**End-to-End Tests (10% coverage target):**
- Critical user journeys
- Cross-browser testing
- Performance testing
- Security testing
- Accessibility testing

### 11.2 Testing Strategy chi tiết

**Backend Testing:**
- **Unit Tests:** JUnit 5, Mockito, AssertJ
- **Integration Tests:** Spring Boot Test, TestContainers
- **API Tests:** RestAssured, Postman/Newman
- **Performance Tests:** JMeter, Gatling
- **Security Tests:** OWASP ZAP, SonarQube

**Frontend Testing:**
- **Unit Tests:** Jest, React Testing Library
- **Component Tests:** Storybook
- **E2E Tests:** Cypress, Playwright
- **Visual Regression:** Percy, Chromatic
- **Performance:** Lighthouse, WebPageTest

### 11.3 Quality Metrics

**Code Quality:**
- Test coverage >= 80%
- Cyclomatic complexity < 10
- Code duplication < 3%
- Maintainability index > 70
- Technical debt ratio < 5%

**Performance Benchmarks:**
- API response time: p95 < 2s, p99 < 5s
- Page load time: < 3s on 3G
- Time to interactive: < 5s
- First contentful paint: < 1.5s
- Database query time: < 500ms average

**Bug Tracking:**
- Critical bugs: 0 in production
- High priority bugs: < 5
- Bug fix turnaround: < 48 hours
- Regression rate: < 5%

---

## 12. DEPLOYMENT VÀ DEVOPS

### 12.1 Environment Configuration

**Development Environment:**
- Local Docker Compose setup
- H2/PostgreSQL local database
- Hot reload enabled
- Debug logging
- Mock external services
- Sample data seeding

**Staging Environment:**
- Production-like configuration
- Separate database instance
- Full logging enabled
- Performance monitoring
- Integration with test services
- Automated daily deployment

**Production Environment:**
- High availability setup (99.5% uptime)
- Load balancing với health checks
- Auto-scaling based on metrics
- Database replication (master-slave)
- CDN cho static assets
- Full monitoring và alerting

### 12.2 CI/CD Pipeline chi tiết

**Continuous Integration:**
1. Code commit → trigger build
2. Compile và package
3. Run unit tests
4. Run integration tests
5. Code quality analysis (SonarQube)
6. Security vulnerability scan
7. Build Docker image
8. Push to container registry

**Continuous Deployment:**
1. Deploy to staging environment
2. Run smoke tests
3. Run E2E tests
4. Performance testing
5. Security scanning
6. Manual approval gate
7. Blue-green deployment to production
8. Health check validation
9. Rollback capability

**Pipeline Tools:**
- CI/CD: GitHub Actions / Jenkins / GitLab CI
- Container Registry: Docker Hub / AWS ECR
- Artifact Repository: Nexus / Artifactory
- Deployment: Kubernetes / Docker Swarm

### 12.3 Infrastructure as Code

**Container Configuration:**
- Docker cho application packaging
- Docker Compose cho local development
- Kubernetes cho orchestration
- Helm charts cho deployment templates

**Cloud Infrastructure:**
- Infrastructure provisioning: Terraform
- Configuration management: Ansible
- Service mesh: Istio (future)
- API Gateway: Kong / AWS API Gateway

### 12.4 Monitoring và Logging

**Application Monitoring:**
- Application Performance Monitoring (APM): New Relic / Datadog
- Error tracking: Sentry
- Uptime monitoring: Pingdom / UptimeRobot
- Synthetic monitoring: Catchpoint

**Infrastructure Monitoring:**
- Server metrics: Prometheus + Grafana
- Container monitoring: cAdvisor
- Database monitoring: pgAdmin / CloudWatch
- Network monitoring: Nagios

**Logging Strategy:**
- Centralized logging: ELK Stack (Elasticsearch, Logstash, Kibana)
- Log levels: ERROR, WARN, INFO, DEBUG
- Structured logging (JSON format)
- Log retention: 30 days hot, 90 days cold
- PII scrubbing trong logs

**Alerting:**
- Error rate > 1%: Immediate alert
- Response time > 5s: Warning
- CPU usage > 80%: Warning
- Memory usage > 85%: Warning
- Disk usage > 90%: Critical
- Alert channels: Slack, Email, PagerDuty

---

## 13. USER EXPERIENCE VÀ ACCESSIBILITY

### 13.1 User Experience Design Principles

**Jakob Nielsen's 10 Usability Heuristics:**
1. **Visibility of system status:** Loading indicators, progress bars
2. **Match between system và real world:** Familiar medical terminology
3. **User control và freedom:** Cancel actions, undo capabilities
4. **Consistency và standards:** Consistent UI patterns
5. **Error prevention:** Validation, confirmation dialogs
6. **Recognition rather than recall:** Visual cues, auto-complete
7. **Flexibility và efficiency:** Keyboard shortcuts, quick actions
8. **Aesthetic và minimalist design:** Clean, uncluttered interface
9. **Help users recognize errors:** Clear error messages
10. **Help và documentation:** Contextual help, tooltips

**User Journey Optimization:**
- **Finding Doctor:** 3 clicks từ homepage đến search results
- **Booking Appointment:** 5 clicks từ doctor selection đến confirmation
- **Managing Appointments:** 2 clicks từ dashboard đến appointment details
- **Cancel/Reschedule:** 3 clicks với clear confirmation

### 13.2 Accessibility Compliance

**WCAG 2.1 Level AA Requirements:**

**Perceivable:**
- Text alternatives cho non-text content
- Captions cho video/audio
- Content có thể present theo different ways
- Color contrast ratio >= 4.5:1 cho normal text
- Color contrast ratio >= 3:1 cho large text
- Text resizable up to 200%

**Operable:**
- Keyboard accessible (tab navigation)
- No keyboard traps
- Adjustable time limits
- Seizure-safe (no flashing content)
- Skip navigation links
- Descriptive page titles
- Focus order logical

**Understandable:**
- Language of page declared
- Predictable navigation
- Input assistance với labels
- Error identification và suggestions
- Help available

**Robust:**
- Valid HTML/CSS
- Name, role, value cho UI components
- Status messages properly announced
- ARIA attributes correct

### 13.3 Responsive Design Strategy

**Mobile-First Approach:**
- Design cho smallest screen first
- Progressive enhancement cho larger screens
- Touch targets >= 44x44 pixels
- Thumb-friendly navigation zones

**Breakpoints:**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1439px
- Large Desktop: 1440px+

**Performance on Mobile:**
- Lazy loading images
- Code splitting
- Reduced animation trên low-end devices
- Offline functionality (service workers)

---

## 14. DATA MANAGEMENT VÀ ANALYTICS

### 14.1 Data Collection

**User Analytics:**
- Page views và navigation paths
- Feature usage statistics
- Search queries và filters
- Appointment booking funnels
- User session duration

**Performance Analytics:**
- API response times
- Page load times
- Error rates
- Resource utilization
- Database query performance

**Business Analytics:**
- Appointment booking rates
- Cancellation rates
- Popular specialties
- Doctor utilization
- Patient retention

### 14.2 Reporting

**Operational Reports:**
- Daily appointment summary
- Doctor availability overview
- System health status
- Error logs summary

**Business Reports:**
- Monthly booking trends
- Revenue analytics (future)
- Patient demographics
- Doctor performance metrics
- Specialty demand analysis

**Compliance Reports:**
- Audit trail reports
- Security incident reports
- Data access logs
- Privacy compliance reports

---

## 15. DISASTER RECOVERY VÀ BUSINESS CONTINUITY

### 15.1 Backup Strategy

**Database Backups:**
- Full backup: Daily at 2 AM
- Incremental backup: Every 6 hours
- Transaction log backup: Every hour
- Backup retention: 30 days
- Offsite backup: Cloud storage
- Backup encryption: AES-256

**Application Backups:**
- Configuration files
- Static assets
- User-uploaded content
- Container images
- Infrastructure as Code

### 15.2 Recovery Procedures

**Recovery Time Objective (RTO):**
- Critical systems: 1 hour
- Non-critical systems: 4 hours
- Full system restore: 24 hours

**Recovery Point Objective (RPO):**
- Database: Maximum 1 hour data loss
- Files: Maximum 24 hours data loss

**Disaster Recovery Plan:**
1. Incident detection và assessment
2. Team notification
3. System isolation (if security breach)
4. Recovery initiation
5. Data restoration
6. System validation
7. Service resumption
8. Post-incident review

---

## 16. PHỤ LỤC

### 16.1 Glossary (Bảng thuật ngữ)

**Technical Terms:**
- **API:** Application Programming Interface - giao diện lập trình ứng dụng
- **JWT:** JSON Web Token - token xác thực dạng JSON  
- **RBAC:** Role-Based Access Control - kiểm soát truy cập dựa trên vai trò
- **SRS:** Software Requirements Specification - đặc tả yêu cầu phần mềm
- **UI/UX:** User Interface/User Experience - giao diện/trải nghiệm người dùng
- **REST:** Representational State Transfer - kiến trúc API
- **ORM:** Object-Relational Mapping - ánh xạ đối tượng quan hệ
- **CI/CD:** Continuous Integration/Continuous Deployment
- **DTO:** Data Transfer Object - đối tượng truyền dữ liệu

**Compliance Terms:**
- **GDPR:** General Data Protection Regulation - quy định bảo vệ dữ liệu chung (EU)
- **HIPAA:** Health Insurance Portability và Accountability Act (US)
- **WCAG:** Web Content Accessibility Guidelines - hướng dẫn truy cập web
- **PII:** Personally Identifiable Information - thông tin nhận dạng cá nhân
- **PHI:** Protected Health Information - thông tin sức khỏe được bảo vệ

**Performance Terms:**
- **SLA:** Service Level Agreement - thỏa thuận mức độ dịch vụ
- **RTO:** Recovery Time Objective - mục tiêu thời gian phục hồi
- **RPO:** Recovery Point Objective - mục tiêu điểm phục hồi
- **APM:** Application Performance Monitoring

**Healthcare Terms:**
- **EHR:** Electronic Health Record - hồ sơ sức khỏe điện tử
- **EMR:** Electronic Medical Record - hồ sơ y tế điện tử
- **HIS:** Hospital Information System - hệ thống thông tin bệnh viện
- **PACS:** Picture Archiving và Communication System

### 16.2 References

**Standards và Guidelines:**
- IEEE 830-1998 Standard for Software Requirements Specifications
- WCAG 2.1 Web Content Accessibility Guidelines
- GDPR General Data Protection Regulation
- OWASP Top 10 Web Application Security Risks
- ISO 27001 Information Security Management

**UI/UX Design Resources:**
- [Figma Design Mockups - Doctor Appointment Web](https://www.figma.com/design/ZkznhNtLKYtGmjjsROB4BN/Doctor-Appointment-Web?t=YaOrs0iiEiLKuxLr-0)

**Technical Documentation:**
- Spring Boot Official Documentation
- React.js Official Documentation
- PostgreSQL Documentation
- JWT.io - JSON Web Token Introduction
- RESTful API Design Best Practices

**Books và Articles:**
- "Clean Architecture" by Robert C. Martin
- "Domain-Driven Design" by Eric Evans
- "Don't Make Me Think" by Steve Krug
- "The Pragmatic Programmer" by Hunt & Thomas

---
