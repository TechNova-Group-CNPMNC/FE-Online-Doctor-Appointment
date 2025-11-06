import MainLayout from "../../layouts/MainLayout";
import "./About.css";
import aboutImg from "../../assets/appointment_img.png";
import {
  Heart,
  Target,
  Handshake,
  Microscope,
  Award,
  Users,
  Clock,
  Shield,
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Heart size={48} />,
      title: "Chăm sóc đầy lòng nhân ái",
      description:
        "Chúng tôi đối xử với mỗi bệnh nhân bằng sự đồng cảm và tôn trọng, đảm bảo sự thoải mái của họ là ưu tiên hàng đầu.",
    },
    {
      icon: <Target size={48} />,
      title: "Xuất sắc",
      description:
        "Chúng tôi phấn đấu đạt được sự xuất sắc trong mọi việc, từ chẩn đoán đến điều trị và chăm sóc theo dõi.",
    },
    {
      icon: <Handshake size={48} />,
      title: "Tin cậy và liêm chính",
      description:
        "Chúng tôi xây dựng mối quan hệ lâu dài dựa trên lòng tin, sự minh bạch và các thực hành y tế đạo đức.",
    },
    {
      icon: <Microscope size={48} />,
      title: "Đổi mới",
      description:
        "Chúng tôi áp dụng công nghệ tiên tiến và tiến bộ y tế để cung cấp chăm sóc tốt nhất có thể.",
    },
  ];

  const stats = [
    { icon: <Users size={32} />, number: "50,000+", label: "Bệnh nhân hài lòng" },
    { icon: <Award size={32} />, number: "200+", label: "Bác sĩ chuyên gia" },
    { icon: <Clock size={32} />, number: "15+", label: "Năm kinh nghiệm" },
    { icon: <Shield size={32} />, number: "24/7", label: "Hỗ trợ luôn sẵn sàng" },
  ];

  return (
    <MainLayout>
      <div className="about-page">
        <section className="about-hero">
          <div className="container">
            <h1 className="about-title">Về TechNova</h1>
            <p className="about-subtitle">
              Đối tác chăm sóc sức khỏe đáng tin cậy của bạn, cung cấp dịch vụ y tế toàn diện và đầy lòng nhân ái hơn một thập kỷ.
            </p>
          </div>
        </section>

        <section className="mission-section">
          <div className="container">
            <div className="mission-grid">
              <div className="mission-content">
                <h2 className="section-title">Sứ mệnh của chúng tôi</h2>
                <p className="mission-text">
                  Tại TechNova, chúng tôi cam kết cung cấp dịch vụ chăm sóc sức khỏe xuất sắc để cải thiện chất lượng cuộc sống cho bệnh nhân và gia đình họ. Chúng tôi tin rằng mọi người đều xứng đáng tiếp cận dịch vụ y tế đẳng cấp thế giới, được cung cấp với sự đồng cảm, tôn trọng và chuyên nghiệp.
                </p>
                <p className="mission-text">
                  Đội ngũ các chuyên gia y tế có trình độ cao của chúng tôi hợp tác cùng nhau để đảm bảo mỗi bệnh nhân nhận được điều trị cá nhân hóa, dựa trên bằng chứng, phù hợp với nhu cầu và hoàn cảnh riêng của họ.
                </p>
              </div>
              <div className="mission-image">
                <img
                  src={aboutImg}
                  alt="Về chúng tôi"
                  className="about-us-girl-image"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="values-section">
          <div className="container">
            <h2 className="section-title centered">Giá trị cốt lõi của chúng tôi</h2>
            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="history-section">
          <div className="container">
            <h2 className="section-title centered">Hành trình của chúng tôi</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-year">2010</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Thành lập</h3>
                  <p className="timeline-text">
                    TechNova được thành lập với tầm nhìn cách mạng hóa việc cung cấp dịch vụ chăm sóc sức khỏe, làm cho dịch vụ y tế chất lượng trở nên dễ tiếp cận với tất cả mọi người.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2015</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Mở rộng</h3>
                  <p className="timeline-text">
                    Chúng tôi mở rộng dịch vụ để bao gồm các khoa chuyên khoa, cung cấp chăm sóc toàn diện dưới một mái nhà.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2020</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Đổi mới số hóa</h3>
                  <p className="timeline-text">
                    Ra mắt nền tảng telemedicine và hệ thống đặt lịch hẹn trực tuyến để nâng cao sự tiện lợi cho bệnh nhân.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2024</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Ngày nay</h3>
                  <p className="timeline-text">
                    Tiếp tục phục vụ hàng nghìn bệnh nhân hàng năm với cơ sở vật chất hiện đại và công nghệ y tế tiên tiến.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default About;
