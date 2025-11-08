import MainLayout from "../../layouts/MainLayout";
import "./Contact.css";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <MainLayout>
      <div className="contact-page">
        <section className="contact-hero">
          <div className="hero-background">
            <div className="hero-shape hero-shape-1"></div>
            <div className="hero-shape hero-shape-2"></div>
            <div className="particles">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="particle"></div>
              ))}
            </div>
          </div>
          <div className="container">
            <h1 className="contact-title">Liên hệ với chúng tôi</h1>
            <p className="contact-subtitle">
              Có câu hỏi? Gửi tin nhắn cho chúng tôi và chúng tôi sẽ phản hồi
              sớm nhất có thể.
            </p>
          </div>
        </section>

        <section className="contact-section">
          <div className="container">
            <div className="contact-wrapper">
              {/* <div className="contact-form-container">
                <h2 className="form-title">Gửi tin nhắn cho chúng tôi</h2>
                <form className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">Tên</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Tên của bạn"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email của bạn"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Tin nhắn</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      placeholder="Tin nhắn của bạn..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-submit">
                    Gửi tin nhắn
                  </button>
                </form>
              </div> */}

              <div className="contact-info-container">
                <h2 className="info-title">Liên hệ</h2>

                <div className="contact-info-list">
                  <div className="contact-info-item">
                    <Phone size={24} className="info-icon" />
                    <div className="info-content">
                      <p className="info-text">+84 901 234 567</p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <Mail size={24} className="info-icon" />
                    <div className="info-content">
                      <p className="info-text">info@teachnova.com</p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <MapPin size={24} className="info-icon" />
                    <div className="info-content">
                      <p className="info-text">
                        123 Đường Sức khỏe, Thành phố Y tế, Việt Nam
                      </p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <Clock size={24} className="info-icon" />
                    <div className="info-content">
                      <p className="info-text">
                        Thứ 2 - Thứ 6: 9:00 - 18:00
                        <br />
                        Thứ 7 - Chủ nhật: 10:00 - 16:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Contact;
