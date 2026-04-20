import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import resumePDF from "./assets/Resume - Nickshan J.pdf";
import "./App.css";

const LINKS = [
  { to: "/",         label: "Home"     },
  { to: "/about",    label: "About"    },
  { to: "/skills",   label: "Skills"   },
  { to: "/projects", label: "Projects" },
  { to: "/contact",  label: "Contact"  },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <nav className={`navbar ${scrolled ? "solid" : ""}`}>
        <Link to="/" className="nav-logo" style={{ textDecoration: "none" }}>
          NJ<span>.</span>dev
        </Link>

        <ul className="nav-links">
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`nav-a ${pathname === to ? "active" : ""}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <a href={resumePDF} target="_blank" rel="noopener noreferrer" className="nav-pill">
          Resume ↗
        </a>

        <button className="nav-burger" onClick={() => setOpen(true)} aria-label="Open menu">
          <FiMenu />
        </button>
      </nav>

      {/* Mobile fullscreen menu */}
      <div className={`mob-menu ${open ? "open" : ""}`}>
        <button className="mob-close" onClick={() => setOpen(false)} aria-label="Close">
          <FiX />
        </button>
        {LINKS.map(({ to, label }) => (
          <Link key={to} to={to} onClick={() => setOpen(false)}>{label}</Link>
        ))}
        <a href={resumePDF} target="_blank" rel="noopener noreferrer" className="btn-cyan" style={{ marginTop: "0.5rem" }}>
          Download Resume
        </a>
      </div>
    </>
  );
}