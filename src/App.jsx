import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Pastikan file ini ada
import Form from "./pages/Form"; // Pastikan file ini ada
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/form/:id" element={<Form />} />
      </Routes>
    </Router>
  );
}

export default App;
