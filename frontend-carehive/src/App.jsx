import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import CareTakerDashboard from "./components/CareTakerDashboard";
import ElderDashboard from "./components/ElderDashboard";  // Fixed import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/elder" element={<ElderDashboard />} />  {/* Fixed route */}
        <Route path="/caretaker" element={<CareTakerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
