import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      icon: <Search size={40} />,
      title: "Find Specialist Doctors",
      description: "Connect with qualified doctors across multiple specialties",
      color: "#3B82F6",
    },
    {
      icon: <Calendar size={40} />,
      title: "Easy Appointment Booking",
      description: "Schedule appointments in just a few clicks, 24/7",
      color: "#8B5CF6",
    },
    {
      icon: <MessageSquare size={40} />,
      title: "Online Consultation",
      description: "Video consultations from the comfort of your home",
      color: "#10B981",
    },
    {
      icon: <Lock size={40} />,
      title: "Secure & Private",
      description: "Your health data is encrypted and fully protected",
      color: "#F59E0B",
    },
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
      icon: <PenSquare size={48} />,
    },
    {
      number: "02",
      title: "Search & Select",
      description: "Browse doctors by specialty, location, or availability",
      icon: <Search size={48} />,
    },
    {
      number: "03",
      title: "Book Appointment",
      description: "Choose your preferred date and time slot",
      icon: <Calendar size={48} />,
    },
    {
      number: "04",
      title: "Get Treated",
      description: "Meet your doctor online or visit in-person",
      icon: <Hospital size={48} />,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

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
                  <ArrowRight size={20} />
                </Link>
                <Link to="/signup" className="btn-secondary">
                  <span>Get Started</span>
                </Link>
              </div>

              <div className="hero-trust-badges">
                <div className="trust-badge">
                  <BadgeCheck size={20} />
                  <span>Verified Doctors</span>
                </div>
                <div className="trust-badge">
                  <Star size={20} />
                  <span>Top Rated Service</span>
                </div>
              </div>
            </div>

            <div className="hero-image">
              <div className="image-container">
                <img src={headerImg} alt="Doctor" />
                <div className="floating-card card-1">
                  <Pill size={32} className="card-icon-lucide" />
                  <div className="card-content">
                    <div className="card-title">Online Booking</div>
                    <div className="card-subtitle">Easy & Fast</div>
                  </div>
                </div>
                <div className="floating-card card-2">
                  <Stethoscope size={32} className="card-icon-lucide" />
                  <div className="card-content">
                    <div className="card-title">Expert Doctors</div>
                    <div className="card-subtitle">Certified Professionals</div>
                  </div>
                </div>
                <div className="floating-card card-3">
                  <CalendarCheck size={32} className="card-icon-lucide" />
                  <div className="card-content">
                    <div className="card-title">Easy Booking</div>
                    <div className="card-subtitle">Instant Confirmation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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

        {/* <section className="testimonials-section">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Testimonials</span>
              <h2 className="section-title">What Our Patients Say</h2>
              <p className="section-subtitle">
                Real experiences from real people
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
                          <Star
                            key={i}
                            className="star"
                            size={24}
                            fill="currentColor"
                          />
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
                          <div className="author-name">{testimonial.name}</div>
                          <div className="author-role">{testimonial.role}</div>
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
        </section> */}

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
                Join our community and experience healthcare made simple
              </p>
              <div className="cta-actions">
                <Link to="/signup" className="btn-cta-primary">
                  Get Started Free
                  <ArrowRight size={20} />
                </Link>
                <Link to="/find-a-doctor" className="btn-cta-secondary">
                  Browse Doctors
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
