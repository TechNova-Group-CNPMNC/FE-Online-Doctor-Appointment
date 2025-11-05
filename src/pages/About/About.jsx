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
      title: "Compassionate Care",
      description:
        "We treat every patient with empathy and respect, ensuring their comfort is our top priority.",
    },
    {
      icon: <Target size={48} />,
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, from diagnosis to treatment and follow-up care.",
    },
    {
      icon: <Handshake size={48} />,
      title: "Trust & Integrity",
      description:
        "We build lasting relationships based on trust, transparency, and ethical medical practices.",
    },
    {
      icon: <Microscope size={48} />,
      title: "Innovation",
      description:
        "We embrace cutting-edge technology and medical advances to provide the best care possible.",
    },
  ];

  const stats = [
    { icon: <Users size={32} />, number: "50,000+", label: "Happy Patients" },
    { icon: <Award size={32} />, number: "200+", label: "Expert Doctors" },
    { icon: <Clock size={32} />, number: "15+", label: "Years Experience" },
    { icon: <Shield size={32} />, number: "24/7", label: "Support Available" },
  ];

  return (
    <MainLayout>
      <div className="about-page">
        <section className="about-hero">
          <div className="container">
            <h1 className="about-title">About TechNova</h1>
            <p className="about-subtitle">
              Your trusted healthcare partner, delivering compassionate and
              comprehensive medical care for over a decade.
            </p>
          </div>
        </section>

        <section className="mission-section">
          <div className="container">
            <div className="mission-grid">
              <div className="mission-content">
                <h2 className="section-title">Our Mission</h2>
                <p className="mission-text">
                  At TeachNova, we are dedicated to providing exceptional
                  healthcare services that improve the quality of life for our
                  patients and their families. We believe that everyone deserves
                  access to world-class medical care, delivered with compassion,
                  respect, and professionalism.
                </p>
                <p className="mission-text">
                  Our team of highly qualified medical professionals works
                  together to ensure that each patient receives personalized,
                  evidence-based treatment tailored to their unique needs and
                  circumstances.
                </p>
              </div>
              <div className="mission-image">
                <img src={aboutImg} alt="About Us" />
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
            <h2 className="section-title centered">Our Core Values</h2>
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
            <h2 className="section-title centered">Our Journey</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-year">2010</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Founded</h3>
                  <p className="timeline-text">
                    ClinicCare was founded with a vision to revolutionize
                    healthcare delivery, making quality medical care accessible
                    to all.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2015</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Expansion</h3>
                  <p className="timeline-text">
                    We expanded our services to include specialized departments,
                    offering comprehensive care under one roof.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2020</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Digital Innovation</h3>
                  <p className="timeline-text">
                    Launched our telemedicine platform and online appointment
                    booking system to enhance patient convenience.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2024</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Today</h3>
                  <p className="timeline-text">
                    Continuing to serve thousands of patients annually with
                    state-of-the-art facilities and cutting-edge medical
                    technology.
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
