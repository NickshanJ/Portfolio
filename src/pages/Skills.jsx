import { useEffect, useState } from "react";
import SEO from "../seo/SEO";
import seoData from "../seo/seoData";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Compatibility mappings for skills already stored in MongoDB.
// New skills should use Iconify identifiers directly.
const LEGACY_ICONS = {
  FaReact: "simple-icons:react",
  FaNodeJs: "simple-icons:nodedotjs",
  FaHtml5: "simple-icons:html5",
  FaCss3Alt: "simple-icons:css3",
  FaGithub: "simple-icons:github",
  SiJavascript: "simple-icons:javascript",
  SiTypescript: "simple-icons:typescript",
  SiTailwindcss: "simple-icons:tailwindcss",
  SiExpress: "simple-icons:express",
  SiMongodb: "simple-icons:mongodb",
  SiPostman: "simple-icons:postman",
  SiNetlify: "simple-icons:netlify",
  SiRender: "simple-icons:render",
  SiAmazons3: "simple-icons:amazonaws",
};

// Common short names that differ from their Simple Icons slug.
const SIMPLE_ICON_ALIASES = {
  html: "html5",
  css: "css3",
  js: "javascript",
  javascript: "javascript",
  typescript: "typescript",
  tailwind: "tailwindcss",
  node: "nodedotjs",
  nodejs: "nodedotjs",
  expressjs: "express",
  mongodb: "mongodb",
  mysql: "mysql",
  postgres: "postgresql",
  github: "github",
  git: "git",
  python: "python",
  java: "java",
  php: "php",
  docker: "docker",
  aws: "amazonaws",
  amazonaws: "amazonaws",
  firebase: "firebase",
  figma: "figma",
  wordpress: "wordpress",
  canva: "canva",
  react: "react",
  netlify: "netlify",
  render: "render",
  postman: "postman",
};

export function normalizeIconIdentifier(icon) {
  const raw = String(icon || "").trim();
  if (!raw) return "";

  const legacy = LEGACY_ICONS[raw];
  if (legacy) return legacy;

  // Keep complete Iconify IDs from any collection unchanged.
  if (raw.includes(":")) return raw.toLowerCase();

  const slug = raw.toLowerCase().replace(/\s+/g, "-");
  return `simple-icons:${SIMPLE_ICON_ALIASES[slug] || slug}`;
}

export function getIconUrl(icon) {
  const identifier = normalizeIconIdentifier(icon);
  const match = identifier.match(/^([a-z0-9-]+):([a-z0-9-]+)$/i);
  if (!match) return null;
  // Keep the source URL stable; CSS mask applies the selected skill color.
  return `https://api.iconify.design/${match[1]}/${match[2]}.svg`;
}

function SkillIcon({ icon, color, name }) {
  const iconUrl = getIconUrl(icon);
  const [failedSrc, setFailedSrc] = useState("");
  const failed = Boolean(iconUrl && failedSrc === iconUrl);

  if (!iconUrl || failed) {
    return (
      <span
        aria-label={`${name} icon unavailable`}
        title={`${name} icon unavailable`}
        style={{
          display: "inline-flex",
          width: 28,
          height: 28,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          backgroundColor: `${color}20`,
          color,
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {name.slice(0, 1).toUpperCase()}
      </span>
    );
  }

  return (
    <span
      key={iconUrl}
      role="img"
      aria-label={`${name} icon`}
      className="inline-block"
      style={{
        width: 28,
        height: 28,
        backgroundColor: color || "#61DAFB",
        WebkitMask: `url("${iconUrl}") center / contain no-repeat`,
        mask: `url("${iconUrl}") center / contain no-repeat`,
      }}
    >
      <img src={iconUrl} alt="" width="28" height="28" loading="lazy" onError={() => setFailedSrc(iconUrl)} style={{ display: "none" }} />
    </span>
  );
}

export default function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    document.body.classList.remove("allow-scroll");
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSkills() {
      try {
        const response = await fetch(`${API_URL}/api/skills`, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to fetch skills.");
        }

        const publishedSkills = Array.isArray(data.skills)
          ? data.skills.filter((skill) => skill.published !== false)
          : [];

        publishedSkills.sort(
          (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0),
        );

        setSkills(publishedSkills);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch skills:", error);
        }
      }
    }

    fetchSkills();

    return () => controller.abort();
  }, []);

  return (
    <div className="page-wrap">
      <SEO {...seoData.skills} />

      <div className="page-inner">
        <div className="sec-label">Tech Stack</div>

        <h2 className="sec-title">
          Tools &amp; <span className="cyan">Technologies</span>
        </h2>

        <p
          style={{
            fontFamily: "var(--sans)",
            fontSize: "0.88rem",
            color: "var(--muted)",
            lineHeight: 1.7,
            maxWidth: "500px",
            marginBottom: "0.5rem",
            marginTop: "0.3rem",
          }}
        >
          Modern tools I use to build fast, scalable web applications — from
          sleek front-end interfaces to robust back-end APIs.
        </p>

        <div className="skills-grid">
          {skills.map((skill, i) => {
            const color = /^#[0-9a-f]{6}$/i.test(skill.color || "")
              ? skill.color
              : "#61DAFB";

            return (
              <div
                key={skill._id || skill.name}
                className="skill-tile anim-up"
                style={{
                  animationDelay: `${i * 0.045}s`,
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.borderColor = `${color}77`;
                  event.currentTarget.style.boxShadow = `0 10px 28px ${color}18`;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.borderColor = "";
                  event.currentTarget.style.boxShadow = "";
                }}
              >
                <div className="skill-icon">
                  <SkillIcon
                    icon={skill.icon || ""}
                    color={color}
                    name={skill.name || "Skill"}
                  />
                </div>

                <span className="skill-lbl">{skill.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}