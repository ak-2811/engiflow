import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Services from "./pages/Services";
import DashboardLayout from './pages/DashboardLayout'
import DashboardHome from './pages/DashboardHome'
import DashboardServicesCivil from './pages/DashboardServicesCivil'
import DashboardServicesStructural from './pages/DashboardServicesStructural'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/services" element={<Services />}/>
      <Route path="/dashboard/*" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="civil" element={<DashboardServicesCivil />} />
        <Route path="structural" element={<DashboardServicesStructural />} />
      </Route>
    </Routes>
  );
}

export default App;
