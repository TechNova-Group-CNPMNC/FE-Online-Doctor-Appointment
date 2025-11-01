import { useState } from 'react'
import './FindADoctor.css'

const FindADoctor = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedName, setSelectedName] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')

  const doctors = [
    {
      id: 1,
      name: 'Patrik Cortez',
      specialty: 'Cardiologist',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Maria Rodriguez',
      specialty: 'Dermatologist',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'John Smith',
      specialty: 'Neurologist',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      specialty: 'Cardiologist',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1594824804732-5f0fb3d4fe40?w=200&h=200&fit=crop&crop=face'
    },
    {
      id: 5,
      name: 'Michael Brown',
      specialty: 'Orthopedist',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=200&h=200&fit=crop&crop=face'
    },
    {
      id: 6,
      name: 'Emily Davis',
      specialty: 'Gastroenterologist',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1594824804732-5f0fb3d4fe40?w=200&h=200&fit=crop&crop=face'
    },
    {
      id: 7,
      name: 'David Miller',
      specialty: 'Psychiatrist',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face'
    },
    {
      id: 8,
      name: 'Lisa Anderson',
      specialty: 'Ophthalmologist',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face'
    },
    {
      id: 9,
      name: 'Robert Taylor',
      specialty: 'Cardiologist',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face'
    },
    {
      id: 10,
      name: 'Jennifer White',
      specialty: 'Dermatologist',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1594824804732-5f0fb3d4fe40?w=200&h=200&fit=crop&crop=face'
    },
    {
      id: 11,
      name: 'James Johnson',
      specialty: 'Neurologist',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=200&h=200&fit=crop&crop=face'
    },
    {
      id: 12,
      name: 'Amanda Garcia',
      specialty: 'Cardiologist',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1594824804732-5f0fb3d4fe40?w=200&h=200&fit=crop&crop=face'
    }
  ]

  const timeSlots = [
    '07:00 - 08:00',
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
    '18:00 - 19:00',
    '19:00 - 20:00',
    '20:00 - 21:00'
  ]

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ]

  const handleSearch = () => {
    console.log('Search with:', {
      specialty: selectedSpecialty,
      name: selectedName,
      day: selectedDay,
      timeSlot: selectedTimeSlot
    })
  }

  const isDisabled = !selectedSpecialty

  return (
    <div className="find-doctor-page">
      <div className="container">
        <div className="search-section">
          <h1>Find A Doctor</h1>
          <div className="search-form">
            <div className="form-group">
              <select
                className="form-select"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">Speciality</option>
                <option value="cardiologist">Cardiologist</option>
                <option value="dermatologist">Dermatologist</option>
                <option value="neurologist">Neurologist</option>
                <option value="orthopedist">Orthopedist</option>
                <option value="gastroenterologist">Gastroenterologist</option>
                <option value="psychiatrist">Psychiatrist</option>
                <option value="ophthalmologist">Ophthalmologist</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                className="form-input"
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                disabled={isDisabled}
              />
            </div>
            <div className="form-group">
              <select
                className="form-select"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                disabled={isDisabled}
              >
                <option value="">Day</option>
                {days.map((day) => (
                  <option key={day} value={day.toLowerCase()}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <select
                className="form-select"
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                disabled={isDisabled}
              >
                <option value="">Time Slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="search-btn"
              onClick={handleSearch}
              disabled={isDisabled}
            >
              Search
            </button>
          </div>
        </div>

        <div className="doctors-grid">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <div className="card-header">
                <button className="favorite-btn">
                  <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                    <path d="M10 17L8.55 15.7C3.4 11.36 0 8.28 0 4.5C0 1.42 2.42 -1 5.5 -1C7.24 -1 8.91 -0.18 10 1.09C11.09 -0.18 12.76 -1 14.5 -1C17.58 -1 20 1.42 20 4.5C20 8.28 16.6 11.36 11.45 15.7L10 17Z" fill="#E0E0E0"/>
                  </svg>
                </button>
              </div>

              <div className="doctor-image">
                <img src={doctor.image} alt={doctor.name} />
              </div>

              <div className="doctor-info">
                <h3 className="doctor-name">{doctor.name}</h3>
                <p className="doctor-specialty">{doctor.specialty}</p>

                <div className="rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="14" height="13" viewBox="0 0 14 13" fill="none">
                        <path d="M7 0L8.5716 4.83688H13.6574L9.5429 7.82624L11.1145 12.6631L7 9.67376L2.8855 12.6631L4.4571 7.82624L0.342604 4.83688H5.4284L7 0Z" fill="#FFD700"/>
                      </svg>
                    ))}
                  </div>
                  <span className="rating-text">{doctor.rating} ({doctor.reviews} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FindADoctor