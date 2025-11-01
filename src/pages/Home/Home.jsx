import MainLayout from '../../layouts/MainLayout'
import './Home.css'

const Home = () => {
  return (
    <MainLayout>
      <div className="home-page">
        <section className="hero-section">
          <div className="hero-container">
            <h1 className="hero-title">
              Welcome to <span className="text-primary">ClinicCare</span>
            </h1>
            <p className="hero-subtitle">
              Your trusted healthcare partner for quality medical services
            </p>
            <div className="hero-actions">
              <a href="/signup" className="btn-primary">
                Get Started
              </a>
              <a href="/doctors" className="btn-secondary">
                Find Doctors
              </a>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

export default Home

