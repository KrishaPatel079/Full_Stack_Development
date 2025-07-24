import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-sky-200">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
