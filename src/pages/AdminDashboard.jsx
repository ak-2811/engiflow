import React from 'react';
import './AdminDashboard.css';
import './Dashboard.css';
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminDashboard() {
  const stats = [
    {
      icon: '👤',
      label: 'Total Clients',
      value: '1,284',
      // change: '+12.5%',
      changeType: 'up',
    },
    {
      icon: '📄',
      label: 'Active RFQs',
      value: '156',
      // change: '+8.2%',
      changeType: 'up',
    },
    {
      icon: '✔️',
      label: 'Completed',
      value: '892',
      // change: '+14.3%',
      changeType: 'up',
    },
  ];

  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('access')
    if (!token) return

    axios.get('http://127.0.0.1:8000/api/service/admin/rfqs/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setSubmissions(res.data))
    .catch(err => console.error(err))
  }, [])


// const submissions = [
//   {
//     id: 'RFQ-2024-001',
//     client: 'Acme Corp',
//     service: 'Structural Design',
//     date: '2024-12-30',
//     // amount: '$12,500',
//     // status: 'Pending',
//     // statusClass: 'pending',
//   },
//   {
//     id: 'RFQ-2024-002',
//     client: 'Global Build',
//     service: 'Civil Works',
//     date: '2024-12-29',
//     // amount: '$8,200',
//     // status: 'Reviewed',
//     // statusClass: 'reviewed',
//   },
//   {
//     id: 'RFQ-2024-003',
//     client: 'Tech Infra',
//     service: 'Site Investigation and concreate testing',
//     date: '2024-12-28',
//     amount: '$15,000',
//     // status: 'Approved',
//     // statusClass: 'approved',
//   },
// ];

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
                <span role="img" aria-label="clients" style={{marginRight: '8px'}}>👤</span>Clients
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="rfqs" style={{marginRight: '8px'}}>📄</span>RFQs
              </button>
            </li>
            {/* <li className="dashboard-nav-item">
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="settings" style={{marginRight: '8px'}}>⚙️</span>Settings
              </button>
            </li> */}
          </ul>
        </nav>
      </aside>
      <main className="dashboard-main">
        <header className="admin-header">
          <h1><span className="admin-bold">Admin</span> <span className="admin-accent">Console</span></h1>
          <p className="admin-lead">Manage and track service requests and RFQs</p>
        </header>
        <section className="admin-stats">
          {stats.map((stat, idx) => (
            <div className="admin-stat-card" key={idx}>
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
            <h2>Recent Activites</h2>
            <div className="admin-table-search">
              <input type="text" placeholder="Search requests..." />
              {/* <button className="admin-table-filter-btn">&#x1F5C2;</button> */}
            </div>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Description</th>
                <th>Date</th>
                {/* <th>Amount</th> */}
                {/* <th>Status</th>
                <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {submissions.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.id}</td>
                  <td><b>{row.client}</b></td>
                  <td>{row.description? row.description.length > 25? row.description.slice(0, 22) + '...': row.description: '—'}</td>
                  <td>{row.date}</td>
                  {/* <td>{row.amount}</td> */}
                  {/* <td><span className={`admin-status ${row.statusClass}`}>{row.status}</span></td> */}
                  {/* <td><button className="admin-table-actions">&#8942;</button></td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
