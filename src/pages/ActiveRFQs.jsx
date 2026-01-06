import React, {useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import axios from 'axios';

export default function ActiveRFQs() {

  //RFQ Form
  //RFQ Form 
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

  const navigate = useNavigate();
    // const location = useLocation();

  const [rfqs, setRfqs] = useState([]);

  const role = localStorage.getItem("role"); // admin | client
  const panel = role === "admin" ? "admin" : "dashboard";
  console.log('rfq:',rfqs)

  React.useEffect(() => {
      if (localStorage.getItem('isLoggedIn') !== 'true') {
        navigate('/', { replace: true });
      }
    }, [navigate])

  useEffect(() => {
    if (role === "admin"){

    axios
      .get("http://127.0.0.1:8000/api/service/admin/rfqs/active/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => setRfqs(res.data))
      .catch((err) => console.error(err));
    }
    if (role === "client"){
      axios
      .get("http://127.0.0.1:8000/api/service/client/rfqs/active/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => setRfqs(res.data))
      .catch((err) => console.error(err));
    }
  }, [role]);

    // const params = new URLSearchParams(location.search);
    // // HashRouter can place the query inside the hash fragment (e.g. #/rfq/id?panel=dashboard)
    // // so also parse window.location.hash as a fallback.
    // const hashParams = (() => {
    //   try {
    //     const h = window && window.location && window.location.hash;
    //     if (!h) return null;
    //     const qi = h.indexOf('?');
    //     if (qi === -1) return null;
    //     return new URLSearchParams(h.substring(qi));
    //   } catch (e) {
    //     return null;
    //   }
    // })();
    // const panel = (location && location.state && location.state.panel)
    //   ? location.state.panel
    //   : (params.get('panel') || (hashParams && hashParams.get('panel')) || 'dashboard');

  function renderAdminSidebar() {
    return (
      <aside className="side-nav">
        <div className="nav-brand">EngiFlow</div>
        <nav>
          <ul>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={()=>navigate('/admin')} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="dashboard" style={{marginRight: '8px'}}>📊</span>Home
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="clients" style={{marginRight: '8px'}}>👤</span>Clients
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="rfqs" style={{marginRight: '8px'}}>📄</span>RFQs
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    );
  }

  function renderDashboardSidebar() {
    return (
      <aside className="side-nav">
        <div className="nav-brand">EngiFlow</div>
        <nav>
          <ul>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={()=>navigate('/dashboard')} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="home" style={{marginRight: '8px'}}>🏠</span>Home
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={() => setShowModal(true)} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="quote" style={{marginRight: '8px'}}>📝</span>Request Quotation
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="report" style={{marginRight: '8px'}}>📊</span>View Reports
              </button>
            </li>
            <li className="dashboard-nav-item">
                  <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}} onClick={() => {/* TODO: Implement action */}}>
                    <span role="img" aria-label="support" style={{marginRight: '8px'}}>💬</span>Contact Support
                  </button>
                </li>
          </ul>
          {/* RFQ Form */}
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
        {/* Logout Logic */}
        <div className="nav-footer">
          <button className="btn" onClick={() => {
            localStorage.removeItem('isLoggedIn');
            navigate('/', { replace: true });
          }}>Sign Out</button>
        </div>
      </aside>
    );
  }

  return (
    <div className="dashboard-layout">
      {role === 'admin' ? renderAdminSidebar() : renderDashboardSidebar()}

      <main className="dashboard-main">
        <header style={{ padding: '28px 24px 0 24px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: 6, fontWeight: 800, color: '#5b4fff' }}>Active RFQs</h1>
          <p style={{ color: '#6b7280', marginBottom: 20 }}>List of currently active requests for quotation.</p>
        </header>

        <div style={{ padding: 24 }}>
          <section className="admin-table-section">
            <div className="admin-table-header">
              <h2>Active RFQs</h2>
              <div className="admin-table-search">
                <input type="text" placeholder="Search RFQs..." />
              </div>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Description</th>
                  <th>Submitted Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {rfqs.map((r, i) => (
                  <tr key={i} style={{ cursor: 'pointer' }} onClick={() => navigate(`/rfq/${r.raw_id}?panel=${role}`, { state: { role } })}>
                    <td>{r.id}</td>
                    <td><b>{r.client}</b></td>
                    <td>{r.description.length > 30 ? r.description.slice(0, 30) + '...' : r.description}</td>
                    <td>{r.date}</td>
                    <td>{r.end_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
}
