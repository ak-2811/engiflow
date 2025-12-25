import React, { useState } from 'react'
import './Services.css'

const initialStructural = [
  'Structural analysis and design (RCC, steel, composite)',
  'Foundation and substructure design',
  'Seismic and wind load analysis',
  'Structural drawings and detailing',
  'Structural retrofitting and strengthening design',
  'Peer review and structural safety audits',
  'Value engineering and optimization',
]

export default function DashboardServicesStructural(){
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    services: [],
    title: '',
    description: '',
    images: []
  });

  function handleServiceAdd(service) {
    setForm(f => ({ ...f, services: [...f.services, service] }));
  }
  function handleServiceRemove(service) {
    setForm(f => ({ ...f, services: f.services.filter(s => s !== service) }));
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
      <h2 className="section-heading"><span className="bar" /> Structural Engineering Services</h2>
      <div className="cards-grid">
        {initialStructural.map((t, i) => (
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
                    <button type="button" className="chip-remove" onClick={() => handleServiceRemove(service)} aria-label={`Remove ${service}`}>&times;</button>
                  </span>
                ))}
                <div className="chip-options">
                  {initialStructural.filter(s => !form.services.includes(s)).map((s, i) => (
                    <button
                      key={s}
                      type="button"
                      className="chip-option"
                      onClick={() => handleServiceAdd(s)}
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
