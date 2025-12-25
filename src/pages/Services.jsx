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

const initialStructural = [
  'Structural analysis and design (RCC, steel, composite)',
  'Foundation and substructure design',
  'Seismic and wind load analysis',
  'Structural drawings and detailing',
  'Structural retrofitting and strengthening design',
  'Peer review and structural safety audits',
  'Value engineering and optimization',
]

function CheckIcon({ checked }) {
  if (checked) {
    return (
      <svg className="check-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="12" cy="12" r="12" fill="var(--accent)" />
        <path d="M7.5 12.5l2.5 2.5L16.5 9.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg className="check-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="12" cy="12" r="10.5" stroke="rgba(99,102,241,0.36)" strokeWidth="2" fill="transparent" />
    </svg>
  )
}

export default function Services() {
  // convert initial arrays into objects with ids so we can add custom services
  const [civil, setCivil] = useState(() => initialCivil.map((t, i) => ({ id: `civil-${i}`, title: t })))
  const [structural, setStructural] = useState(() => initialStructural.map((t, i) => ({ id: `struct-${i}`, title: t })))

  const [selected, setSelected] = useState(new Set())
  const [showAdd, setShowAdd] = useState({ open: false, section: null })
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newImage, setNewImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  function toggle(serviceId) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(serviceId)) next.delete(serviceId)
      else next.add(serviceId)
      return next
    })
  }

  function handleKeyToggle(e, service) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle(service)
    }
  }

  function requestQuotation() {
    if (selected.size === 0) {
      alert('Please select at least one service to request a quotation.')
      return
    }
    // resolve titles from ids
    const all = [...civil, ...structural]
    const items = Array.from(selected)
      .map((id, i) => {
        const found = all.find(s => s.id === id)
        return `${i + 1}. ${found ? found.title : id}`
      })
      .join('\n')
    const subject = encodeURIComponent('Request for Quotation - EngiFlow Services')
    const body = encodeURIComponent(`Hello,%0D%0A%0D%0AI would like to request a quotation for the following services:%0D%0A%0D%0A${items}%0D%0A%0D%0ARegards,`)
    // open user's mail client with prefilled subject and body
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  function openAdd(section) {
    setShowAdd({ open: true, section })
    setNewTitle('')
    setNewDesc('')
    setNewImage(null)
    setPreviewUrl(null)
  }

  function handleImage(e) {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    setNewImage(f)
    const url = URL.createObjectURL(f)
    setPreviewUrl(url)
  }

  function addCustom() {
    if (!newTitle.trim()) {
      alert('Please enter a title for the service')
      return
    }
    const id = `${showAdd.section}-${Date.now()}`
    const svc = { id, title: newTitle.trim(), description: newDesc.trim() }
    if (previewUrl) svc.imageUrl = previewUrl
    if (showAdd.section === 'civil') setCivil(prev => [...prev, svc])
    else setStructural(prev => [...prev, svc])
    // select the newly added service by default
    setSelected(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })

    // close modal and clean up preview URL
    closeAdd()
  }

  function closeAdd() {
    setShowAdd({ open: false, section: null })
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  return (
    <div className="services-bg">
      <main className="services-page">
      <header className="services-hero">
        <h1 className="services-title">Our <span>Services</span></h1>
        <p className="services-lead">Comprehensive engineering solutions tailored to meet your project needs. From civil infrastructure to structural design, we deliver excellence.</p>
      </header>

      <section className="services-section">
        <h2 className="section-heading"><span className="bar" /> Civil Engineering Services</h2>

        <div className="cards-grid">
          {civil.map((s) => {
            const isSelected = selected.has(s.id)
            return (
              <article
                className={`service-card ${isSelected ? 'selected' : ''}`}
                key={s.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => toggle(s.id)}
                onKeyDown={e => handleKeyToggle(e, s.id)}
              >
                <div className="icon-wrap"><CheckIcon checked={isSelected} /></div>
                <div>
                  <p className="card-text">{s.title}</p>
                  {s.description && <div className="card-desc">{s.description}</div>}
                </div>
              </article>
            )
          })}

          <div className="add-card" onClick={() => openAdd('civil')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && openAdd('civil')}>
            + Add Custom Service
          </div>
        </div>
      </section>

      <section className="services-section">
        <h2 className="section-heading"><span className="bar" /> Structural Engineering Services</h2>

        <div className="cards-grid">
          {structural.map((s) => {
            const isSelected = selected.has(s.id)
            return (
              <article
                className={`service-card ${isSelected ? 'selected' : ''}`}
                key={s.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => toggle(s.id)}
                onKeyDown={e => handleKeyToggle(e, s.id)}
              >
                <div className="icon-wrap"><CheckIcon checked={isSelected} /></div>
                <div>
                  <p className="card-text">{s.title}</p>
                  {s.description && <div className="card-desc">{s.description}</div>}
                </div>
              </article>
            )
          })}

          <div className="add-card" onClick={() => openAdd('structural')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && openAdd('structural')}>
            + Add Custom Service
          </div>
        </div>
      </section>

  <section className="rfq-panel">
        <div className="rfq-content">
          <h3 className="rfq-heading">Ready to start your project?</h3>
          <p className="rfq-sub">You have selected {selected.size} service{selected.size !== 1 ? 's' : ''}. Click below to proceed with your quotation request.</p>

          <div className="rfq-box">
            <div className="rfq-box-title">Selected Services:</div>
            <div className="rfq-pills">
              {Array.from(selected).length === 0 && <span className="rfq-empty">No services selected</span>}
              {Array.from(selected).map((id) => {
                const all = [...civil, ...structural]
                const found = all.find(x => x.id === id)
                const label = found ? found.title : id
                return <span className="rfq-pill" key={id}>{label}</span>
              })}
            </div>
          </div>

          <div className="rfq-actions">
            <button className="request-btn" onClick={requestQuotation}>Request for Quotation</button>
          </div>
        </div>
      </section>
        {showAdd.open && (
          <div className="modal-overlay" onClick={closeAdd}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={closeAdd} aria-label="Close">×</button>
              <div className="modal-header">
                <h3>Add Custom {showAdd.section === 'civil' ? 'Civil' : 'Structural'} Service</h3>
                <p className="modal-sub">Add a custom service with an image and description</p>
              </div>

              <div className="modal-body">
                <label className="field">
                  <div className="field-label">Service Title</div>
                  <input className="field-input" placeholder="Enter service title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                </label>

                <label className="field">
                  <div className="field-label">Description</div>
                  <textarea className="field-textarea" placeholder="Enter service description" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                </label>

                <label className="field">
                  <div className="field-label">Service Image</div>
                  <input className="field-file" type="file" accept="image/*" onChange={handleImage} />
                </label>

                {previewUrl && <div className="image-preview"><img src={previewUrl} alt="preview" /></div>}

                <div className="modal-actions">
                  <button onClick={addCustom} className="add-service-btn">Add Service</button>
                  <button onClick={closeAdd} className="cancel-btn">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
