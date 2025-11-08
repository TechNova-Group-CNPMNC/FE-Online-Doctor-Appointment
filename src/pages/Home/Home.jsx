import { Link } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import headerImg from "../../assets/header_img.png";
import "./Home.css";
import {
  Search,
  Calendar,
  MessageSquare,
  Lock,
  PenSquare,
  Hospital,
  BadgeCheck,
  Star,
  Pill,
  Stethoscope,
  CalendarCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: <Search size={40} />,
      title: "Tìm bác sĩ chuyên khoa",
      description: "Kết nối với bác sĩ giỏi thuộc nhiều chuyên khoa",
      color: "#3B82F6",
    },
    {
      icon: <Calendar size={40} />,
      title: "Đặt lịch hẹn dễ dàng",
      description: "Đặt lịch chỉ với vài cú nhấp chuột, 24/7",
      color: "#8B5CF6",
    },
    // {
    //   icon: <MessageSquare size={40} />,
    //   title: "Tư vấn trực tuyến",
    //   description: "Tư vấn qua video ngay tại nhà của bạn",
    //   color: "#10B981",
    // },
    {
      icon: <Lock size={40} />,
      title: "Bảo mật & Riêng tư",
      description: "Dữ liệu sức khỏe của bạn được mã hóa và bảo vệ",
      color: "#F59E0B",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Tạo tài khoản",
      description: "Đăng ký dưới 60 giây bằng email của bạn",
      icon: <PenSquare size={48} />,
    },
    {
      number: "02",
      title: "Tìm kiếm & Lựa chọn",
      description: "Tìm bác sĩ theo chuyên khoa, địa điểm hoặc lịch rảnh",
      icon: <Search size={48} />,
    },
    {
      number: "03",
      title: "Đặt lịch hẹn",
      description: "Chọn ngày và khung giờ bạn muốn",
      icon: <Calendar size={48} />,
    },
    {
      number: "04",
      title: "Nhận tư vấn",
      description: "Gặp bác sĩ trực tuyến hoặc đến khám trực tiếp",
      icon: <Hospital size={48} />,
    },
  ];

  return (
    <MainLayout>
      <div className="home-page">
        <section className="hero-section">
          <div className="hero-background">
            <div className="hero-shape hero-shape-1"></div>
            <div className="hero-shape hero-shape-2"></div>
            <div className="hero-shape hero-shape-3"></div>
            <div className="particles">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="particle"></div>
              ))}
            </div>
          </div>

          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-badge">
                <Sparkles size={16} className="badge-icon" />
                <span>Sức khỏe của bạn, Ưu tiên của chúng tôi</span>
              </div>

              <h1 className="hero-title">
                Tìm & Đặt lịch
                <span className="text-gradient"> Bác sĩ hàng đầu</span>
              </h1>

              <p className="hero-subtitle">
                Tiếp cận chăm sóc sức khỏe chất lượng một cách dễ dàng. Kết nối
                với các bác sĩ giàu kinh nghiệm, đặt lịch hẹn ngay lập tức và
                nhận được sự chăm sóc xứng đáng - tất cả trong một nền tảng.
              </p>

              <div className="hero-actions">
                <Link to="/find-a-doctor" className="btn-primary">
                  <span>Tìm bác sĩ</span>
                  <ArrowRight size={20} />
                </Link>
                <Link to="/about" className="btn-secondary">
                  <span>Về chúng tôi</span>
                </Link>
              </div>

              <div className="hero-trust-badges">
                <div className="trust-badge">
                  <BadgeCheck size={20} />
                  <span>Bác sĩ đã xác minh</span>
                </div>
                <div className="trust-badge">
                  <Star size={20} />
                  <span>Dịch vụ hàng đầu</span>
                </div>
              </div>
            </div>

            <div className="hero-image">
              <div className="image-container">
                <img src={headerImg} alt="Doctor" />
                <div className="floating-card card-1">
                  <Pill size={32} className="card-icon-lucide" />
                  <div className="card-content">
                    <div className="card-title">Đặt lịch trực tuyến</div>
                    <div className="card-subtitle">Dễ dàng & Nhanh chóng</div>
                  </div>
                </div>
                <div className="floating-card card-2">
                  <Stethoscope size={32} className="card-icon-lucide" />
                  <div className="card-content">
                    <div className="card-title">Bác sĩ chuyên môn</div>
                    <div className="card-subtitle">
                      Chuyên gia đã chứng nhận
                    </div>
                  </div>
                </div>
                <div className="floating-card card-3">
                  <CalendarCheck size={32} className="card-icon-lucide" />
                  <div className="card-content">
                    <div className="card-title">Đặt lịch dễ dàng</div>
                    <div className="card-subtitle">Xác nhận ngay lập tức</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Tại sao chọn chúng tôi</span>
              <h2 className="section-title">
                Mọi thứ bạn cần cho Chăm sóc sức khỏe tốt hơn
              </h2>
              <p className="section-subtitle">
                Giải pháp chăm sóc sức khỏe toàn diện thiết kế vì bạn
              </p>
            </div>

            <div className="features-grid">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="feature-card"
                  style={{
                    "--feature-color": feature.color,
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">{feature.icon}</div>
                    <div className="feature-glow"></div>
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="how-it-works-section">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Quy trình đơn giản</span>
              <h2 className="section-title">
                Đặt lịch hẹn trong 4 bước dễ dàng
              </h2>
              <p className="section-subtitle">
                Chăm sóc sức khỏe chưa bao giờ đơn giản đến thế
              </p>
            </div>

            <div className="steps-container">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="step-item"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="step-icon-wrapper">
                    <div className="step-icon">{step.icon}</div>
                    <div className="step-number">{step.number}</div>
                    <div className="step-pulse"></div>
                  </div>
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="step-connector">
                      <div className="connector-line"></div>
                      <div className="connector-dot"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-background">
            <div className="cta-shape cta-shape-1"></div>
            <div className="cta-shape cta-shape-2"></div>
          </div>

          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">
                Sẵn sàng kiểm soát sức khỏe của bạn?
              </h2>
              <p className="cta-subtitle">
                Tham gia cộng đồng và trải nghiệm chăm sóc sức khỏe đơn giản
              </p>
              <div className="cta-actions">
                <Link to="/contact" className="btn-cta-primary">
                  Liên hệ với chúng tôi
                  <ArrowRight size={20} />
                </Link>
                <Link to="/find-a-doctor" className="btn-cta-secondary">
                  Xem danh sách Bác sĩ
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
