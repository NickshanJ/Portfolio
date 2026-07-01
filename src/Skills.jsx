import React, { useEffect } from "react";
import {
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs,
  FaGithub,
} from "react-icons/fa";
import {
  SiTailwindcss, SiExpress, SiMongodb, SiMysql, SiPostman, SiNetlify, SiRender
} from "react-icons/si";
import SEO from "./seo/SEO";
import seoData from "./seo/seoData";
import "./App.css";

const SKILLS = [
  { name: "HTML5",       Icon: FaHtml5,      color: "#E44D26" },
  { name: "CSS3",        Icon: FaCss3Alt,     color: "#1572B6" },
  { name: "Tailwind CSS",Icon: SiTailwindcss, color: "#38B2AC" },
  { name: "JavaScript",  Icon: FaJs,          color: "#F7DF1E" },
  { name: "React.js",    Icon: FaReact,       color: "#61DAFB" },
  { name: "Node.js",     Icon: FaNodeJs,      color: "#68A063" },
  { name: "Express.js",  Icon: SiExpress,     color: "#00D4FF" },
  { name: "MongoDB",     Icon: SiMongodb,     color: "#47A248" },
  { name: "MySQL",       Icon: SiMysql,       color: "#4479A1" },
  { name: "GitHub",      Icon: FaGithub,      color: "#e2e6f0" },
  { name: "Postman",     Icon: SiPostman,     color: "#FF6C37" },
  { name: "Netlify",     Icon: SiNetlify,     color: "#00ff91ff" },
  { name: "Render",      Icon: SiRender,      color: "#00ff91ff" },
];

export default function Skills() {
  useEffect(() => {
    document.body.classList.remove("allow-scroll");
  }, []);

  return (
    <div className="page-wrap">
      <SEO {...seoData.skills} />
      <div className="page-inner">
        <div className="sec-label">Tech Stack</div>
        <h2 className="sec-title">
          Tools &amp; <span className="cyan">Technologies</span>
        </h2>

        <p style={{
          fontFamily: "var(--sans)",
          fontSize: "0.88rem",
          color: "var(--muted)",
          lineHeight: 1.7,
          maxWidth: "500px",
          marginBottom: "0.5rem",
          marginTop: "0.3rem",
        }}>
          Modern tools I use to build fast, scalable web applications — from
          sleek front-end interfaces to robust back-end APIs.
        </p>

        <div className="skills-grid">
          {SKILLS.map(({ name, Icon, color }, i) => (
            <div
              key={name}
              className="skill-tile anim-up"
              style={{ animationDelay: `${i * 0.045}s` }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = color + "77";
                e.currentTarget.style.boxShadow  = `0 10px 28px ${color}18`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow  = "";
              }}
            >
              <div className="skill-icon">
                <Icon size={28} color={color} />
              </div>
              <span className="skill-lbl">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}