import React, { useState } from 'react'
import './Services.css'

const initialCivil = [
  'Site investigation and feasibility studies',
  'Earthwork, excavation, and grading planning',
  'Concrete works (PCC, RCC, foundations)',
  'Road, pavement, and drainage design',
  'Water supply, sewerage, and stormwater systems',
  'Quantity estimation and BOQ preparation',
  'Construction supervision and quality control',
]

export default function DashboardServicesCivil(){
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    services: [],
    title: '',
    description: '',
    images: []
  });

  function handleServiceChange(e) {
    const options = Array.from(e.target.selectedOptions, opt => opt.value);
    setForm(f => ({ ...f, services: options }));
  }
  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }
  function handleImageChange(e) {
    setForm(f => ({ ...f, images: Array.from(e.target.files) }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    // Submit logic here
    setShowModal(false);
  }

  return (
    <div className="services-content">
      <h2 className="section-heading"><span className="bar" /> Civil Engineering Services</h2>
      <div className="cards-grid">
        {initialCivil.map((t, i) => (
          <article key={i} className="service-card">
            <div>
              <p className="card-text">{t}</p>
            </div>
          </article>
        ))}
      </div>
      <button className="btn quotation-btn" onClick={() => setShowModal(true)}>
        Request for Quotation
      </button>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Request for Quotation</h3>
            <form onSubmit={handleSubmit}>
              <label>Services</label>
              <div className="chips-selector">
                {form.services.map((service, idx) => (
                  <span key={service} className="chip">
                    {service}
                    <button type="button" className="chip-remove" onClick={() => setForm(f => ({ ...f, services: f.services.filter(s => s !== service) }))} aria-label={`Remove ${service}`}>&times;</button>
                  </span>
                ))}
                <div className="chip-options">
                  {initialCivil.filter(s => !form.services.includes(s)).map((s, i) => (
                    <button
                      key={s}
                      type="button"
                      className="chip-option"
                      onClick={() => setForm(f => ({ ...f, services: [...f.services, s] }))}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <label>Title
                <input name="title" value={form.title} onChange={handleInputChange} required />
              </label>
              <label>Description
                <textarea name="description" value={form.description} onChange={handleInputChange} required />
              </label>
              <label>Images
                <input type="file" multiple accept="image/*" onChange={handleImageChange} />
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn primary">Submit</button>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
