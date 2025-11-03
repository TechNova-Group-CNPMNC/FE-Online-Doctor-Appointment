import { Link } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'
import headerImg from '../../assets/header_img.png'
import './Home.css'

const Home = () => {
  const features = [
    {
      title: 'Find Doctors',
      description: 'Book your appointment with the best doctors '
    },
    {
      title: 'Easy Booking',
      description: 'Schedule your appointments with just a few clicks'
    },
    {
      title: 'Health Records',
      description: 'Keep track of your medical history and records'
    }
  ]



  const testimonials = [
    {
      name: 'John Smith',
      role: 'Patient',
      comment: 'Excellent service! The platform made it so easy to find and book appointments with my doctor.',
      rating: 5
    },
    {
      name: 'Maria Garcia',
      role: 'Patient',
      comment: 'Professional doctors and seamless booking experience. Highly recommended!',
      rating: 5
    },
    {
      name: 'David Lee',
      role: 'Patient',
      comment: 'Convenient online consultation saved me time and money. Great platform!',
      rating: 5
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Create Account',
      description: 'Sign up in less than a minute'
    },
    {
      number: '2',
      title: 'Find Doctor',
      description: 'Search by specialty or name'
    },
    {
      number: '3',
      title: 'Book Appointment',
      description: 'Choose date and time slot'
    },
    {
      number: '4',
      title: 'Visit or Consult',
      description: 'Meet your doctor in-person or online'
    }
  ]

  return (
    <MainLayout>
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="hero-title">
                Your Health is Our <span className="text-primary">Priority</span>
              </h1>
              <p className="hero-subtitle">
                Book appointments with top-rated doctors. Get the care you deserve,
                when you need it most.
              </p>
              <div className="hero-actions">
                <Link to="/appointment" className="btn-primary">
                  Book Appointment
                </Link>
                <Link to="/find-doctor" className="btn-secondary">
                  Find Doctors
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="doctor-image">
                <img src={headerImg} alt="Doctor" />
              </div>

            </div>
          </div>
        </section>
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Why Choose Us?</h2>
              <p className="section-subtitle">
                We provide comprehensive healthcare solutions for all your medical needs
              </p>
            </div>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
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
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle">
                Get started in just 4 simple steps
              </p>
            </div>
            <div className="steps-grid">
              {steps.map((step, index) => (
                <div key={index} className="step-card">
                  <div className="step-number">{step.number}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">What Our Patients Say</h2>
              <p className="section-subtitle">
                Real feedback from our satisfied patients
              </p>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-rating">
                    {'⭐'.repeat(testimonial.rating)}
                  </div>
                  <p className="testimonial-comment">"{testimonial.comment}"</p>
                  <div className="testimonial-author">
                    <div className="author-info">
                      <h4 className="author-name">{testimonial.name}</h4>
                      <p className="author-role">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-subtitle">
              Join thousands of satisfied patients who trust us with their health
            </p>
            <div className="cta-actions">
              <Link to="/signup" className="btn-primary-large">
                Get Started Today
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

export default Home
