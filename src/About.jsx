import React, { useEffect } from "react";
import { FaLinkedin, FaGithub, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { FiDownload, FiMail } from "react-icons/fi";
import profileImage from "./image/About Page.webp";
import resumePDF from "./assets/Resume - Nickshan J.pdf";
import "./App.css";

const SOCIALS = [
  { Icon: FaLinkedin, href: "https://www.linkedin.com/in/nickshanj/", label: "LinkedIn"  },
  { Icon: FaGithub,   href: "https://github.com/NickshanJ",           label: "GitHub"    },
  { Icon: FaEnvelope, href: "mailto:nickshan001@gmail.com",           label: "Email"     },
  { Icon: FaWhatsapp, href: "https://wa.me/7358176388",               label: "WhatsApp"  },
];

const META = [
  { label: "Name",      value: "J. Nickshan"           },
  { label: "Role",      value: "Full Stack Developer"   },
  { label: "Location",  value: "Tamil Nadu, India"      },
  { label: "Email",     value: "nickshan001@gmail.com"  },
];

export default function About() {
  useEffect(() => {
    document.body.classList.remove("allow-scroll");
  }, []);

  return (
    <div className="page-wrap">
      <div className="page-inner">
        <div className="sec-label">About Me</div>
        <h2 className="sec-title">
          The Developer <span className="cyan">Behind the Code</span>
        </h2>

        <div className="about-grid">

          {/* ── Photo column ── */}
          <div className="anim-left about-photo-col">
            <div className="about-photo-wrap">
              <img src={profileImage} alt="Nickshan J" />
              <div className="about-badge">
                MERN<br />Full Stack<br />Developer
              </div>
            </div>
            <div className="about-socials">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="soc-btn"
                  title={label}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Content column ── */}
          <div className="anim-right">
            <p className="about-bio">
              I'm a passionate <strong>Full Stack Developer</strong> who thrives on
              turning ideas into polished, real-world digital products. I specialise
              in the <strong>MERN stack</strong> and have a strong eye for clean,
              accessible UI design that users actually enjoy.
            </p>
            <p className="about-bio">
              I enjoy every part of the development journey — from architecting
              <strong> scalable back-end APIs</strong> and designing efficient
              database schemas, to crafting <strong>pixel-perfect interfaces</strong>{" "}
              that feel smooth and responsive across all devices. I believe great
              software is built at the intersection of creativity and technical
              excellence.
            </p>
            <p className="about-bio">
              With hands-on experience in <strong>React.js, Node.js, Express,
              MongoDB, MySQL</strong>, and tools like Postman and Git, I'm always
              looking to grow, collaborate, and contribute meaningful work. I stay
              current with industry trends and love exploring new technologies that
              make development faster and more enjoyable.
            </p>

            {/* Info grid */}
            <div className="about-meta">
              {META.map(({ label, value }) => (
                <div key={label} className="meta-item">
                  <div className="meta-lbl">{label}</div>
                  <div className="meta-val">{value}</div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                href={resumePDF}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button className="btn-cyan">
                  <FiDownload size={13} /> Download Resume
                </button>
              </a>
              <a href="mailto:nickshan001@gmail.com" style={{ textDecoration: "none" }}>
                <button className="btn-outline">
                  <FiMail size={13} /> Get In Touch
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive fix — inline so it's scoped to this page */}
      <style>{`
        /* Tablet & mobile: stack vertically, image centred & bigger */
        @media (max-width: 820px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .about-photo-col {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .about-photo-wrap {
            width: 100% !important;
            max-width: 320px !important;
            margin: 0 auto !important;
          }
          .about-photo-wrap img {
            width: 100% !important;
            height: auto !important;
          }
          .about-socials {
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}