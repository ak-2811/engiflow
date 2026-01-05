import React from 'react'
import './Dashboard.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate} from 'react-router-dom'

export default function DashboardHome() {

const [allServices, setAllServices] = useState([])
const [showModal, setShowModal] = useState(false)
const navigate = useNavigate()

const [form, setForm] = useState({
  services: [],
  title: '',
  description: '',
  images: []
})

useEffect(() => {
  const token = localStorage.getItem('access')
  if (!token) return

  axios.get('http://127.0.0.1:8000/api/service/services', {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => {
    // flatten all service_info into one list
    const merged = res.data.flatMap(s => s.service_info)
    setAllServices(merged)
  })
  .catch(err => console.error(err))
}, [])

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

  form.services.forEach(id => {
    formData.append('selected_services', id)
  })

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
    setForm({ services: [], title: '', description: '', images: [] })
  })
  .catch(() => alert('Failed to submit RFQ'))
}


  // 🔹 Dynamic RFQ stats from backend
  const [rfqStats, setRfqStats] = useState({
    pending: 0,
    active: 0
  })

  useEffect(() => {
    const token = localStorage.getItem('access')
    if (!token) return

    axios.get('http://127.0.0.1:8000/api/service/rfq-stats/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setRfqStats({
        pending: res.data.pending_rfqs,
        active: res.data.active_rfqs
      })
    })
    .catch(err => console.error(err))
  }, [])


const stats = [
  { title: 'Total Projects', value: '24', note: '+12% this month', icon: '📁' },
  { title: 'Active RFQs', value: rfqStats.active, note: '+3 this week', icon: '💬' },
  { title: 'Quotations Sent', value: '42', note: '+5 this week', icon: '✅' },
]

const activities = [
  { id: 1, title: 'Project PQR-2024-001', subtitle: 'Civil Engineering - Site Investigation', time: '2 hours ago', icon: '📄' },
  { id: 2, title: 'RFQ #845', subtitle: 'Structural Analysis and Design', time: '5 hours ago', icon: '💬' },
  { id: 3, title: 'Quotation sent - QTN-0042', subtitle: 'Road & Drainage Design', time: '1 day ago', icon: '✅' },
]

  return (
    <div className="dashboard-content">
      <section className="stats-grid">
        {stats.map((s, i) => (
          <div
                className="stat-card"
                key={i}
                style={{ cursor: s.title === 'Active RFQs' ? 'pointer' : 'default' }}
                onClick={() => {
                  if (s.title === 'Active RFQs') {
                    navigate('/rfqs?panel=client');
                  }
                }}
              >
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-body">
              <div className="stat-note">{s.note}</div>
              <div className="stat-title">{s.title}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="main-grid">
        <div className="recent-column">
          <h3 className="section-label">Recent Activities</h3>
          <div className="activities-list">
            {activities.map(a => (
              <div className="activity-item" key={a.id}>
                <div className="activity-icon">{a.icon}</div>
                <div className="activity-body">
                  <div className="activity-title">{a.title}</div>
                  <div className="activity-sub">{a.subtitle}</div>
                </div>
                <div className="activity-time">{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        <aside className="summary-column">
          <div className="summary-card">
            <h4>Quick Summary</h4>
            <div className="summary-row"><span>Active Projects</span><strong>12</strong></div>
            <div className="summary-row"><span>Pending RFQs</span><strong>{rfqStats.pending}</strong></div>
            <div className="summary-row"><span>Total Budget</span><strong>$245K</strong></div>
            <div className="summary-row"><span>Completion Rate</span><strong className="success">92%</strong></div>
          </div>

          {/* <div className="summary-card quick-actions-card">
            <h4>Quick Actions</h4>
            <div className="actions-list">
              <button className="action-btn" onClick={() => setShowModal(true)}>
                <span>Request Quotation</span>
                <span className="arrow">→</span>
              </button>
              <button className="action-btn">
                <span>View Reports</span>
                <span className="arrow">→</span>
              </button>
              <button className="action-btn">
                <span>Contact Support</span>
                <span className="arrow">→</span>
              </button>
            </div>
          </div> */}
        </aside>
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Request for Quotation</h3>

              <form onSubmit={handleSubmit}>
                <label>Services</label>

                <div className="chips-selector">
                  {form.services.map(id => {
                    const svc = allServices.find(s => s.id === id)
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

                  <div className="chip-options">
                    {allServices
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
                  <input name="title" value={form.title} onChange={handleInputChange} required />
                </label>

                <label>
                  Description
                  <textarea name="description" value={form.description} onChange={handleInputChange} required />
                </label>

                <label>
                  Images
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                </label>

                <div className="modal-actions">
                  <button type="submit" className="btn primary">Submit</button>
                  <button type="button" className="btn" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </section>
    </div>
  )
}
