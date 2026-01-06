import React from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useEffect, useState} from 'react'
import axios from 'axios'

export default function RFQDetail() {
  const { id } = useParams();
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
  // Example data, replace with real data or props as needed
  const [rfq, setRfq] = useState(null)
  const navigate=useNavigate()

  React.useEffect(() => {
      if (localStorage.getItem('isLoggedIn') !== 'true') {
        navigate('/', { replace: true });
      }
    }, [navigate]);

  // Comment state
  const [comments, setComments] = useState([
    { user: 'Admin', text: 'Please review the attached documents.', image: null },
    { user: 'Project Manager', text: 'Documents received, will update soon.', image: null },
  ]);
  const [commentText, setCommentText] = useState('');
  const [commentFile, setCommentFile] = useState(null);
  const [commentFileUrl, setCommentFileUrl] = useState(null);
  const role = localStorage.getItem('role')
  const isAdmin= role === 'admin'
  useEffect(() => {
  const token = localStorage.getItem('access')
  if (!token) return

  axios.get(`http://127.0.0.1:8000/api/service/admin/rfqs/${id}/`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => setRfq(res.data))
  .catch(err => console.error(err))
}, [id])

  if (!rfq) return <div style={{ padding: 40 }}>Loading RFQ...</div>


  function handleCommentSubmit(e) {
    e.preventDefault();
    if (!commentText && !commentFile) return;
    setComments([
      ...comments,
      {
        user: 'You',
        text: commentText,
        attachment: commentFile
          ? {
              name: commentFile.name,
              url: commentFileUrl,
              type: commentFile.type
            }
          : null
      }
    ]);
    setCommentText('');
    setCommentFile(null);
    setCommentFileUrl(null);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setCommentFile(file);
      setCommentFileUrl(URL.createObjectURL(file));
    }
  }
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
               <span role="img" aria-label="clients" style={{marginRight: '8px'}}>📝</span>Request Quotation
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                 <span role="img" aria-label="rfqs" style={{marginRight: '8px'}}>📊</span>View Reports
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
    <div className="rfq-detail-layout">
      {role==='admin'?renderAdminSidebar():renderDashboardSidebar()}
      <div style={{flex: 1,width: '100%',padding: '0 32px',textAlign: 'left'}}>
        <div style={{ marginBottom: '18px', color: '#757575', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.1em', cursor: 'pointer' }} onClick={() => navigate(`/admin/rfqs?panel=${role}`, { state: { role } })}>&larr;</span> Back to RFQ Listings
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
          <span style={{ background: '#ede9fe', color: '#6366f1', fontWeight: 600, borderRadius: 8, padding: '4px 16px', fontSize: '1.05rem', letterSpacing: 1 }}>{rfq.id}</span>
          <span style={{ background: '#fff7d6', color: '#bfa100', fontWeight: 600, borderRadius: 8, padding: '4px 14px', fontSize: '1.05rem' }}>{rfq.status}</span>
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, margin: '0 0 18px 0' }}>{rfq.title}</h1>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <span style={{ background: '#f4f4ff', color: '#5b4fff', borderRadius: 20, padding: '7px 18px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="client">👤</span> {rfq.client}
          </span>

          <span style={{ background: '#f4f4ff', color: '#5b4fff', borderRadius: 14, padding: '8px 12px', fontWeight: 500, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600, letterSpacing: 0.2 }}>Submitted Date</span>
            <span style={{ fontSize: '0.98rem', color: '#5b4fff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span role="img" aria-label="submitted-date">📅</span>
              {rfq.date}
            </span>
          </span>
          
          <span style={{ background: '#fff7f0', color: '#b85b00', borderRadius: 14, padding: '8px 12px', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: '0.78rem', color: '#9a7a60', fontWeight: 600, letterSpacing: 0.2 }}>End Date</span>
            <span style={{ fontSize: '0.98rem', color: '#b85b00', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span role="img" aria-label="end-date">⏳</span>
              {rfq.end_date}
            </span>
          </span>

        </div>

        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px 0 rgba(80,80,120,0.06)', padding: '28px 32px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ background: '#ede9fe', color: '#5b4fff', borderRadius: 8, padding: '6px 10px', fontSize: '1.3rem', display: 'flex', alignItems: 'center' }}>📄</span>
            <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>Project Description</span>
          </div>
          <div style={{ color: '#444', fontSize: '1.13rem', lineHeight: 1.7 }}>{rfq.overview}</div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ background: '#ede9fe', color: '#5b4fff', borderRadius: 8, padding: '6px 10px', fontSize: '1.3rem', display: 'flex', alignItems: 'center' }}>🖼️</span>
            <span style={{ fontWeight: 700, fontSize: '1.15rem' }}>Submitted Image</span>
            <span style={{ background: '#f4f4ff', color: '#757575', borderRadius: 8, padding: '4px 12px', fontSize: '1rem', marginLeft: 8 }}>{rfq.attachments.length} Attachments</span>
          </div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {rfq.attachments.map((doc, i) => (
              <div key={i} style={{ background: '#f9f9ff', borderRadius: 12, padding: '18px 22px', minWidth: 180, fontSize: '1.05rem', color: '#444', display: 'flex', alignItems: 'center', gap: 8 }}>
                <a href={doc.url} target="_blank" rel="noreferrer">
                  image
                </a>
              </div>
            ))}
          </div>
        </div>
        {/* Comment Section - place after main content, below images/docs */}
        <div style={{width: '100%', maxWidth: 800, margin: '48px auto 0 auto', textAlign:'center'}}>
          <div style={{background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px 0 rgba(80,80,120,0.06)', padding: '28px 32px'}}>
            <div style={{fontWeight: 700, fontSize: '1.18rem', marginBottom: 18}}>Comments</div>
            <div style={{marginBottom: 18}}>
              {comments.map((c, i) => (
                <div key={i} style={{marginBottom: 14}}>
                  <span style={{fontWeight: 600, color: c.user === 'Admin' ? '#5b4fff' : c.user === 'Project Manager' ? '#1dbf73' : '#18181b'}}>{c.user}:</span> {c.text}
                  {c.attachment && c.attachment.type.startsWith('image') && (
                    <img src={c.attachment.url} alt="comment attachment" style={{marginLeft: 10, maxHeight: 40, borderRadius: 6, verticalAlign: 'middle'}} />
                  )}
                  {c.attachment && c.attachment.type === 'application/pdf' && (
                    <a href={c.attachment.url} target="_blank" rel="noopener noreferrer" style={{marginLeft: 10, color: '#5b4fff', textDecoration: 'underline', fontSize: '0.98em'}}>
                      <span role="img" aria-label="pdf">📄</span> {c.attachment.name}
                    </a>
                  )}
                </div>
              ))}
            </div>
            <form style={{display: 'flex', gap: 12, alignItems: 'flex-end'}} onSubmit={handleCommentSubmit}>
              <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." style={{flex: 1, borderRadius: 8, border: '1.5px solid #e0e7ff', padding: 12, fontSize: '1.05rem', resize: 'vertical', minHeight: 38}} />
              <label htmlFor="comment-attach" style={{cursor: 'pointer', display: 'flex', alignItems: 'center', marginRight: 8}} title="Attach file">
                <svg width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
                  <path d="M7.5 12.5L14.5 5.5M14.5 5.5V10.5M14.5 5.5H9.5" stroke="#5b4fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3.5" y="3.5" width="15" height="15" rx="4.5" stroke="#5b4fff" strokeWidth="2"/>
                </svg>
                <input id="comment-attach" type="file" accept="image/*,application/pdf" onChange={handleFileChange} style={{display: 'none'}} />
              </label>
              <button type="submit" style={{background: '#5b4fff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer'}}>Post</button>
            </form>
          </div>
        </div>
      </div>
      {isAdmin &&(
        <div style={{ flex: 1, maxWidth: 340 }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px 0 rgba(80,80,120,0.06)', padding: '32px 28px', marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: 18 }}>Assign RFQ</div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 500, color: '#757575', fontSize: '1.08rem', display: 'block', marginBottom: 8 }}>Assign to Project Manager:</label>
              <select style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px solid #e0e7ff', fontSize: '1.05rem', marginBottom: 12 }}>
                <option>Select Project Manager</option>
                <option>John Doe</option>
                <option>Jane Smith</option>
              </select>
              <button style={{ background: '#5b4fff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', width: '100%' }}>Assign to Project Manager</button>
            </div>
            {/* <div style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 500, color: '#757575', fontSize: '1.08rem', display: 'block', marginBottom: 8 }}>Assign to Sub Contractor:</label>
              <select style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px solid #e0e7ff', fontSize: '1.05rem', marginBottom: 12 }}>
                <option>Select Sub Contractor</option>
                <option>ABC Constructions</option>
                <option>XYZ Subcontractors</option>
              </select>
              <button style={{ background: '#5b4fff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', width: '100%' }}>Assign to Sub Contractor</button>
            </div> */}
          </div>
        </div>)}
    </div>
  );
}
