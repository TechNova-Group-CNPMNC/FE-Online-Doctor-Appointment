import MainLayout from '../../layouts/MainLayout'
import './About.css'

const About = () => {
  const values = [
    {
      icon: '❤️',
      title: 'Compassionate Care',
      description: 'We treat every patient with empathy and respect, ensuring their comfort is our top priority.'
    },
    {
      icon: '🎯',
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from diagnosis to treatment and follow-up care.'
    },
    {
      icon: '🤝',
      title: 'Trust & Integrity',
      description: 'We build lasting relationships based on trust, transparency, and ethical medical practices.'
    },
    {
      icon: '🔬',
      title: 'Innovation',
      description: 'We embrace cutting-edge technology and medical advances to provide the best care possible.'
    }
  ]

  const stats = [
    { number: '50,000+', label: 'Happy Patients' },
    { number: '200+', label: 'Expert Doctors' },
    { number: '15+', label: 'Years Experience' },
    { number: '24/7', label: 'Support Available' }
  ]

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Medical Officer',
      image: '👩‍⚕️',
      bio: 'With over 20 years of experience in healthcare administration and patient care.'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Lead Cardiologist',
      image: '👨‍⚕️',
      bio: 'Renowned cardiac surgeon with expertise in minimally invasive procedures.'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Pediatric Specialist',
      image: '👩‍⚕️',
      bio: 'Dedicated to providing compassionate care for children and their families.'
    },
    {
      name: 'Dr. James Wilson',
      role: 'Orthopedic Surgeon',
      image: '👨‍⚕️',
      bio: 'Specializes in sports medicine and joint replacement surgeries.'
    }
  ]

  return (
    <MainLayout>
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <h1 className="about-title">About TeachNova</h1>
            <p className="about-subtitle">
              Your trusted healthcare partner, delivering compassionate and comprehensive medical care for over a decade.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container">
            <div className="mission-grid">
              <div className="mission-content">
                <h2 className="section-title">Our Mission</h2>
                <p className="mission-text">
                  At TeachNova, we are dedicated to providing exceptional healthcare services that improve the quality of life for our patients and their families. We believe that everyone deserves access to world-class medical care, delivered with compassion, respect, and professionalism.
                </p>
                <p className="mission-text">
                  Our team of highly qualified medical professionals works together to ensure that each patient receives personalized, evidence-based treatment tailored to their unique needs and circumstances.
                </p>
              </div>
              <div className="mission-image">
                <div className="image-placeholder">
                  🏥
                  <span>Our Modern Facility</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
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

        {/* Values Section */}
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

        {/* Team Section */}
        <section className="team-section">
          <div className="container">
            <h2 className="section-title centered">Meet Our Leadership Team</h2>
            <div className="team-grid">
              {team.map((member, index) => (
                <div key={index} className="team-card">
                  <div className="team-avatar">{member.image}</div>
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
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
                    ClinicCare was founded with a vision to revolutionize healthcare delivery, making quality medical care accessible to all.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2015</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Expansion</h3>
                  <p className="timeline-text">
                    We expanded our services to include specialized departments, offering comprehensive care under one roof.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2020</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Digital Innovation</h3>
                  <p className="timeline-text">
                    Launched our telemedicine platform and online appointment booking system to enhance patient convenience.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2024</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Today</h3>
                  <p className="timeline-text">
                    Continuing to serve thousands of patients annually with state-of-the-art facilities and cutting-edge medical technology.
                  </p>
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

