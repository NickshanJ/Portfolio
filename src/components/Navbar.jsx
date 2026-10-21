import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const [resumeURL, setResumeURL] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchResume() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/settings/resume`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch resume settings");
        }

        const data = await response.json();

        if (data.success && data.resumeUrl) {
          setResumeURL(data.resumeUrl);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Unable to load resume:", error);
        }
      }
    }

    fetchResume();

    return () => controller.abort();
  }, [API_BASE_URL]);

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

        <a
          href={resumeURL || undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-pill"
          onClick={(event) => {
            if (!resumeURL) event.preventDefault();
          }}
          aria-disabled={!resumeURL}
        >
          Resume ↗
        </a>

        <button
          className={`nav-burger ${open ? "hidden" : ""}`}
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <FiMenu />
        </button>
      </nav>

      {/* Mobile fullscreen menu */}
      <div className={`mob-menu ${open ? "open" : ""}`}>
        <button
          type="button"
          className="mob-close"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <FiX />
        </button>
        {LINKS.map(({ to, label }) => (
          <Link key={to} to={to} onClick={() => setOpen(false)}>
            {label}
          </Link>
        ))}
        <a
          href={resumeURL || undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cyan"
          style={{ marginTop: "0.5rem" }}
          onClick={(event) => {
            if (!resumeURL) event.preventDefault();
          }}
          aria-disabled={!resumeURL}
        >
          Download Resume
        </a>
      </div>
    </>
  );
}
