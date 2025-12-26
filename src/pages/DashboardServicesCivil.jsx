import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Services.css'

export default function DashboardServicesCivil() {
  const [civilServices, setCivilServices] = useState([])
  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    services: [],        // store Service_Info IDs
    title: '',
    description: '',
    images: []
  })

  /* ===============================
     Fetch Civil services
     =============================== */
  useEffect(() => {
    const token = localStorage.getItem('access')
    if (!token) return

    axios.get('http://127.0.0.1:8000/api/service/services', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const civil = res.data.find(s => s.name === 'Civil Services')
      if (civil) {
        setCivilServices(civil.service_info)
      }
    })
    .catch(err => {
      console.error('Failed to load civil services', err)
    })
  }, [])

  /* ===============================
     Handlers
     =============================== */
  function handleInputChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function handleImageChange(e) {
    setForm(f => ({ ...f, images: Array.from(e.target.files) }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    const token = localStorage.getItem('access')
    if (!token) {
      alert('Please login again')
      return
    }

    const formData = new FormData()
    formData.append('service_name', form.title)
    formData.append('description', form.description)

    // selected services (Service_Info IDs)
    form.services.forEach(id => {
      formData.append('selected_services', id)
    })

    // images
    form.images.forEach(img => {
      formData.append('images', img)
    })

    axios.post(
      'http://127.0.0.1:8000/api/service/custom-request/',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    .then(() => {
      alert('Request for Quotation submitted successfully')
      setShowModal(false)
      setForm({
        services: [],
        title: '',
        description: '',
        images: []
      })
    })
    .catch(err => {
      console.error(err)
      alert('Failed to submit RFQ')
    })
  }

  /* ===============================
     UI
     =============================== */
  return (
    <div className="services-content">
      <h2 className="section-heading">
        <span className="bar" /> Civil Engineering Services
      </h2>

      {/* Service cards */}
      <div className="cards-grid">
        {civilServices.map(service => (
          <article key={service.id} className="service-card">
            <div>
              <p className="card-text">{service.name}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Request button */}
      <div className="request-row">
        <button
          className="btn quotation-btn"
          onClick={() => setShowModal(true)}
        >
          Request for Quotation
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Request for Quotation</h3>

            <form onSubmit={handleSubmit}>
              <label>Services</label>

              {/* Selected services chips */}
              <div className="chips-selector">
                {form.services.map(id => {
                  const svc = civilServices.find(s => s.id === id)
                  return (
                    <span key={id} className="chip">
                      {svc?.name}
                      <button
                        type="button"
                        className="chip-remove"
                        onClick={() =>
                          setForm(f => ({
                            ...f,
                            services: f.services.filter(s => s !== id)
                          }))
                        }
                      >
                        ×
                      </button>
                    </span>
                  )
                })}

                {/* Available services */}
                <div className="chip-options">
                  {civilServices
                    .filter(s => !form.services.includes(s.id))
                    .map(s => (
                      <button
                        key={s.id}
                        type="button"
                        className="chip-option"
                        onClick={() =>
                          setForm(f => ({
                            ...f,
                            services: [...f.services, s.id]
                          }))
                        }
                      >
                        {s.name}
                      </button>
                    ))}
                </div>
              </div>

              <label>
                Title
                <input
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Images
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>

              <div className="modal-actions">
                <button type="submit" className="btn primary">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  )
}
