import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import './Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="dashboard-layout">
      <aside className="side-nav">
        <div className="nav-brand">EngiFlow</div>

        <nav>
          <ul>
            <li>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/civil"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Civil Engineering
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/structural"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Structural Engineering
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="nav-footer">
          <button className="btn" onClick={() => navigate('/login')}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1 className="welcome">
              Welcome back, <span>Client</span>
            </h1>
            <p className="lead">
              Here's your project overview and activity
            </p>
          </div>

          <div className="header-actions">
            <button className="btn primary">+ New Project</button>
              {/* Removed View Services button */}
          </div>
        </header>

        {/* Child routes render here */}
        <div className="dashboard-outlet">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
