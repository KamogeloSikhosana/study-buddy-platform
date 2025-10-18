import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import StudentDashboard from "./pages/studentdashboard"; // ✅ folder import auto-loads index.jsx
import AdminDashboard from "./pages/admindashboard";     // ✅ same pattern

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
