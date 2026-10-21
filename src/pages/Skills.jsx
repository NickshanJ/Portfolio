import { useEffect, useState } from "react";
import {
  FaReact,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaGithub,
} from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiPostman,
  SiNetlify,
  SiRender,
  SiAmazons3,
} from "react-icons/si";
import SEO from "../seo/SEO";
import seoData from "../seo/seoData";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Import only the icons used by the skills stored in the database.
const ICONS = {
  FaReact,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaGithub,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiPostman,
  SiNetlify,
  SiRender,
  SiAmazons3,
};

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

        setSkills(Array.isArray(data.skills) ? data.skills : []);
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
            const Icon = ICONS[skill.icon];

            if (!Icon) {
              console.warn(
                `Unknown React Icon "${skill.icon}" for skill "${skill.name}".`,
              );

              return null;
            }

            const color = skill.color || "#61DAFB";

            return (
              <div
                key={skill._id || skill.name}
                className="skill-tile anim-up"
                style={{
                  animationDelay: `${i * 0.045}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = color + "77";
                  e.currentTarget.style.boxShadow = `0 10px 28px ${color}18`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div className="skill-icon">
                  <Icon size={28} color={color} />
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