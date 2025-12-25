import React from 'react'
import './Dashboard.css'

const stats = [
  { title: 'Total Projects', value: '24', note: '+12% this month', icon: '📁' },
  { title: 'Active RFQs', value: '8', note: '+3 this week', icon: '💬' },
  { title: 'Quotations Sent', value: '42', note: '+5 this week', icon: '✅' },
]

const activities = [
  { id: 1, title: 'Project PQR-2024-001', subtitle: 'Civil Engineering - Site Investigation', time: '2 hours ago', icon: '📄' },
  { id: 2, title: 'RFQ #845', subtitle: 'Structural Analysis and Design', time: '5 hours ago', icon: '💬' },
  { id: 3, title: 'Quotation sent - QTN-0042', subtitle: 'Road & Drainage Design', time: '1 day ago', icon: '✅' },
]

export default function DashboardHome() {
  return (
    <div className="dashboard-content">
      <section className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
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
            <div className="summary-row"><span>Pending RFQs</span><strong>5</strong></div>
            <div className="summary-row"><span>Total Budget</span><strong>$245K</strong></div>
            <div className="summary-row"><span>Completion Rate</span><strong className="success">92%</strong></div>
          </div>

          <div className="summary-card quick-actions-card">
            <h4>Quick Actions</h4>
            <div className="actions-list">
              <button className="action-btn">
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
          </div>
        </aside>
      </section>
    </div>
  )
}
