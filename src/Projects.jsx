import React, { useState, useEffect } from "react";
import { FiExternalLink, FiCode } from "react-icons/fi";
import MoviesSearch from "./image/Movies Search.png";
import VehicleRental from "./image/Vehicle Rental.png";
import Portal from "./image/Portal.png";
import Event from "./image/Event.png";
import BeBiosal from "./image/BEBiosol.png";
import SEO from "./seo/SEO";
import seoData from "./seo/seoData";
import "./App.css";

const PROJECTS = [
  {
    id: "bebiosal",
    num: "01",
    label: "01 — BE Biosal",
    url: "https://bebiosol.com/",
    img: BeBiosal,
    title: "BE Biosal",
    desc: "Developed a responsive biotechnology company website with reusable React components, TypeScript, Tailwind CSS, REST API integration, and production deployment for an optimized cross-device user experience.",
    stack: ["React", "TypeScript", "Tailwind CSS", "REST API", "Vite"],
    links: {
      frontend: "#",
      backend: "#",
    },
  },
  {
    id: "vehicle",
    num: "02",
    label: "02 — Vehicle Rental",
    url: "https://online-vehicle-rental.netlify.app/",
    img: VehicleRental,
    title: "Online Vehicle Rental",
    desc: "A full-stack vehicle rental platform with real-time availability, booking management, and Razorpay payment integration for secure transactions.",
    stack: ["MongoDB", "Express", "React", "Node.js", "Tailwind CSS", "Razorpay"],
    links: {
      frontend: "https://github.com/NickshanJ/Vehicle-Rental.git",
      backend: "https://github.com/NickshanJ/Vehicle-rental-server.git",
    },
  },
  {
    id: "movies",
    num: "03",
    label: "03 — Movies Search",
    url: "https://moviesearch00.netlify.app/",
    img: MoviesSearch,
    title: "Movies Search App",
    desc: "Discover and browse thousands of movies with advanced filtering, pagination, routing, and a personal favourites system — built entirely in React.",
    stack: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
    links: {
      frontend: "https://github.com/NickshanJ/Movie-Search.git",
      backend: "https://github.com/NickshanJ/Movie-Search.git",
    },
  },
  {
    id: "portal",
    num: "04",
    label: "04 — Student Portal",
    url: "https://student-teacher-portal.netlify.app/",
    img: Portal,
    title: "Student Teacher Portal",
    desc: "A role-based educational platform connecting students and teachers with course management, assignments, and progress tracking features.",
    stack: ["MongoDB", "Express", "React", "Node.js", "Tailwind CSS"],
    links: {
      frontend:
        "https://github.com/NickshanJ/Student-Teacher-Portal/tree/main/frontend",
      backend:
        "https://github.com/NickshanJ/Student-Teacher-Portal/tree/main/backend",
    },
  },
  {
    id: "event",
    num: "05",
    label: "05 — Event System",
    url: "https://event-managementsystem.netlify.app/",
    img: Event,
    title: "Event Management System",
    desc: "A dynamic event platform to explore, reserve, and manage events — full CRUD operations with a clean, responsive design and intuitive UX.",
    stack: ["MongoDB", "Express", "React", "Node.js", "Tailwind CSS"],
    links: {
      frontend:
        "https://github.com/NickshanJ/Event-Management-System/tree/main/frontend",
      backend:
        "https://github.com/NickshanJ/Event-Management-System/tree/main/backend",
    },
  },
];

export default function Projects() {
  const [active, setActive] = useState(0);

  /* Allow scroll on projects page only */
  useEffect(() => {
    document.body.classList.add("allow-scroll");
    return () => document.body.classList.remove("allow-scroll");
  }, []);

  const proj = PROJECTS[active];

  return (
    <div className="page-wrap scrollable">
      <SEO {...seoData.projects} />
      <div className="page-inner">
        <div className="sec-label">My Work</div>
        <h2 className="sec-title" style={{ marginBottom: "1.4rem" }}>
          Featured <span className="cyan">Projects</span>
        </h2>

        {/* ── Tab row ── */}
        <div className="proj-tab-row">
          {PROJECTS.map((p, i) => (
            <button
              key={p.id}
              className={`proj-tab ${active === i ? "active" : ""}`}
              onClick={() => setActive(i)}
            >
              {/* Desktop/tablet: full label | Mobile: number only */}
              <span className="proj-tab-full">{p.label}</span>
              <span className="proj-tab-short">{p.num}</span>
            </button>
          ))}
        </div>

        {/* ── Showcase card ── */}
        <div key={proj.id} className="proj-showcase">
          {/* Image side */}
          <div className="proj-showcase-img">
            <img src={proj.img} alt={proj.title} />
            <div className="proj-showcase-img-overlay" />
            <a
              href={proj.url}
              target="_blank"
              rel="noreferrer"
              className="proj-live-badge"
              onClick={(e) => e.stopPropagation()}
            >
              <FiExternalLink size={11} /> Live Demo
            </a>
          </div>

          {/* Info side */}
          <div className="proj-showcase-info">
            <h3 className="proj-info-title">{proj.title}</h3>
            <p className="proj-info-desc">{proj.desc}</p>

            <div className="proj-chips">
              {proj.stack.map((s, i) => (
                <span key={i} className="proj-chip">
                  {s}
                </span>
              ))}
            </div>

            <div className="proj-code-links">
              <a
                href={proj.links.frontend}
                target="_blank"
                rel="noreferrer"
                className="proj-code-a"
                onClick={(e) => e.stopPropagation()}
              >
                <FiCode size={12} /> Frontend Code
              </a>
              <span style={{ color: "var(--border)" }}>·</span>
              <a
                href={proj.links.backend}
                target="_blank"
                rel="noreferrer"
                className="proj-code-a"
                onClick={(e) => e.stopPropagation()}
              >
                <FiCode size={12} /> Backend Code
              </a>
            </div>
          </div>
        </div>

        {/* ── Other projects mini-grid ── */}
        <div className="proj-mini-grid">
          {PROJECTS.filter((_, i) => i !== active).map((p) => (
            <div
              key={p.id}
              className="proj-mini-card"
              onClick={() => setActive(PROJECTS.indexOf(p))}
            >
              <div className="proj-mini-img">
                <img src={p.img} alt={p.title} />
              </div>
              <div className="proj-mini-label">{p.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scoped responsive styles for tab labels */}
      <style>{`
        /* Desktop & tablet — show full label, hide short */
        .proj-tab-short { display: none; }
        .proj-tab-full  { display: inline; }

        /* Mobile — show number only */
        @media (max-width: 480px) {
          .proj-tab-full  { display: none; }
          .proj-tab-short { display: inline; }
          /* Make each tab wider for easy tapping */
          .proj-tab { padding: 11px 18px; font-size: 0.82rem; }
        }
      `}</style>
    </div>
  );
}