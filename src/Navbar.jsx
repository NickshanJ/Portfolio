import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./image/Logo.png";
import { FaBars } from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (window.innerWidth < 1024) { // mobile & tablet only
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setShowNavbar(false); // scroll down, hide
        } else {
          setShowNavbar(true); // scroll up, show
        }
        setLastScrollY(currentScrollY);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay for mobile/tablet menu */}
      {isOpen && window.innerWidth < 1024 && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300"></div>
      )}
      <div className={`bg-transparent text-white p-4 flex flex-col lg:flex-row justify-between items-center fixed w-full transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'} z-50`}>
        <div className="flex justify-between w-full lg:w-auto">
          <img className="w-52 h-20 ml-4" src={logo} alt="Logo" />
          <div
            className="flex items-center lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaBars size={30} />
          </div>
        </div>
        <div
          className={`flex-col z-50 space-y-4 mt-4 lg:mt-0 lg:flex lg:flex-row lg:space-x-24 lg:items-center lg:ml-auto font-stylish list-none ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          <li className="text-2xl mt-4 hover:text-[#d4af37]" onClick={handleNavClick}><Link to="/">Home</Link></li>
          <li className="text-2xl hover:text-[#d4af37]" onClick={handleNavClick}><Link to="/about">About</Link></li>
          <li className="text-2xl hover:text-[#d4af37]" onClick={handleNavClick}><Link to="/skills">Skills</Link></li>
          <li className="text-2xl hover:text-[#d4af37]" onClick={handleNavClick}><Link to="/projects">Projects</Link></li>
          <li className="text-2xl hover:text-[#d4af37]" onClick={handleNavClick}><Link to="/contact">Contact</Link></li>
        </div>
      </div>
    </>
  );
}

export default Navbar;