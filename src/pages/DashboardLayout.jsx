import React from 'react'
import { NavLink, Outlet, useNavigate} from 'react-router-dom'
import './Dashboard.css'
import { useEffect, useState } from 'react'
import axios from 'axios'


export default function DashboardLayout() {
const [allServices, setAllServices] = useState([])
const [showModal, setShowModal] = useState(false)

const [form, setForm] = useState({
  services: [],
  title: '',
  description: '',
  end_date: '',
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
  formData.append('end_date', form.end_date)

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
  const navigate = useNavigate()
  const first_name=localStorage.getItem('first_name')|| 'CLinet'
  React.useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="dashboard-layout">
      <aside className="side-nav">
        <div className="nav-brand">EngiFlow</div>
        <nav>
          <ul>
              {/* <li><NavLink to="/dashboard" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}><span role="img" aria-label="home" style={{marginRight: '8px'}}>🏠</span>Home</NavLink></li> */}
              <li className="dashboard-nav-item">
                  <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}} onClick={() => {navigate('/dashboard')}}>
                    <span role="img" aria-label="quote" style={{marginRight: '8px'}}>🏠</span>Home
                  </button>
                </li>
                <li className="dashboard-nav-item">
                  <button className="nav-link" onClick={() => setShowModal(true)} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}} >
                    <span role="img" aria-label="quote" style={{marginRight: '8px'}}>📝</span>Request Quotation
                  </button>
                </li>
                <li className="dashboard-nav-item">
                  <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}} onClick={() => {/* TODO: Implement action */}}>
                    <span role="img" aria-label="report" style={{marginRight: '8px'}}>📊</span>View Reports
                  </button>
                </li>
                <li className="dashboard-nav-item">
                  <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}} onClick={() => {/* TODO: Implement action */}}>
                    <span role="img" aria-label="support" style={{marginRight: '8px'}}>💬</span>Contact Support
                  </button>
                </li>
          </ul>
          {showModal && (
          <div className="modal-overlay" style={{position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999}}>
            <div className="modal-content" style={{width: '92%', maxWidth: 1100, background: '#fff', borderRadius: 14, padding: 28, boxShadow: '0 20px 60px rgba(15,23,42,0.25)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18}}>
                <h2 style={{margin: 0, color: '#4f46e5'}}>Request for Quotation</h2>
              </div>
              
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
                          onClick={() => setForm(f => ({...f,services: f.services.filter(s => s !== id) }))} style={{background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer'}}>
                          ✕
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

                <label style={{display: 'block', fontWeight: 600, color: '#4c1d95', marginBottom: 8}}>
                  Title
                  <input name="title" value={form.title} onChange={handleInputChange} style={{width: '100%', padding: '14px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem'}} required />
                </label>

                <label style={{display: 'block', fontWeight: 600, color: '#4c1d95', marginBottom: 8}}>
                  Description
                  <textarea name="description" value={form.description} onChange={handleInputChange} style={{width: '100%', padding: '14px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem', minHeight: 120}} required />
                </label>

                <label style={{display: 'block', fontWeight: 600, color: '#4c1d95', marginBottom: 8}}>
                  Images
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{width: '100%', padding: '12px', borderRadius: 8, border: '1.5px solid #e6e9ff', background: '#fafbff'}} />
                </label>
                <label style={{display: 'block', fontWeight: 600, color: '#4c1d95', marginBottom: 8}}>
                End Date
                <input type="date" name="end_date" value={form.end_date} onChange={handleInputChange} style={{width: '100%', padding: '12px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem'}} required />
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

        </nav>
        <div className="nav-footer">
          <button className="btn" onClick={() => {
            localStorage.removeItem('isLoggedIn');
            navigate('/', { replace: true });
          }}>Sign Out</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1 className="welcome">Welcome back, <span>{first_name}</span></h1>
            <p className="lead">Here's your project overview and activity</p>
          </div>

          <div className="header-actions">
            {/* <button className="btn primary">+ New Project</button> */}
            {/* <button className="btn secondary" onClick={() => { navigate('/dashboard/civil') }}>View Services</button> */}
          </div>
        </header>

        <div className="dashboard-outlet">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
