import { useState } from "react";
import "./Login.css";
import axios from "axios";
// import api from "../api/api";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    // username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation()
  const activeTab = location.pathname || '/'
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res=await axios.post("http://127.0.0.1:8000/api/auth/login/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem('first_name', res.data.first_name );
      localStorage.setItem('role', res.data.role );
      localStorage.setItem('isLoggedIn', 'true');
      // console.log("Data",res.data)
      if (res.data.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
    // later this will go to client dashboard
    // alert("Login successful");
    // alert("Logged in (stub)");
    } catch (error) {
      console.error(error)
      alert("Login failed");
    }
  };

  return (
    <div className="login-layout">
      <div className="login-left">
        <div className="welcome-block">
          <h1 className="welcome-heading">
            <span className="welcome-text">Welcome to</span>
            <span className="welcome-brand">EngiFlow</span>
          </h1>

          <p className="tagline">Your engineering workflow, simplified</p>
          
          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17l-5-5" stroke="#6d4cff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="feature-text">
                <div className="feature-title">Project Tracking</div>
                <div className="feature-desc">Manage tasks effortlessly</div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" stroke="#6d4cff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11a4 4 0 110-8 4 4 0 010 8zM21 11a4 4 0 110-8 4 4 0 010 8z" stroke="#6d4cff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="feature-text">
                <div className="feature-title">Team Collab</div>
                <div className="feature-desc">Work together in real-time</div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12h3l3-9 4 18 3-14 4 9" stroke="#6d4cff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="feature-text">
                <div className="feature-title">Easy RFQs &amp; Quotations</div>
                <div className="feature-desc">Create RFQs and manage quotations</div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3v18h18" stroke="#6d4cff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 14V7" stroke="#6d4cff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 14v-4" stroke="#6d4cff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 14v-9" stroke="#6d4cff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="feature-text">
                <div className="feature-title">Analytics</div>
                <div className="feature-desc">Track your progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="login-right">
        <div className="login-card">
          <h1 className="title">Sign in</h1>
          <p className="subtitle">Enter your credentials to continue</p>

          <div className="tabs">
            <button className={"tab " + (activeTab === '/' ? 'active' : 'inactive')}>Login</button>

            <button
              className={"tab " + (activeTab === "signup" ? "active" : "inactive")}
              onClick={() => navigate("/signup")}
              type="button"
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                name="email"
                type="email"
                placeholder="Email address"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="login-btn">
              Login →
            </button>
          </form>

          <p className="terms">
            By continuing, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
