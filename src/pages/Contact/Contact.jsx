import MainLayout from '../../layouts/MainLayout'
import './Contact.css'

const Contact = () => {
  return (
    <MainLayout>
      <div className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="container">
            <h1 className="contact-title">Contact Us</h1>
            <p className="contact-subtitle">
              Have questions? Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        <section className="contact-section">
          <div className="container">
            <div className="contact-wrapper">
              {/* Contact Form */}
              <div className="contact-form-container">
                <form className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      placeholder="Your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows="5"
                      placeholder="Your message..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-submit">
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="contact-info-container">
                <h2 className="info-title">Get in Touch</h2>
                
                <div className="contact-info-list">
                  <div className="contact-info-item">
                    <div className="info-icon">📞</div>
                    <div className="info-content">
                      <p className="info-text">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="info-icon">✉️</div>
                    <div className="info-content">
                      <p className="info-text">info@teachnova.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

export default Contact

