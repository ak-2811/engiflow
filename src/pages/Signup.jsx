import { useState } from "react";
import "./Signup.css";
// import axios from "axios";
// import api from "../api/api";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";


export default function Signup() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    company_phone: "",
    country: "",
  });
  
  const navigate = useNavigate();

  // Minimal stable country list used for the dropdown. Can be moved to a separate file if needed.
  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo (Congo-Brazzaville)",
    "Costa Rica",
    "Côte d’Ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia (Czech Republic)",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini (fmr. " + "Swaziland)",
    "Ethiopia",
    "Federated States of Micronesia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar (formerly Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine State",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];
  // const [activeTab, setActiveTab] = useState("signup"); // 'signup' | 'login'
  // const [showForgot, setShowForgot] = useState(false);
  const location = useLocation()
  const activeTab = location.pathname === '/signup' ? 'signup' : ''

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        // await axios.post("http://127.0.0.1:8000/api/accounts/register/", form);
        // await api.post("/auth/client/register/", {
        //   first_name: form.first_name,
        //   last_name: form.last_name,
        //   username: form.username,
        //   email: form.email,
        //   password: form.password,
        //   phone: form.phone,
        //   company_phone: form.company_phone,
        //   country: form.country,
        // });
        await axios.post(
        "http://127.0.0.1:8000/api/auth/client/register/",
        form
      );
        navigate("/");
        alert("Account created successfully (stub)");
      } catch (error) {
        console.error("Signup error:", error.response?.data || error);
        alert(JSON.stringify(error.response?.data));
      }
  };
  return (
    <div className="signup-layout">
      {/* LEFT PANEL */}
      {/* LEFT PANEL */}
        <div className="signup-left">
        <div className="welcome-block">
            <h1 className="welcome-heading">
                <span className="welcome-text">Welcome to</span>
                <span className="welcome-brand">EngiFlow</span>
                </h1>


            <p className="tagline">
            Your engineering workflow, simplified
            </p>
            
            <div className="features">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17l-5-5" stroke="#6d4cff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="feature-text">
                  <div className="feature-title">Project Tracking</div>
                  <div className="feature-desc">Manage projects effortlessly</div>
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

        {/* <div className="benefits">
            <h3>What you'll get:</h3>
            <ul>
            <li>Streamlined project management designed for engineers</li>
            <li>Real-time collaboration with your team</li>
            <li>Powerful tools to track progress and boost productivity</li>
            </ul>
        </div> */}
        </div>


      {/* RIGHT PANEL */}
      <div className="signup-right">
        <div className="signup-card">
          <h1 className="title">Create Account</h1>
          <p className="subtitle">Enter your details to get started</p>

          {/* <div className="tabs">
            <button
              className={"tab " + (activeTab === "login" ? "active" : "inactive")}
              onClick={() => setActiveTab("login")}
              type="button"
            >
              Login
            </button>
            <button
              className={"tab " + (activeTab === "signup" ? "active" : "inactive")}
              onClick={() => setActiveTab("signup")}
              type="button"
            >
              Sign Up
            </button>
          </div> */}

          <div className="tabs">
            <button
              className={"tab " + (activeTab === "login" ? "active" : "inactive")}
              onClick={() => navigate("/")}
              type="button"
            >
              Login
            </button>

            <button
              className={"tab " + (activeTab === "signup" ? "active" : "inactive")}
              onClick={() => navigate("/signup")}
              type="button"
            >
              Sign Up
            </button>
          </div>


          <form onSubmit={handleSubmit}>
              <>
                <div className="name-row">
                  <div className="input-group">
                    <input
                      name="first_name"
                      placeholder="First name"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <input
                      name="last_name"
                      placeholder="Last name"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <input
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <input
                    name="company_phone"
                    type="tel"
                    placeholder="Company Phone Number"
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    onChange={handleChange}
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

                <button type="submit" className="signup-btn">
                  Create Account →
                </button>
              </>
          </form>

          <p className="terms">
            By continuing, you agree to our{" "}
            <span>Terms of Service</span> and{" "}
            <span>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
