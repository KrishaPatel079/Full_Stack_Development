import React from "react";
import { Link } from "react-router-dom";
import { FaBars, FaEnvelope, FaHome, FaInfoCircle } from "react-icons/fa";

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 z-50 bg-indigo-400 text-white p-2 rounded focus:outline-none border-2 border-white hover:bg-indigo-300"
      >
        <FaBars />
      </button>
      <div
        className={`fixed top-0 left-0 h-full w-48 bg-indigo-700 p-5 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col space-y-4 mt-12">
          <Link to="/" className="flex items-center space-x-3 bg-indigo-400 p-2 rounded text-white text-semibold hover:bg-indigo-300 focus:outline-none border-2 border-white">
            <FaHome/>
            <span>Home</span>
          </Link>
          <Link to="/about" className="flex items-center space-x-3 bg-indigo-400 p-2 rounded text-white text-semibold hover:bg-indigo-300 focus:outline-none border-2 border-white">
            <FaInfoCircle/>
            <span>About</span>
          </Link>
          <Link to="/contact" className="flex items-center space-x-3 bg-indigo-400 p-2 rounded text-white text-semibold hover:bg-indigo-300 focus:outline-none border-2 border-white">
            <FaEnvelope/>
            <span>Contact</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
