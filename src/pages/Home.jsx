import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DynamicText from "../components/DynamicText";
import { FiDownload, FiArrowRight } from "react-icons/fi";
import SEO from "../seo/SEO";
import seoData from "../seo/seoData";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DEFAULT_HOME = {
  roleTitles: [
    "Front-End Developer",
    "MERN Full Stack Developer",
    "React Developer",
  ],
  description:
    "Passionate about building performant, pixel-perfect web apps. From clean UIs to robust back-end systems — I bring ideas to life with modern technologies.",
  experienceYears: 2,
  terminalName: "J. Nickshan",
};

const DEFAULT_SKILLS = {
  frontend: ["React", "Tailwind", "JS"],
  backend: ["Node", "Express", "MongoDB"],
  tools: ["Git", "Postman", "VSCode"],
};

const FRONTEND_KEYWORDS = [
  "html", "css", "tailwind", "bootstrap", "javascript",
  "typescript", "react", "next.js", "nextjs", "vite",
  "redux", "zustand", "sass", "scss", "frontend",
  "front-end", "ui/ux",
];

const BACKEND_KEYWORDS = [
  "node", "express", "mongodb", "mongoose", "mysql",
  "postgres", "postgresql", "sql", "python", "java",
  "php", "rest api", "restful api", "backend", "back-end",
  "authentication", "jwt", "firebase", "redis",
];

const TOOL_KEYWORDS = [
  "git", "github", "gitlab", "postman", "vscode",
  "vs code", "visual studio code", "npm", "pnpm",
  "yarn", "webpack", "docker", "aws", "netlify",
  "render", "cloudinary", "figma", "jira", "linux",
  "vercel", "devops", "ci/cd",
];

function getSkillName(skill) {
  if (typeof skill === "string") return skill.trim();

  if (!skill || typeof skill !== "object") return "";

  const name =
    skill.name ??
    skill.title ??
    skill.skill ??
    skill.technology ??
    skill.label;

  return typeof name === "string" ? name.trim() : "";
}

function matchesKeyword(name, keywords) {
  const normalizedName = name.toLowerCase();

  return keywords.some((keyword) => {
    const escaped = keyword.toLowerCase().replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    return new RegExp(
      `(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`,
    ).test(normalizedName);
  });
}

function categorizeSkills(skills) {
  const categories = {
    frontend: [],
    backend: [],
    tools: [],
  };

  skills.forEach((skill) => {
    const name = getSkillName(skill);
    if (!name) return;

    if (matchesKeyword(name, FRONTEND_KEYWORDS)) {
      categories.frontend.push(name);
    } else if (matchesKeyword(name, BACKEND_KEYWORDS)) {
      categories.backend.push(name);
    } else if (matchesKeyword(name, TOOL_KEYWORDS)) {
      categories.tools.push(name);
    }
  });

  const hasCategorizedSkills = Object.values(categories).some(
    (items) => items.length > 0,
  );

  return hasCategorizedSkills ? categories : DEFAULT_SKILLS;
}

function truncateText(value, maxLength = 38) {
  if (typeof value !== "string") return "";

  const text = value.trim();

  return text.length > maxLength
    ? `${text.slice(0, maxLength - 1)}…`
    : text;
}

// Generate a stable, commit-style identifier from a project name.
// This is a visual identifier, not an actual Git commit hash.
function getProjectId(project, index) {
  const source =
    project._id || project.slug || project.title || `project-${index}`;

  let hash = 0;

  for (let i = 0; i < source.length; i++) {
    hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
  }

  return hash.toString(16).padStart(7, "0").slice(-7);
}

export default function Home() {
  const [resumeURL, setResumeURL] = useState("");
  const [homeSettings, setHomeSettings] = useState(DEFAULT_HOME);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    document.body.classList.remove("allow-scroll");
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchJSON(endpoint) {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
      }

      return response.json();
    }

    async function loadHomeSettings() {
      try {
        const data = await fetchJSON("/api/settings/home");

        if (data.success && data.home) {
          const saved = data.home;

          setHomeSettings({
            roleTitles:
              Array.isArray(saved.roleTitles) &&
              saved.roleTitles.some(
                (role) => typeof role === "string" && role.trim(),
              )
                ? saved.roleTitles.filter(
                    (role) => typeof role === "string" && role.trim(),
                  )
                : DEFAULT_HOME.roleTitles,

            description:
              typeof saved.description === "string" &&
              saved.description.trim()
                ? saved.description
                : DEFAULT_HOME.description,

            experienceYears:
              Number.isInteger(saved.experienceYears) &&
              saved.experienceYears >= 0
                ? saved.experienceYears
                : DEFAULT_HOME.experienceYears,

            terminalName:
              typeof saved.terminalName === "string" &&
              saved.terminalName.trim()
                ? saved.terminalName.trim()
                : DEFAULT_HOME.terminalName,
          });
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Unable to load Home settings:", error);
        }
      }
    }

    async function loadResume() {
      try {
        const data = await fetchJSON("/api/settings/resume");

        if (data.success && data.resumeUrl) {
          setResumeURL(data.resumeUrl);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Unable to load resume:", error);
        }
      }
    }

    async function loadProjects() {
      try {
        const data = await fetchJSON("/api/projects");

        if (data.success && Array.isArray(data.projects)) {
          const publishedProjects = data.projects.filter(
            (project) =>
              project &&
              typeof project.title === "string" &&
              project.title.trim() &&
              project.published !== false,
          );

          setProjects(publishedProjects);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Unable to load projects:", error);
        }
      }
    }

    async function loadSkills() {
      try {
        const data = await fetchJSON("/api/skills");

        if (data.success && Array.isArray(data.skills)) {
          setSkills(data.skills);
        } else {
          console.error("Skills API returned an unexpected response.");
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Unable to load skills:", error);
        }
      }
    }

    loadHomeSettings();
    loadResume();
    loadProjects();
    loadSkills();

    return () => controller.abort();
  }, []);

  const roleTitles = homeSettings.roleTitles.length
    ? homeSettings.roleTitles
    : DEFAULT_HOME.roleTitles;

  const terminalName =
    homeSettings.terminalName || DEFAULT_HOME.terminalName;

  const skillCategories = skills.length
    ? categorizeSkills(skills)
    : DEFAULT_SKILLS;

  const terminalProjects = projects.slice(0, 4);

  return (
    <div className="page-wrap">
      <SEO {...seoData.home} />

      <div className="page-inner">
        <div className="home-grid">
          {/* LEFT — Main content */}
          <div className="anim-left">
            <div className="home-status">
              <span className="home-status-dot" />
              <span className="home-status-txt">
                Open to Opportunities
              </span>
            </div>

            <p className="home-greeting">Hello, I&apos;m</p>

            {/* Keep the main name unchanged */}
            <h1 className="home-name">
              J. Nickshan
              <span className="home-name-cyan">.</span>
            </h1>

            <p className="home-role">
              &gt;_{" "}
              <DynamicText texts={roleTitles} />
              <span className="cursor-blink"> |</span>
            </p>

            <p className="home-blurb">{homeSettings.description}</p>

            <div className="home-ctas">
              <a
                href={resumeURL || undefined}
                target="_blank"
                rel="nofollow noopener noreferrer"
                style={{ textDecoration: "none" }}
                onClick={(event) => {
                  if (!resumeURL) event.preventDefault();
                }}
                aria-disabled={!resumeURL}
              >
                <button className="btn-cyan" disabled={!resumeURL}>
                  <FiDownload size={14} /> Resume
                </button>
              </a>

              <Link to="/projects" style={{ textDecoration: "none" }}>
                <button className="btn-outline">
                  View Projects <FiArrowRight size={14} />
                </button>
              </Link>
            </div>

            {/* Dynamic statistics */}
            <div className="home-stats">
              <div>
                <div className="stat-n">{projects.length}+</div>
                <div className="stat-l">Projects Built</div>
              </div>

              <div>
                <div className="stat-n">{skills.length}+</div>
                <div className="stat-l">Technologies</div>
              </div>

              <div>
                <div className="stat-n">
                  {homeSettings.experienceYears}+
                </div>
                <div className="stat-l">Years Learning</div>
              </div>
            </div>
          </div>

          {/* RIGHT — Terminal */}
          <div className="anim-right home-terminal-col">
            <div className="term-card">
              <div className="term-header">
                <div className="term-dots">
                  <div className="term-dot td-r" />
                  <div className="term-dot td-y" />
                  <div className="term-dot td-g" />
                </div>

                <span className="term-title">
                  {truncateText(terminalName, 24)
                    .toLowerCase()
                    .replace(/\s+/g, "")}
                  @portfolio — bash
                </span>
              </div>

              <div className="term-body">
                <div className="tl">
                  <span className="tp">~$</span>
                  <span className="tc"> whoami</span>
                </div>

                <div className="to c">
                  {terminalName} — Full Stack Developer
                </div>

                <div className="tl" style={{ marginTop: "6px" }}>
                  <span className="tp">~$</span>
                  <span className="tc"> cat skills.json</span>
                </div>

                <div className="to" style={{ color: "#5a5f72" }}>
                  {"{"}
                </div>

                <div className="to">
                  <span style={{ color: "#00D4FF" }}>
                    &quot;frontend&quot;
                  </span>
                  <span style={{ color: "#5a5f72" }}>: </span>
                  <span style={{ color: "#4ade80" }}>
                    {JSON.stringify(skillCategories.frontend.join(", "))}
                  </span>
                  <span style={{ color: "#5a5f72" }}>,</span>
                </div>

                <div className="to">
                  <span style={{ color: "#00D4FF" }}>
                    &quot;backend&quot;
                  </span>
                  <span style={{ color: "#5a5f72" }}>: </span>
                  <span style={{ color: "#4ade80" }}>
                    {JSON.stringify(skillCategories.backend.join(", "))}
                  </span>
                  <span style={{ color: "#5a5f72" }}>,</span>
                </div>

                <div className="to">
                  <span style={{ color: "#00D4FF" }}>
                    &quot;tools&quot;
                  </span>
                  <span style={{ color: "#5a5f72" }}>: </span>
                  <span style={{ color: "#4ade80" }}>
                    {JSON.stringify(skillCategories.tools.join(", "))}
                  </span>
                </div>

                <div className="to" style={{ color: "#5a5f72" }}>
                  {"}"}
                </div>

                <div className="tl" style={{ marginTop: "6px" }}>
                  <span className="tp">~$</span>
                  <span className="tc"> git log --oneline</span>
                </div>

                {terminalProjects.length > 0 ? (
                  terminalProjects.map((project, index) => (
                    <div
                      className="to y terminal-project-name"
                      key={project._id || project.slug || project.title}
                      title={project.title}
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {getProjectId(project, index)}{" "}
                      {truncateText(project.title, 38)}
                    </div>
                  ))
                ) : (
                  <div className="to y">
                    No published projects yet.
                  </div>
                )}

                {/* Keep the existing status lines */}
                <div className="tl" style={{ marginTop: "6px" }}>
                  <span className="tp">~$</span>
                  <span className="tc"> node server.js</span>
                </div>

                <div className="to g">
                  ✓ Server running on port 5000
                </div>

                <div className="to g">
                  ✓ MongoDB connected
                </div>

                <div className="tl">
                  <span className="tp">~$</span>
                  <span className="tcursor" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center the two columns and add breathing room below the navbar */}
      <style>{`
        .home-grid {
          min-height: calc(100vh - 75px);
          align-items: center !important;
        }

        .home-grid > .anim-left {
          align-self: center;
        }

        .home-terminal-col {
          align-self: center;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding-top: 24px;
          box-sizing: border-box;
        }

        .home-terminal-col .term-card {
          width: 100%;
          max-width: 100%;
        }

        @media (max-width: 900px) {
          .home-grid {
            min-height: auto;
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }

          .home-terminal-col {
            width: 100% !important;
            padding-top: 12px;
          }

          .home-terminal-col .term-card {
            display: block !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }

        /* Fix horizontal overflow on Mobile S and Mobile M */
        @media (max-width: 400px) {
          .page-inner {
            width: 100%;
            max-width: 100%;
            padding-left: 14px;
            padding-right: 14px;
            box-sizing: border-box;
          }

          .home-grid,
          .home-grid > .anim-left,
          .home-grid > .home-terminal-col {
            width: 100%;
            min-width: 0;
            max-width: 100%;
            box-sizing: border-box;
          }

          /* Keep the main heading inside the screen */
          .home-name {
            font-size: clamp(2rem, 9vw, 2.4rem);
            overflow-wrap: anywhere;
          }

          .home-role {
            max-width: 100%;
            overflow-wrap: anywhere;
          }

          .home-blurb {
            width: 100%;
            max-width: 100%;
            overflow-wrap: anywhere;
          }

          /* Buttons can wrap instead of extending beyond the screen */
          .home-ctas {
            width: 100%;
            gap: 10px;
          }

          .home-ctas > a {
            min-width: 0;
            max-width: 100%;
          }

          .home-ctas button {
            max-width: 100%;
            padding-left: 14px;
            padding-right: 14px;
            white-space: normal;
          }

          /* Fit all three statistics within the available width */
          .home-stats {
            width: 100%;
            gap: 8px;
            justify-content: space-between;
            box-sizing: border-box;
          }

          .home-stats > div {
            min-width: 0;
            flex: 1;
          }

          .stat-n {
            font-size: 1.5rem;
          }

          .stat-l {
            font-size: 0.58rem;
            overflow-wrap: anywhere;
          }

          /* Prevent the terminal from increasing page width */
          .home-terminal-col {
            padding-left: 0;
            padding-right: 0;
            overflow: hidden;
          }

          .home-terminal-col .term-card {
            width: 100%;
            min-width: 0;
            max-width: 100%;
            box-sizing: border-box;
          }

          .term-header {
            min-width: 0;
            gap: 8px;
            padding: 10px 12px;
          }

          .term-title {
            min-width: 0;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .term-body {
            min-width: 0;
            padding: 14px 10px;
            font-size: 0.68rem;
            overflow-wrap: anywhere;
            word-break: break-word;
          }

          .tl {
            min-width: 0;
            flex-wrap: wrap;
            overflow-wrap: anywhere;
          }

          .tc,
          .to {
            min-width: 0;
            overflow-wrap: anywhere;
            word-break: break-word;
          }

          .terminal-project-name {
            max-width: 100%;
            white-space: normal !important;
            overflow-wrap: anywhere;
            word-break: break-word;
          }
        }
      `}</style>
    </div>
  );
}