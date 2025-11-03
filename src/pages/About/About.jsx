import MainLayout from '../../layouts/MainLayout'
import './About.css'
import aboutImg from '../../assets/appointment_img.png'

const About = () => {
  const values = [
    {
      title: 'Chăm Sóc Tận Tâm',
      
    },
    {
      title: 'Xuất Sắc',
    },
    {
      title: 'Tin Cậy & Chính Trực',
    },
    {
      title: 'Đổi Mới',
    }
  ]

  const stats = [
    { number: '50+', label: 'Bệnh Nhân Hài Lòng' },
    { number: '20+', label: 'Bác Sĩ Chuyên Gia' },
    { number: '5+', label: 'Năm Kinh Nghiệm' },
    { number: '24/7', label: 'Hỗ Trợ Sẵn Có' }
  ]

  

  return (
    <MainLayout>
      <div className="about-page">
        <section className="about-hero">
          <div className="container">
            <h1 className="about-title">Giới Thiệu Công Ty</h1>
            <p className="about-subtitle">
              Công ty của chúng tôi là một công ty cung cấp dịch vụ y tế chuyên nghiệp, mang đến sự quan tâm và chăm sóc y tế toàn diện cho hơn mười năm qua.
            </p>
          </div>
        </section>

        <section className="mission-section">
          <div className="container">
            <div className="mission-grid">
              <div className="mission-content">
                <h2 className="section-title">Sứ Mệnh Của Chúng Tôi</h2>
                <p className="mission-text">
                Tại TeachNova, chúng tôi cam kết cung cấp các dịch vụ chăm sóc sức khỏe đặc biệt, giúp cải thiện chất lượng cuộc sống cho bệnh nhân và gia đình họ. Chúng tôi tin rằng mọi người đều xứng đáng được tiếp cận dịch vụ chăm sóc y tế đẳng cấp thế giới, được cung cấp với lòng trắc ẩn, sự tôn trọng và tính chuyên nghiệp.                </p>
                <p className="mission-text">
                    Nhóm bác sĩ chuyên nghiệp của chúng tôi làm việc cùng nhau để đảm bảo rằng mỗi bệnh nhân nhận được điều trị cá nhân hóa, dựa trên cơ sở khoa học và phù hợp với nhu cầu và tình huống cá nhân của họ.
                </p>
              </div>
              <div className="mission-image">
              <img src={aboutImg} alt="About Us" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="values-section">
          <div className="container">
            <h2 className="section-title centered">Giá Trị Cốt Lõi</h2>
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

       
        {/* History Section */}
        <section className="history-section">
          <div className="container">
            <h2 className="section-title centered">Hành Trình Của Chúng Tôi</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-year">2010</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Thành Lập</h3>
                  
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2015</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Mở Rộng</h3>
                  
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2020</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Đổi Mới Số</h3>
                 
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2024</div>
                <div className="timeline-conten t">
                  <h3 className="timeline-title">Ngày Nay</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

export default About

