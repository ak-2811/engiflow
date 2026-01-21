import React from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './RFQComments.css'
import { useEffect, useState} from 'react'
import axios from 'axios'
import { useRef } from "react";


export default function RFQDetail() {
  const { id } = useParams();
  //RFQ Form 
  const [allServices, setAllServices] = useState([])
  const [showModal, setShowModal] = useState(false)
  const role = localStorage.getItem('role')
  const isAdmin= role === 'admin'

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

  //Project Manager Fetch
  const [projectManagers, setProjectManagers] = useState([]);

useEffect(() => {
  if (role!=="admin") return;
  const token = localStorage.getItem("access");

  axios.get("http://127.0.0.1:8000/api/project-managers/list/", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => {
  console.log("PM LIST:", res.data);
  setProjectManagers(res.data);
})
  .catch(err => console.error(err));
}, [role]);

  
  //Project Manager Assign
  const [selectedPM, setSelectedPM] = useState("");
  const [assignedPM, setAssignedPM] = useState(null);

  useEffect(() => {
  if (rfq?.assigned_to) {
    setAssignedPM(rfq.assigned_to);
    setSelectedPM(String(rfq.assigned_to.id));
  }
}, [rfq]);


  //Project Manager Subimt/Assign
  const assignPM = async () => {
  if (!selectedPM) return;

  const token = localStorage.getItem("access");

  const res = await axios.post(
    `http://127.0.0.1:8000/api/service/rfq/${rfq.raw_id}/assign-pm/`,
    { project_manager_id: selectedPM },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  setAssignedPM(res.data.assigned_to); // 🔒 makes readonly
  navigate('/admin');
};


  // ===== Deliverables (PM) =====
  const [deliverables, setDeliverables] = useState([]);
  const [subVendors, setSubVendors] = useState([]);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssignedSubs, setNewAssignedSubs] = useState([]);
  const [newAttachment, setNewAttachment] = useState([]);

  const [editingRowId, setEditingRowId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDesc, setEditingDesc] = useState('');
  const [editingAssigned, setEditingAssigned] = useState([]);
// PM chat states
  const [selectedSubVendorChat, setSelectedSubVendorChat] = useState("");
  // const [assignedSubVendors, setAssignedSubVendors] = useState([]);
  // PM deliverable-based chat
const [selectedDeliverableChat, setSelectedDeliverableChat] = useState("");
const [deliverableSubVendors, setDeliverableSubVendors] = useState([]);



  useEffect(() => {
  if (role !== 'project_manager') return;

  const token = localStorage.getItem('access');
  axios.get('http://127.0.0.1:8000/api/list/subvendors/', {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => setSubVendors(res.data))
  .catch(err => console.error(err));
}, [role]);

  useEffect(() => {
    if (role !== 'project_manager' || !rfq?.raw_id) return;

    const token = localStorage.getItem('access');
    axios.get(
      `http://127.0.0.1:8000/api/deliverable/rfq/${rfq.raw_id}/deliverables/`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => setDeliverables(res.data))
    .catch(err => console.error(err));
  }, [rfq?.raw_id, role]);

//   useEffect(() => {
//   if (role !== "project_manager") return;
//   if (!deliverables.length) {
//     setAssignedSubVendors([]);
//     return;
//   }

//   // collect & deduplicate assigned subvendors
//   const map = new Map();

//   deliverables.forEach(d => {
//     (d.assigned_subvendors_details || []).forEach(v => {
//       map.set(v.id, v);
//     });
//   });

//   setAssignedSubVendors(Array.from(map.values()));
// }, [deliverables, role]);

useEffect(() => {
  if (!selectedDeliverableChat) {
    setDeliverableSubVendors([]);
    setSelectedSubVendorChat("");
    return;
  }

  const d = deliverables.find(
    d => String(d.id) === String(selectedDeliverableChat)
  );

  if (!d) return;

  setDeliverableSubVendors(d.assigned_subvendors_details || []);
  setSelectedSubVendorChat("");
}, [selectedDeliverableChat, deliverables]);



  const handleAddDeliverable = async () => {
  if (!newTitle.trim() || !newDesc.trim()) return;

  const token = localStorage.getItem('access');
  const formData = new FormData();

  formData.append('title', newTitle);
  formData.append('description', newDesc);
  newAssignedSubs.forEach(id =>
    formData.append('assigned_subvendors', id)
  );
  if (newAttachment){ newAttachment.forEach(file =>
  formData.append("attachment", file)
);}
  const res = await axios.post(
    `http://127.0.0.1:8000/api/deliverable/rfq/${rfq.raw_id}/deliverables/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  setDeliverables(prev => [res.data, ...prev]);
  setNewTitle('');
  setNewDesc('');
  setNewAssignedSubs([]);
  setNewAttachment([]);
};

const toggleSubVendor = (id) => {
  setNewAssignedSubs(prev =>
    prev.includes(id)
      ? prev.filter(v => v !== id)
      : [...prev, id]
  );
};

const startEditRow = (d) => {
  setEditingRowId(d.id);
  setEditingTitle(d.title);
  setEditingDesc(d.description);
  setEditingAssigned(d.assigned_subvendors || []);
};

const saveEditRow = async (id) => {
  const token = localStorage.getItem('access');

  await axios.put(
    `http://127.0.0.1:8000/api/deliverable/deliverables/${id}/`,
    {
      title: editingTitle,
      description: editingDesc,
      assigned_subvendors: editingAssigned
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  setDeliverables(prev =>
    prev.map(d =>
      d.id === id
        ? { ...d, title: editingTitle, description: editingDesc, assigned_subvendors: editingAssigned }
        : d
    )
  );

  setEditingRowId(null);
};

const deleteDeliverable = async (id) => {
  const token = localStorage.getItem('access');

  await axios.delete(
    `http://127.0.0.1:8000/api/deliverable/deliverables/${id}/`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  setDeliverables(prev => prev.filter(d => d.id !== id));
};







  // Comment state
  const [comments, setComments] = useState([
    { user: 'Admin', text: 'Please review the attached documents.', image: null },
    { user: 'Project Manager', text: 'Documents received, will update soon.', image: null },
  ]);
  const [commentText, setCommentText] = useState('');
  const [commentFile, setCommentFile] = useState(null);
  const commentsRef = useRef(null);
  const [commentFileUrl, setCommentFileUrl] = useState(null);

  // Dropdown for chat
  const [chatTarget, setChatTarget] = useState(
    role === "project_manager"
    ? "admin_pm"
    : role === "admin"
    ? "admin_client"
    : "admin_client" 
);




// Fetch chat message

const getChatUrl = () => {
  if (!rfq?.raw_id || !chatTarget) return null;
  if(role==="admin"){
  return chatTarget === "admin_client"
    ? `/api/chat/rfq/${rfq.raw_id}/admin-client/`
    : `/api/chat/rfq/${rfq.raw_id}/admin-pm/`; }

  //   if (role === "project_manager") {
  //   if (chatTarget === "admin_pm") {
  //     return `/api/chat/rfq/${rfq.raw_id}/admin-pm/`;
  //   }

  //   if (chatTarget === "pm_subvendor" && selectedSubVendorChat) {
  //     return `/api/chat/rfq/${rfq.raw_id}/pm-subvendor/?subvendor_id=${selectedSubVendorChat}`;
  //   }
  // }
  if (role === "project_manager") {
  if (chatTarget === "admin_pm") {
    return `/api/chat/rfq/${rfq.raw_id}/admin-pm/`;
  }

  if (
    chatTarget === "pm_subvendor" &&
    selectedSubVendorChat &&
    selectedDeliverableChat
  ) {
    return `/api/chat/rfq/${rfq.raw_id}/pm-subvendor/` +
      `?subvendor_id=${selectedSubVendorChat}` +
      `&deliverable_id=${selectedDeliverableChat}`;
  }

  return null;
}
    if (role === "client") {
      return `/api/chat/rfq/${rfq.raw_id}/admin-client/`;
  }
  return null;
};

useEffect(() => {
  if (role === "project_manager") {
    setChatTarget("admin_pm");
  }
}, [role]);

// const chatConfigFactory = (rfqId) => ({
//   client: {
//     fetch: `/api/chat/rfq/${rfqId}/admin-client/`
//   },
//   project_manager: {
//     fetch: `/api/chat/rfq/${rfqId}/admin-pm/`
//   }
// });

// useEffect(() => {
//   if (!rfq?.raw_id) return;
//   if (!chatTarget) return;

//   const token = localStorage.getItem("access");
//   const url = getChatUrl();
//   if (!url || !token) return;

//   axios.get(`http://127.0.0.1:8000${url}`, {
//     headers: { Authorization: `Bearer ${token}` }
//   })
//   .then(res => {
//     const formatted = res.data.map(m => ({
//       user:
//         m.sender_role === "admin" ? "Admin" :
//         m.sender_role === "project_manager" ? "Project Manager" : "Client",
//       text: m.message,
//       image: m.attachment ? {
//         url: m.attachment,
//         type: m.attachment.endsWith(".pdf") ? "application/pdf" : "image"
//       } : null
//     }));

//     setComments(formatted);
//   })
//   .catch(err => console.error(err));
// }, [rfq?.raw_id, chatTarget]);

useEffect(() => {
  if (!rfq?.raw_id) return;

  // if (role === "project_manager" &&
  //     chatTarget === "pm_subvendor" &&
  //     !selectedSubVendorChat) {
  //   return;
  // }
   if (
    role === "project_manager" &&
    chatTarget === "pm_subvendor" &&
    (!selectedSubVendorChat || !selectedDeliverableChat)
  ) {
    return;
  }

  const token = localStorage.getItem("access");
  const url = getChatUrl();
  if (!url || !token) return;

  axios.get(`http://127.0.0.1:8000${url}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => {
    const formatted = res.data.map(m => ({
      user:
        m.sender_role === "admin" ? "Admin" :
        m.sender_role === "project_manager" ? "Project Manager" :
        m.sender_role === "subvendor" ? "Sub Contractor" :
        "Client",
      text: m.message,
      image: m.attachment
        ? {
            url: m.attachment,
            type: m.attachment.endsWith(".pdf")
              ? "application/pdf"
              : "image"
          }
        : null
    }));

    setComments(formatted);
  })
  .catch(err => console.error(err));
}, [rfq?.raw_id, chatTarget, selectedSubVendorChat, role]);



  useEffect(() => {
  if (commentsRef.current) {
    commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
  }
}, [comments]);

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


  const handleCommentSubmit = async (e) => {
  e.preventDefault();

  if (!commentText && !commentFile) return;

  const token = localStorage.getItem("access");

  const url = getChatUrl();
  const formData = new FormData();
  formData.append("message", commentText);
  if (commentFile) {
    formData.append("attachment", commentFile);
  }

  await axios.post(
    `http://127.0.0.1:8000${url}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    }
  );

  // ✅ optimistic UI update
  setComments(prev => [
    ...prev,
    {
      user: role==="admin"?"Admin":role==="project_manager"?"Project Manager":"Client",
      text: commentText,
      image: commentFile
        ? {
            url: commentFileUrl,
            type: commentFile.type
          }
        : null
    }
  ]);

  // cleanup
  setCommentText('');
  setCommentFile(null);
  setCommentFileUrl(null);
};


  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setCommentFile(file);
      setCommentFileUrl(URL.createObjectURL(file));
    }
    else return;
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
              <button className="nav-link" onClick={()=>{localStorage.setItem('Status','All');navigate('/rfqs?panel=Admin&status=All')}} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                 <span role="img" aria-label="rfqs" style={{marginRight: '8px'}}>📄</span>RFQs
              </button>
            </li>
          </ul>
        </nav>
        <div className="nav-footer">
          <button className="btn" onClick={() => {
            localStorage.clear();
            navigate('/', { replace: true });
          }}>Sign Out</button>
        </div>
      </aside>
    );
  }

  function renderPMSidebar() {
    return (
      <aside className="side-nav">
        <div className="nav-brand">EngiFlow</div>
        <nav>
          <ul>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={()=>navigate('/pm')} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="dashboard" style={{marginRight: '8px'}}>📊</span>Home
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="projects" style={{marginRight: '8px'}}>📁</span>Projects
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={()=>{
                localStorage.setItem('Status','All'); 
                navigate('/rfqs?panel=Project_manager&status=All');}} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                 <span role="img" aria-label="rfqs" style={{marginRight: '8px'}}>📄</span>RFQs
              </button>
            </li>
          </ul>
        </nav>
        <div className="nav-footer">
          <button className="btn" onClick={() => {
            localStorage.removeItem('isLoggedIn');
            navigate('/', { replace: true });
          }}>Sign Out</button>
        </div>
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
            localStorage.clear();
            navigate('/', { replace: true });
          }}>Sign Out</button>
      </div>
    </aside>
    );
  }

  return (
    <div className="rfq-detail-layout">
      {role==='admin'?renderAdminSidebar():role=== 'project_manager'?renderPMSidebar():renderDashboardSidebar()}
      <div style={{flex: 1,width: '100%',padding: '0 32px',textAlign: 'left'}}>
        <div style={{ marginBottom: '18px', color: '#757575', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.1em', cursor: 'pointer' }} onClick={() => {role==='admin'?navigate('/admin'):role==='project_manager'?navigate('/pm'):navigate('/dashboard')}}>&larr;</span> Back to RFQ Listings
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
          <span style={{ background: '#ede9fe', color: '#6366f1', fontWeight: 600, borderRadius: 8, padding: '4px 16px', fontSize: '1.05rem', letterSpacing: 1 }}>{rfq.id}</span>
          <span style={{ background: '#fff7d6', color: '#bfa100', fontWeight: 600, borderRadius: 8, padding: '4px 14px', fontSize: '1.05rem' }}>{role==='admin'?rfq.admin_status:role==='project_manager'?rfq.pm_status:rfq.status}</span>
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
        {/* Deliverables View for pm and subcontractor */}
        {/* Deliverables table - PM sees full manager view, subcontractor sees only assigned items */}
        {(role === 'project_manager' || role === 'subcontractor') && (
          <div style={{width: '100%', maxWidth: 900, margin: '24px auto', background: '#fff', borderRadius: 18, boxShadow: '0 6px 30px rgba(78,70,255,0.08)', padding: 20}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
              <div>
                <div style={{fontWeight: 800, fontSize: '1.2rem'}}>Deliverables</div>
                {role === 'project_manager' && <div style={{color: '#6b7280', fontSize: '0.95rem'}}>Add deliverables and assign each item to one or more subcontractors.</div>}
              </div>
              <div style={{display: 'flex', gap: 8}}>
                {role === 'project_manager' && <button onClick={handleAddDeliverable} style={{background: 'linear-gradient(90deg,#5b4fff,#7c5bff)', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 10, fontWeight: 700, cursor: 'pointer'}}>Add Deliverable</button>}
              </div>
            </div>

            {/* Add row inputs and table shown only to PMs - subcontractor sees assigned items only below */}
            {role === 'project_manager' && (
              <>
                {/* Add row inputs
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 18, alignItems: 'start'}}>
                  <input
                    type="text"
                    placeholder="Deliverable Title"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    style={{
                      padding: 14,
                      borderRadius: 10,
                      border: '1px solid #eef2ff',
                      width: '100%',
                      marginBottom: 12
                    }}
                  />
                  <textarea
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="Description"
                    rows={6}
                    style={{padding: 18, borderRadius: 12, border: '1px solid #eef2ff', minHeight: 200, resize: 'vertical', fontSize: '1rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}
                  />

                  <div style={{display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end'}}>
                    <label htmlFor="deliverable-attach" style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, background: newAttachment ? '#eef2ff' : '#f8fafc', cursor: 'pointer', border: '1px solid #eef2ff', fontSize: '0.95rem'}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#5b4fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 10l5-5 5 5" stroke="#5b4fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span style={{fontSize: '0.95rem'}}>{newAttachment ? newAttachment.name : 'Attach'}</span>
                      <input id="deliverable-attach" type="file" accept="image/*,application/pdf" onChange={e => setNewAttachment(e.target.files[0])} style={{display: 'none'}} />
                    </label>

                      <div style={{display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                        {subVendors.map(v => (
                          <button
                            key={v.id}
                            onClick={() => toggleSubVendor(v.id)}
                            style={{
                              background: newAssignedSubs.includes(v.id) ? '#eef2ff' : '#f8fafc',
                              border: '1px solid #eef2ff',
                              padding: '8px 12px',
                              borderRadius: 999
                            }}
                          >
                            {v.name}
                          </button>
                        ))}
                      </div>
                  </div>
                </div> */}

                <div style={{display: 'grid', gridTemplateColumns: '1fr',gap: 18,marginBottom: 24,background: '#fafbff',padding: 20,borderRadius: 16,border: '1px solid #eef2ff'}}>
                  {/* Title */}
                  <input
                    type="text"
                    placeholder="Deliverable Title"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    style={{
                      padding: 14,
                      borderRadius: 10,
                      border: '1px solid #e5e7eb',
                      width: '100%',
                      fontSize: '1rem'
                    }}
                  />

                  {/* Description */}
                  <textarea
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="Describe this deliverable in detail…"
                    rows={5}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      border: '1px solid #e5e7eb',
                      resize: 'vertical',
                      fontSize: '1rem',
                      lineHeight: 1.6
                    }}
                  />

                  {/* Attachment + SubVendors */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      gap: 16,
                      alignItems: 'flex-start'
                    }}
                  >
                    {/* Attachment */}
                    <label
                      htmlFor="deliverable-attach"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: newAttachment ? '#eef2ff' : '#ffffff',
                        cursor: 'pointer',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.95rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      📎 {newAttachment ? newAttachment.name : 'Attach file'}
                      <input
                        id="deliverable-attach"
                        type="file"
                        multiple
                        accept="image/*,application/pdf"
                        onChange={e => setNewAttachment([...e.target.files])}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {/* Sub-vendors */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 8,
                        flexWrap: 'wrap'
                      }}
                    >
                      {subVendors.map(v => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => toggleSubVendor(v.id)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: 999,
                            border: '1px solid #e5e7eb',
                            background: newAssignedSubs.includes(v.id)
                              ? '#eef2ff'
                              : '#ffffff',
                            color: '#1f2937',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                          }}
                        >
                          {v.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleAddDeliverable}
                      style={{
                        background: '#5b4fff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 10,
                        padding: '10px 20px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Add Deliverable
                    </button>
                  </div>
                </div>


                {/* Table */}
                <div style={{overflow: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr style={{textAlign: 'left', borderBottom: '1px solid #f0f0ff'}}>
                        <th style={{padding: '12px 8px', fontSize: '0.95rem'}}>Title</th>
                        <th style={{padding: '12px 8px', fontSize: '0.95rem'}}>Description</th>
                        <th style={{padding: '12px 8px', fontSize: '0.95rem'}}>Attachment</th>
                        <th style={{padding: '12px 8px', fontSize: '0.95rem'}}>Assigned Subcontractors</th>
                        <th style={{padding: '12px 8px', fontSize: '0.95rem', width: 150}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliverables.length === 0 && (
                        <tr>
                          <td colSpan={4} style={{padding: 18, color: '#9ca3af'}}>No deliverables yet. Use the form above to add one.</td>
                        </tr>
                      )}
                      {deliverables.map(d => (
                        <tr key={d.id} style={{borderBottom: '1px solid #fbfbff'}}>
                          <td style={{padding: 12, verticalAlign: 'top', maxWidth: '100%', whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                            {editingRowId === d.id ? (
                              <input
                                value={editingTitle}
                                onChange={e => setEditingTitle(e.target.value)}
                                style={{width: '100%', padding: 8}}
                              />
                            ) : (
                              d.title
                            )}
                          </td>
                          <td style={{padding: 12, verticalAlign: 'top'}}>
                            {editingRowId === d.id ? (
                              <textarea value={editingDesc} onChange={e => setEditingDesc(e.target.value)} rows={4} style={{padding: 8, borderRadius: 8, border: '1px solid #eef2ff', width: '100%', minHeight: 120, resize: 'vertical', fontSize: '1rem'}} />
                            ) : (
                              <div style={{color: '#374151', fontSize: '1rem', lineHeight: 1.5}}>{d.description}</div>
                            )}
                          </td>
                          <td style={{padding: 12, verticalAlign: 'top'}}>
                            {d.attachment ?.length > 0 ? (
                              d.attachment.map(a=>(
                              <a
                                key={a.id}
                                href={a.file}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  fontSize: '0.95rem',
                                  color: '#5b4fff',
                                  textDecoration: 'none',
                                  background: '#f4f4ff',
                                  padding: '6px 10px',
                                  borderRadius: 8
                                }}
                              >
                                📎 View file
                              </a> ))
                            ) : (
                              <span style={{ color: '#9ca3af' }}>—</span>
                            )}
                          </td>
                          <td style={{padding: 12, verticalAlign: 'top'}}>
                          {editingRowId === d.id ? (
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {subVendors.map(v => (
                              <label
                                key={v.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  background: editingAssigned.includes(v.id) ? '#eef2ff' : '#f8fafc',
                                  padding: '6px 10px',
                                  borderRadius: 8,
                                  cursor: 'pointer'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={editingAssigned.includes(v.id)}
                                  onChange={() =>
                                    setEditingAssigned(prev =>
                                      prev.includes(v.id)
                                        ? prev.filter(id => id !== v.id)
                                        : [...prev, v.id]
                                    )
                                  }
                                />
                                <span style={{ fontSize: '0.95rem' }}>{v.name}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                                {d.assigned_subvendors_details?.length > 0 ? (
                                  d.assigned_subvendors_details.map(v => (
                                    <span
                                      key={v.id}
                                      style={{
                                        background: '#eef2ff',
                                        color: '#4c51bf',
                                        padding: '6px 10px',
                                        borderRadius: 999,
                                        fontSize: '0.9rem'
                                      }}
                                    >
                                      {v.name}
                                    </span>
                                  ))
                                ) : (
                                  <span style={{ color: '#9ca3af' }}>Not assigned</span>
                                )}
                              </div>
                            )}
                          </td>
                          <td style={{padding: 12, verticalAlign: 'top'}}>
                            {editingRowId === d.id ? (
                              <div style={{display: 'flex', gap: 8}}>
                                <button onClick={() => saveEditRow(d.id)} style={{background: '#5b4fff', color: '#fff', border: 'none', padding: '8px 10px', borderRadius: 8, cursor: 'pointer'}}>Save</button>
                                <button onClick={() => setEditingRowId(null)} style={{background: '#fff', border: '1px solid #e6e6f8', padding: '8px 10px', borderRadius: 8, cursor: 'pointer'}}>Cancel</button>
                              </div>
                            ) : (
                              <div style={{display: 'flex', gap: 8}}>
                                <button onClick={() => startEditRow(d)} style={{background: '#fff', border: '1px solid #e6e6f8', padding: '8px 10px', borderRadius: 8, cursor: 'pointer'}}>Edit</button>
                                <button onClick={() => deleteDeliverable(d.id)} style={{background: '#fff', border: '1px solid #fde2e2', color: '#b91c1c', padding: '8px 10px', borderRadius: 8, cursor: 'pointer'}}>Delete</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {/* Subcontractor view: show only deliverables assigned to them */}
            {/* {role === 'subcontractor' && (
              <div style={{paddingTop: 6}}>
                <div style={{fontWeight:700, marginBottom:12}}>Assigned Deliverables</div>
                <div style={{overflow:'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr style={{textAlign:'left', borderBottom:'1px solid #f0f0ff'}}>
                        <th style={{padding:'12px 8px', fontSize:'0.95rem'}}>Description</th>
                        <th style={{padding:'12px 8px', fontSize:'0.95rem'}}>Attachment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedDeliverables.length === 0 ? (
                        // Fallback: show the RFQ as a single helpful row (description + RFQ-level attachment)
                        <tr style={{borderBottom:'1px solid #fbfbff'}}>
                          <td style={{padding:12}}><div style={{whiteSpace:'pre-wrap',lineHeight:1.6,color:'#374151'}}>{rfq.overview}</div></td>
                          <td style={{padding:12}}>{(rfq.attachments && rfq.attachments.length > 0) ? (
                            <a href={rfq.attachments[0].url} target="_blank" rel="noopener noreferrer" style={{color:'#5b4fff', textDecoration:'none', background:'#f4f4ff', padding:'6px 10px', borderRadius:8}}>{rfq.attachments[0].name}</a>
                          ) : <span style={{color:'#9ca3af'}}>—</span>}</td>
                        </tr>
                      ) : (
                        assignedDeliverables.map(d => (
                          <tr key={d.id} style={{borderBottom:'1px solid #fbfbff'}}>
                            <td style={{padding:12}}><div style={{whiteSpace:'pre-wrap',lineHeight:1.6,color:'#374151'}}>{d.description}</div></td>
                            <td style={{padding:12}}>{d.attachment ? (
                              <a href={d.attachment.url} target="_blank" rel="noopener noreferrer" style={{color:'#5b4fff', textDecoration:'none', background:'#f4f4ff', padding:'6px 10px', borderRadius:8}}>{d.attachment.name}</a>
                            ) : <span style={{color:'#9ca3af'}}>—</span>}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )} */}
          </div>
        )}

        {/* Comment Section - place after main content, below images/docs */}
        <div style={{width: '100%', maxWidth: 800, margin: '48px auto 0 auto', textAlign:'center'}}>
          <div className="rfq-comments-panel" style={{borderRadius: 18, boxShadow: '0 2px 12px 0 rgba(80,80,120,0.06)', padding: '20px 22px'}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <div style={{fontWeight: 700, fontSize: '1.18rem', marginBottom: 18}}>Comments</div>
                {isAdmin && (<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <label style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                  Chat with
                  </label>
                    <select
                      value={chatTarget}
                      onChange={e => setChatTarget(e.target.value)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: "1px solid #e6e6f8"
                      }}
                    >
                      <option value="admin_client">Client</option>
                      <option value="admin_pm">Project Manager</option>
                    </select>
                  </div>
                )}

                {/* {role === "project_manager" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <label style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                      Chat with
                    </label>

                    <select
                      value={chatTarget}
                      onChange={e => {
                        setChatTarget(e.target.value);
                        setSelectedSubVendorChat("");
                      }}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: "1px solid #e6e6f8"
                      }}
                    >
                      <option value="admin_pm">Admin</option>
                      <option value="pm_subvendor">Sub Contractor</option>
                    </select>

                    {chatTarget === "pm_subvendor" && (
                      <select
                        value={selectedSubVendorChat}
                        onChange={e => setSelectedSubVendorChat(e.target.value)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 8,
                          border: "1px solid #e6e6f8"
                        }}
                      >
                        <option value="">Select Sub Contractor</option>
                        {assignedSubVendors.map(v => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )} */}
                {role === "project_manager" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <label style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                      Chat with
                    </label>

                    <select
                      value={chatTarget}
                      onChange={e => {
                        setChatTarget(e.target.value);
                        setSelectedDeliverableChat("");
                        setSelectedSubVendorChat("");
                      }}
                      style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e6e6f8" }}
                    >
                      <option value="admin_pm">Admin</option>
                      <option value="pm_subvendor">Sub Contractor</option>
                    </select>

                    {chatTarget === "pm_subvendor" && (
                      <>
                        {/* Deliverable dropdown */}
                        <select
                          value={selectedDeliverableChat}
                          onChange={e => setSelectedDeliverableChat(e.target.value)}
                          style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e6e6f8" }}
                        >
                          <option value="">Select Deliverable</option>
                          {deliverables.map(d => (
                            <option key={d.id} value={d.id}>
                              {d.title}
                            </option>
                          ))}
                        </select>

                        {/* Subvendor dropdown */}
                        <select
                          value={selectedSubVendorChat}
                          onChange={e => setSelectedSubVendorChat(e.target.value)}
                          disabled={!selectedDeliverableChat}
                          style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e6e6f8" }}
                        >
                          <option value="">Select Sub Contractor</option>
                          {deliverableSubVendors.map(v => (
                            <option key={v.id} value={v.id}>
                              {v.name}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                )}
                
              </div>
            {/* <div style={{marginBottom: 18}}> */}
            <div ref={commentsRef} className="comments-list" style={{marginBottom: 18, maxHeight: 240, overflowY: "auto", paddingRight: 8 }}>
              {comments.map((c, i) => (
                <div key={i} className={`comment-item ${c.user === 'Admin' ? 'admin' : c.user === 'Project Manager' ? 'pm' : 'you'}`} style={{marginBottom: 14}}>
                  <span className="comment-user" style={{fontWeight: 600, color: c.user === 'Admin' ? '#5b4fff' : c.user === 'Project Manager' ? '#1dbf73' : '#18181b'}}>{c.user}:</span> {c.text}
                  {c.image && c.image.type.startsWith('image') && (
                    <img src={c.image.url} className="comment-attachment" alt="comment attachment" style={{marginLeft: 10, maxHeight: 40, borderRadius: 6, verticalAlign: 'middle'}} />
                  )}
                  {c.image && c.image.type === 'application/pdf' && (
                    <a href={c.image.url} target="_blank" rel="noopener noreferrer" style={{marginLeft: 10, color: '#5b4fff', textDecoration: 'underline', fontSize: '0.98em'}}>
                      <span role="img" aria-label="pdf">📄</span> {c.image.name}
                    </a>
                  )}
                </div>
              ))}
            </div>
            <form style={{display: 'flex', gap: 12, alignItems: 'flex-end'}} onSubmit={handleCommentSubmit}>
              <textarea className="comment-input" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." style={{flex: 1, borderRadius: 8, border: '1.5px solid #e0e7ff', padding: 12, fontSize: '1.05rem', resize: 'vertical', minHeight: 38}} />
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
              <select value={selectedPM} onChange={e => setSelectedPM(e.target.value)} disabled={!!assignedPM} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px solid #e0e7ff', fontSize: '1.05rem', marginBottom: 12 }}>
                <option value="">Select Project Manager</option>
                    {Array.isArray(projectManagers) && projectManagers.map(pm => (
                      <option key={pm.id} value={pm.id}>
                        {pm.name}
                      </option>
                    ))}
              </select>
              <button onClick={assignPM} disabled={!!assignedPM || rfq.admin_status === "Active"} style={{ background: '#5b4fff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', width: '100%' }}>{assignedPM ? "Assigned" : "Assign to Project Manager"}</button>
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
