import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import headerImg from "../../assets/header_img.png";
import "./Home.css";

const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      icon: "🔍",
      title: "Find Specialist Doctors",
      description: "Connect with qualified doctors across multiple specialties",
      color: "#3B82F6",
    },
    {
      icon: "📅",
      title: "Easy Appointment Booking",
      description: "Schedule appointments in just a few clicks, 24/7",
      color: "#8B5CF6",
    },
    {
      icon: "💬",
      title: "Online Consultation",
      description: "Video consultations from the comfort of your home",
      color: "#10B981",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your health data is encrypted and fully protected",
      color: "#F59E0B",
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Patients" },
    { number: "200+", label: "Expert Doctors" },
    { number: "15+", label: "Specialties" },
    { number: "4.9", label: "Rating" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      comment:
        "The online consultation feature is a game-changer! I got expert medical advice without leaving my home. The doctors are professional and caring.",
      rating: 5,
      avatar: "👩‍💼",
    },
    {
      name: "Michael Chen",
      role: "Patient",
      comment:
        "Booking appointments has never been easier. The platform is intuitive and I love how I can see doctor availability in real-time.",
      rating: 5,
      avatar: "👨‍💻",
    },
    {
      name: "Emily Rodriguez",
      role: "Patient",
      comment:
        "Outstanding service! The doctors are highly qualified and the entire process is seamless. Highly recommend to everyone.",
      rating: 5,
      avatar: "👩‍🎓",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up in under 60 seconds with your email",
      icon: "📝",
    },
    {
      number: "02",
      title: "Search & Select",
      description: "Browse doctors by specialty, location, or availability",
      icon: "🔎",
    },
    {
      number: "03",
      title: "Book Appointment",
      description: "Choose your preferred date and time slot",
      icon: "📅",
    },
    {
      number: "04",
      title: "Get Treated",
      description: "Meet your doctor online or visit in-person",
      icon: "⚕️",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout>
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="hero-shape hero-shape-1"></div>
            <div className="hero-shape hero-shape-2"></div>
            <div className="hero-shape hero-shape-3"></div>
          </div>

          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="badge-icon">✨</span>
                <span>Your Health, Our Priority</span>
              </div>

              <h1 className="hero-title">
                Find & Book
                <span className="text-gradient"> Top Doctors</span>
                <br />
                Near You
              </h1>

              <p className="hero-subtitle">
                Access quality healthcare with ease. Connect with experienced
                doctors, book appointments instantly, and get the care you
                deserve - all in one platform.
              </p>

              <div className="hero-actions">
                <Link to="/find-a-doctor" className="btn-primary">
                  <span>Find Doctors</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Link to="/signup" className="btn-secondary">
                  <span>Get Started</span>
                </Link>
              </div>

              <div className="hero-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-image">
              <div className="image-container">
                <img src={headerImg} alt="Doctor" />
                <div className="floating-card card-1">
                  <div className="card-icon">👨‍⚕️</div>
                  <div className="card-content">
                    <div className="card-title">Expert Doctors</div>
                    <div className="card-subtitle">Available 24/7</div>
                  </div>
                </div>
                <div className="floating-card card-2">
                  <div className="card-icon">⭐</div>
                  <div className="card-content">
                    <div className="card-title">4.9 Rating</div>
                    <div className="card-subtitle">From 50K+ patients</div>
                  </div>
                </div>
                <div className="floating-card card-3">
                  <div className="card-icon">📅</div>
                  <div className="card-content">
                    <div className="card-title">Easy Booking</div>
                    <div className="card-subtitle">In 3 simple steps</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Why Choose Us</span>
              <h2 className="section-title">
                Everything You Need for Better Healthcare
              </h2>
              <p className="section-subtitle">
                Comprehensive healthcare solutions designed with you in mind
              </p>
            </div>

            <div className="features-grid">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="feature-card"
                  style={{ "--feature-color": feature.color }}
                >
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">{feature.icon}</div>
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Simple Process</span>
              <h2 className="section-title">
                Book Your Appointment in 4 Easy Steps
              </h2>
              <p className="section-subtitle">
                Getting healthcare has never been this simple
              </p>
            </div>

            <div className="steps-container">
              {steps.map((step, index) => (
                <div key={index} className="step-item">
                  <div className="step-icon-wrapper">
                    <div className="step-icon">{step.icon}</div>
                    <div className="step-number">{step.number}</div>
                  </div>
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="step-connector">
                      <svg
                        width="100%"
                        height="2"
                        viewBox="0 0 100 2"
                        preserveAspectRatio="none"
                      >
                        <line
                          x1="0"
                          y1="1"
                          x2="100"
                          y2="1"
                          stroke="#E5E7EB"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Patient Reviews</span>
              <h2 className="section-title">What Our Patients Say</h2>
              <p className="section-subtitle">
                Real stories from real people who trust us with their health
              </p>
            </div>

            <div className="testimonials-carousel">
              <div
                className="testimonial-track"
                style={{
                  transform: `translateX(-${activeTestimonial * 100}%)`,
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="testimonial-slide">
                    <div className="testimonial-card">
                      <div className="testimonial-rating">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="star">
                            ⭐
                          </span>
                        ))}
                      </div>
                      <p className="testimonial-comment">
                        "{testimonial.comment}"
                      </p>
                      <div className="testimonial-author">
                        <div className="author-avatar">
                          {testimonial.avatar}
                        </div>
                        <div className="author-info">
                          <h4 className="author-name">{testimonial.name}</h4>
                          <p className="author-role">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="carousel-dots">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${
                      index === activeTestimonial ? "active" : ""
                    }`}
                    onClick={() => setActiveTestimonial(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-background">
            <div className="cta-shape cta-shape-1"></div>
            <div className="cta-shape cta-shape-2"></div>
          </div>

          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">
                Ready to Take Control of Your Health?
              </h2>
              <p className="cta-subtitle">
                Join thousands of satisfied patients who have transformed their
                healthcare experience
              </p>
              <div className="cta-actions">
                <Link to="/signup" className="btn-cta-primary">
                  Get Started Free
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Link to="/find-a-doctor" className="btn-cta-secondary">
                  Browse Doctors
                </Link>
              </div>
              <div className="cta-trust">
                <div className="trust-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 0L12.2451 6.90983L19.5106 6.90983L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983L7.75486 6.90983L10 0Z"
                      fill="#FCD34D"
                    />
                  </svg>
                  <span>4.9/5 Rating</span>
                </div>
                <div className="trust-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M9 2C9 0.895431 9.89543 0 11 0H17C18.1046 0 19 0.895431 19 2V8C19 9.10457 18.1046 10 17 10H11C9.89543 10 9 9.10457 9 8V2Z"
                      fill="#34D399"
                    />
                    <path
                      d="M0 11C0 9.89543 0.895431 9 2 9H8C9.10457 9 10 9.89543 10 11V17C10 18.1046 9.10457 19 8 19H2C0.895431 19 0 18.1046 0 17V11Z"
                      fill="#34D399"
                    />
                  </svg>
                  <span>Trusted by 50K+</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
