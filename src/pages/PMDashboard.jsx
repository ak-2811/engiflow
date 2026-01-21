import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import './Dashboard.css';


export default function PMDashboard() {

  // Getting the value for active and assigned rfqs
  const [rfqStats, setRfqStats] = useState({
    total_active: 0,
    total_pending:0
  })

  useEffect(() => {
    const token = localStorage.getItem('access')
    if (!token) return

    axios.get('http://127.0.0.1:8000/api/service/rfq-stats/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setRfqStats({
        total_active: res.data.pm_active_rfqs,
        total_pending: res.data.pm_pending_rfqs
      })
    })
    .catch(err => console.error(err))
  }, [])
  const stats = [
    
    {
      icon: '👥',
      label: 'Assigned RFQs',
      value: rfqStats.total_pending,
      changeType: 'up',
    },
    {
      icon: '📄',
      label: 'Active RFQs',
      value: rfqStats.total_active,
      changeType: 'up',
    },
    {
      icon: '✔️',
      label: 'Completed',
      value: '198',
      changeType: 'up',
    },
  ];

  const submissions = [
    {
      id: 'RFQ-2024-001',
      client: 'Acme Corp',
      service: 'Structural Design',
      date: '2024-12-30',
      end_date: '2026-01-01',
    },
    {
      id: 'RFQ-2024-002',
      client: 'Global Build',
      service: 'Civil Works',
      date: '2024-12-29',
      end_date: '2026-01-01',
    },
    {
      id: 'RFQ-2024-003',
      client: 'Tech Infra',
      service: 'Site Investigation and concrete testing',
      date: '2024-12-28',
      end_date: '2026-01-01',
    },
  ];
  
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent access via browser Back after sign-out
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
            <li className="dashboard-nav-item">
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="dashboard" style={{marginRight: '8px'}}>📊</span>Home
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="clients" style={{marginRight: '8px'}}>📁</span>Projects
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
      <main className="dashboard-main">
        <header className="admin-header">
          <h1><span className="admin-bold">Project Manager</span> <span className="admin-accent">Console</span></h1>
          <p className="admin-lead">Manage and track assigned RFQs and tasks</p>
        </header>
        <section className="admin-stats">
          {stats.map((stat, idx) => (
            <div
              className="admin-stat-card"
              key={idx}
              onClick={() => {
                if (stat.label === 'Active RFQs') {
                    localStorage.setItem('Status','Active');
                    navigate('/rfqs?panel=pm&status=Active');
                  }
                if (stat.label === 'Assigned RFQs') {
                    localStorage.setItem('Status','Pending');
                    navigate('/rfqs?panel=pm&status=pending');
                  }
              }}
              style={{ cursor:'pointer' }}
            >
              <div className="admin-stat-row" style={{justifyContent: 'center'}}>
                <span className="admin-stat-icon">{stat.icon}</span>
                <span className="admin-stat-label">{stat.label}</span>
              </div>
              <div className="admin-stat-value-row" style={{justifyContent: 'center'}}>
                <span className="admin-stat-value">{stat.value}</span>
              </div>
            </div>
          ))}
        </section>
        <section className="admin-table-section">
          <div className="admin-table-header">
            <h2>Assigned RFQs</h2>
            <div className="admin-table-search">
              <input type="text" placeholder="Search requests..." />
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
              {submissions.map((row, idx) => (
                <tr key={idx} style={{ cursor: 'pointer' }} onClick={() => navigate(`/rfq/${row.id}?panel=pm`, { state: { panel: 'pm' } })}>
                  <td>{row.id}</td>
                  <td><b>{row.client}</b></td>
                  <td>{row.service.length > 25 ? row.service.slice(0, 22) + '...' : row.service}</td>
                  <td>{row.date}</td>
                  <td>{row.end_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
