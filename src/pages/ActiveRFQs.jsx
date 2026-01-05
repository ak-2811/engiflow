import React, {useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import axios from 'axios';

export default function ActiveRFQs() {
  // const rfqs = [
  //   {
  //     id: 'RFQ-2024-001',
  //     client: 'Acme Corp',
  //     description: 'Structural Design',
  //     submitted: '2024-12-30',
  //     end_date: '2026-01-01',
  //   },
  //   {
  //     id: 'RFQ-2024-002',
  //     client: 'Global Build',
  //     description: 'Civil Works',
  //     submitted: '2024-12-29',
  //     end_date: '2026-01-01',
  //   },
  //   {
  //     id: 'RFQ-2024-003',
  //     client: 'Tech Infra',
  //     description: 'Site Investigation and concrete testing',
  //     submitted: '2024-12-28',
  //     end_date: '2026-01-01',
  //   },
  // ];

    const navigate = useNavigate();
    // const location = useLocation();

    const [rfqs, setRfqs] = useState([]);

  const role = localStorage.getItem("role"); // admin | client
  const panel = role === "admin" ? "admin" : "dashboard";
  console.log('rfq:',rfqs)

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
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
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
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="home" style={{marginRight: '8px'}}>🏠</span>Home
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}} onClick={() => {/* open modal if needed */}}>
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
        </nav>
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
