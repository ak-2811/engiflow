import React from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useEffect, useState} from 'react'
import axios from 'axios'

export default function RFQDetail() {
  const { id } = useParams();
  // Example data, replace with real data or props as needed
  const [rfq, setRfq] = useState(null)
  const navigate=useNavigate()

  // Comment state
  const [comments, setComments] = useState([
    { user: 'Admin', text: 'Please review the attached documents.', image: null },
    { user: 'Project Manager', text: 'Documents received, will update soon.', image: null },
  ]);
  const [commentText, setCommentText] = useState('');
  const [commentFile, setCommentFile] = useState(null);
  const [commentFileUrl, setCommentFileUrl] = useState(null);

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

  return (
    <div className="rfq-detail-layout" style={{ display: 'flex', gap: '32px', padding: '32px 0', minHeight: '100vh', alignItems: 'flex-start', textAlign: 'center' }}>
      <aside className="side-nav">
        <div className="nav-brand">EngiFlow</div>
        <nav>
          <ul>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={()=>navigate('/admin')} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="home" style={{marginRight: '8px'}}>🏠</span>Home
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
      <div style={{ flex: 2, maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '18px', color: '#757575', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.1em', cursor: 'pointer' }}>&larr;</span> Back to RFQ Listings
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
          <span style={{ background: '#f4f4ff', color: '#5b4fff', borderRadius: 20, padding: '7px 18px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="date">📅</span> {rfq.date}
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
        <div style={{width: '100%', maxWidth: 800, margin: '48px auto 0 auto'}}>
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
      </div>
    </div>
  );
}
