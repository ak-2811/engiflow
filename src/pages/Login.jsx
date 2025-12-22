import { useState } from "react";
import "./Login.css";
import axios from "axios";
// import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    // username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res=await axios.post("http://127.0.0.1:8000/api/auth/login/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

    // later this will go to client dashboard
    alert("Login successful");
    alert("Logged in (stub)");
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
          
        </div>
        
      </div>

      <div className="login-right">
        <div className="login-card">
          <h1 className="title">Sign in</h1>
          <p className="subtitle">Enter your credentials to continue</p>

          <div className="tabs">
            <button
              className="tab inactive"
              onClick={() => navigate("/")}
              type="button"
            >
              Login
            </button>

            <button
              className="tab active"
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
