import React, {useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import axios from 'axios';

export default function ActiveRFQs() {
    const navigate=useNavigate();
    const role=localStorage.getItem('role')
    const Status=localStorage.getItem('Status')
    const title = Status === 'Assigned' ? 'Assigned Deliverables' : 'All Deliverables'; 
    const [deliverables, setDeliverables]= useState([]);

    React.useEffect(() => {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
        navigate('/', { replace: true });
        }
    }, [navigate])

    useEffect(() => {
    if (role === "subvendor" && Status==="Assigned"){
    axios
      .get("http://127.0.0.1:8000/api/deliverable/subvendor/deliverables/assigned/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => setDeliverables(res.data))
      .catch((err) => console.error(err));
    }
}, [role,Status]);

function renderSubcontractorSidebar() {
    return (
      <aside className="side-nav">
        <div className="nav-brand">EngiFlow</div>
        <nav>
          <ul>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={() => navigate('/subvendor')} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="dashboard" style={{marginRight: '8px'}}>🏠</span>Home
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={() => navigate('/admin/rfqs?panel=subcontractor&status=all', { state: { panel: 'subcontractor' } })} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="rfqs" style={{marginRight: '8px'}}>📄</span>All RFQs
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
return (
    <div className="dashboard-layout">
      {renderSubcontractorSidebar()}
      {role==='subvendor'&& (
        <main className="dashboard-main">
          <header style={{ padding: '28px 24px 0 24px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: 6, fontWeight: 800, color: '#5b4fff' }}>{title}</h1>
            <p style={{ color: '#6b7280', marginBottom: 20 }}> {Status === 'Assigned' ? 'List of Assigned Deliverables' : 'All Deliverable Acress all status'}</p>
          </header>

          <div style={{ padding: 24 }}>
            <section className="admin-table-section">
              <div className="admin-table-header">
                <h2>{title}</h2>
                <div className="admin-table-search">
                  <input type="text" placeholder="Search RFQs..." />
                </div>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>title</th>
                    <th>Project manager</th>
                    <th>Submitted Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deliverables.map((r, i) => (
                    <tr key={i} style={{ cursor: 'pointer' }} onClick={() => navigate(`/rfq/${r.raw_id}?panel=${role}`, { state: { role } })}>
                      <td>{r.id}</td>
                      <td><b>{r.title}</b></td>
                      {/* <td>{r.description.length > 30 ? r.description.slice(0, 30) + '...' : r.description}</td> */}
                      <td>{r.created_by}</td>
                      <td>{r.created_at}</td>
                      <td>{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </main>)}
    </div>
  );
}