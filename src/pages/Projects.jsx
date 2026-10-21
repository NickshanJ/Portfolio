import { useState, useEffect, useRef } from "react";
import { FiExternalLink, FiCode } from "react-icons/fi";
import SEO from "../seo/SEO";
import seoData from "../seo/seoData";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const tabRefs = useRef([]);
  const tabRowRef = useRef(null);

  /* Fetch published projects from the backend */
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProjects() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/api/projects`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load projects.");
        }

        const data = await response.json();

        const sortedProjects = (data.projects || [])
          .filter((project) => project.published !== false)
          .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

        setProjects(sortedProjects);
        setActive(0);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch projects:", err);
          setError("Unable to load projects. Please try again later.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProjects();

    return () => controller.abort();
  }, []);

  /* Allow scroll on projects page only */
  useEffect(() => {
    document.body.classList.add("allow-scroll");
    return () => document.body.classList.remove("allow-scroll");
  }, []);

  const proj = projects[active];

  useEffect(() => {
    const tabRow = tabRowRef.current;
    const activeTab = tabRefs.current[active];

    if (!tabRow || !activeTab) return;

    // Selecting the first tab always scrolls directly to the left corner (0)
    if (active === 0) {
      tabRow.scrollTo({
        left: 0,
        behavior: "smooth",
      });
      return;
    }

    const rowRect = tabRow.getBoundingClientRect();
    const activeRect = activeTab.getBoundingClientRect();
    const prevTab = tabRefs.current[active - 1];
    const nextTab = tabRefs.current[active + 1];

    const leftTargetRect = prevTab
      ? prevTab.getBoundingClientRect()
      : activeRect;
    const rightTargetRect = nextTab
      ? nextTab.getBoundingClientRect()
      : activeRect;

    if (leftTargetRect.left < rowRect.left) {
      const scrollDiff = leftTargetRect.left - rowRect.left;
      tabRow.scrollTo({
        left: Math.max(0, tabRow.scrollLeft + scrollDiff),
        behavior: "smooth",
      });
    } else if (rightTargetRect.right > rowRect.right) {
      const scrollDiff = rightTargetRect.right - rowRect.right;
      tabRow.scrollTo({
        left: tabRow.scrollLeft + scrollDiff,
        behavior: "smooth",
      });
    }
  }, [active, projects.length]);

  /* Loading state */
  if (loading) {
    return (
      <div className="page-wrap scrollable">
        <SEO {...seoData.projects} />
        <div className="page-inner">
          <div className="sec-label">My Work</div>
          <h2 className="sec-title">
            Featured <span className="cyan">Projects</span>
          </h2>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  /* Error state */
  if (error) {
    return (
      <div className="page-wrap scrollable">
        <SEO {...seoData.projects} />
        <div className="page-inner">
          <div className="sec-label">My Work</div>
          <h2 className="sec-title">
            Featured <span className="cyan">Projects</span>
          </h2>
          <p role="alert">{error}</p>
        </div>
      </div>
    );
  }

  /* Empty state */
  if (!proj) {
    return (
      <div className="page-wrap scrollable">
        <SEO {...seoData.projects} />
        <div className="page-inner">
          <div className="sec-label">My Work</div>
          <h2 className="sec-title">
            Featured <span className="cyan">Projects</span>
          </h2>
          <p>No projects are available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap scrollable">
      <SEO {...seoData.projects} />

      <div className="page-inner">
        <div className="sec-label">My Work</div>

        <h2 className="sec-title" style={{ marginBottom: "1.4rem" }}>
          Featured <span className="cyan">Projects</span>
        </h2>

        {/* Tab row */}
        <div ref={tabRowRef} className="proj-tab-row proj-tab-scroll">
          {projects.map((project, index) => {
            const num = String(project.order ?? index + 1).padStart(2, "0");

            return (
              <button
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                key={project._id || project.slug || project.title}
                className={`proj-tab ${active === index ? "active" : ""}`}
                onClick={() => setActive(index)}
              >
                <span className="proj-tab-full">
                  {num} — {project.title}
                </span>
                <span className="proj-tab-short">{num}</span>
              </button>
            );
          })}
        </div>

        {/* Showcase card */}
        <div
          key={proj._id || proj.slug || proj.title}
          className="proj-showcase"
        >
          {/* Image side */}
          <div className="proj-showcase-img">
            <img src={proj.image} alt={proj.title} />
            <div className="proj-showcase-img-overlay" />

            {proj.liveUrl && (
              <a
                href={proj.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="proj-live-badge"
                onClick={(e) => e.stopPropagation()}
              >
                <FiExternalLink size={11} /> Live Demo
              </a>
            )}
          </div>

          {/* Info side */}
          <div className="proj-showcase-info">
            <h3 className="proj-info-title">{proj.title}</h3>

            <p className="proj-info-desc">{proj.description}</p>

            <div className="proj-chips">
              {(proj.technologies || []).map((technology, index) => (
                <span key={`${technology}-${index}`} className="proj-chip">
                  {technology}
                </span>
              ))}
            </div>

            {(proj.frontendUrl || proj.backendUrl || proj.githubUrl) && (
              <div className="proj-code-links">
                {proj.frontendUrl && (
                  <a
                    href={proj.frontendUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="proj-code-a"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiCode size={12} /> Frontend Code
                  </a>
                )}

                {proj.frontendUrl && (proj.backendUrl || proj.githubUrl) && (
                  <span style={{ color: "var(--border)" }}>·</span>
                )}

                {(proj.backendUrl || proj.githubUrl) && (
                  <a
                    href={proj.backendUrl || proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="proj-code-a"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiCode size={12} /> Backend Code
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Other projects mini-grid */}
        <div className="proj-mini-grid">
          {projects
            .filter((_, index) => index !== active)
            .map((project) => {
              const originalIndex = projects.indexOf(project);

              return (
                <div
                  key={project._id || project.slug || project.title}
                  className="proj-mini-card"
                  onClick={() => setActive(originalIndex)}
                >
                  <div className="proj-mini-img">
                    <img src={project.image} alt={project.title} />
                  </div>

                  <div className="proj-mini-label">{project.title}</div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Responsive tab labels */}
      <style>{`
        .proj-tab-short { display: none; }
        .proj-tab-full { display: inline; }

        @media (max-width: 480px) {
          .proj-tab-full { display: none; }
          .proj-tab-short { display: inline; }
          .proj-tab { padding: 11px 18px; font-size: 0.82rem; }
        }

        .proj-tab-scroll {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow-x: auto;
          overflow-y: hidden;
          flex-wrap: nowrap;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .proj-tab-scroll::-webkit-scrollbar {
          display: none;
        }

        .proj-tab-scroll .proj-tab {
          flex: 0 0 auto;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
