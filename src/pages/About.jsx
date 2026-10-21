import { useEffect, useState } from "react";
import { FaLinkedin, FaGithub, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { FiDownload, FiMail } from "react-icons/fi";
import profileImage from "../image/Nickshan-Linkedin.webp";
import SEO from "../seo/SEO";
import seoData from "../seo/seoData";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const SOCIALS = [
  {
    Icon: FaLinkedin,
    href: "https://www.linkedin.com/in/nickshanj/",
    label: "LinkedIn",
  },
  { Icon: FaGithub, href: "https://github.com/NickshanJ", label: "GitHub" },
  { Icon: FaEnvelope, href: "mailto:nickshan001@gmail.com", label: "Email" },
  { Icon: FaWhatsapp, href: "https://wa.me/7358176388", label: "WhatsApp" },
];

const DEFAULT_PARAGRAPHS = [
  "I'm a passionate Full Stack Developer who thrives on turning ideas into polished, real-world digital products. I specialise in the MERN stack and have a strong eye for clean, accessible UI design that users actually enjoy.",
  "I enjoy every part of the development journey — from architecting scalable back-end APIs and designing efficient database schemas, to crafting pixel-perfect interfaces that feel smooth and responsive across all devices. I believe great software is built at the intersection of creativity and technical excellence.",
  "With hands-on experience in React.js, Node.js, Express, MongoDB, MySQL, and tools like Postman and Git, I'm always looking to grow, collaborate, and contribute meaningful work. I stay current with industry trends and love exploring new technologies that make development faster and more enjoyable.",
];

const DEFAULT_META = [
  { label: "Name", value: "J. Nickshan" },
  { label: "Role", value: "Full Stack Developer" },
  { label: "Location", value: "Tamil Nadu, India" },
  { label: "Email", value: "nickshan001@gmail.com" },
];

function renderHighlightedText(text) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong className="cyan" key={index}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

export default function About() {
  const [resumeURL, setResumeURL] = useState("");
  const [about, setAbout] = useState({
    profileImage: { url: "", publicId: "" },
    paragraphs: [],
    infoItems: [],
  });

  useEffect(() => {
    document.body.classList.remove("allow-scroll");
  }, []);

  // Fetch About content managed through the dashboard.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchAbout() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/about`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch About content.");
        }

        const data = await response.json();

        if (!data.success || !data.about) {
          throw new Error(data.message || "Unable to load About content.");
        }

        setAbout({
          profileImage: data.about.profileImage || { url: "", publicId: "" },
          paragraphs: Array.isArray(data.about.paragraphs)
            ? [...data.about.paragraphs].sort(
                (a, b) => (a.order ?? 0) - (b.order ?? 0),
              )
            : [],
          infoItems: Array.isArray(data.about.infoItems)
            ? [...data.about.infoItems].sort(
                (a, b) => (a.order ?? 0) - (b.order ?? 0),
              )
            : [],
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Unable to load About content:", error);
        }
      }
    }

    fetchAbout();

    return () => controller.abort();
  }, []);

  // Keep the existing resume settings API.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchResume() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/settings/resume`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch resume settings.");
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
  }, []);

  const displayImage = about.profileImage?.url || profileImage;

  const displayParagraphs =
    about.paragraphs.length > 0
      ? about.paragraphs
      : DEFAULT_PARAGRAPHS.map((text, order) => ({ text, order }));

  const displayMeta =
    about.infoItems.length > 0 ? about.infoItems : DEFAULT_META;

  return (
    <div className="page-wrap">
      <SEO {...seoData.about} />

      <div className="page-inner">
        <div className="sec-label">About Me</div>

        <h2 className="sec-title">
          The Developer <span className="cyan">Behind the Code</span>
        </h2>

        <div className="about-grid">
          {/* Photo column */}
          <div className="anim-left about-photo-col">
            <div className="about-photo-wrap">
              <img src={displayImage} alt="Nickshan J" />

              <div className="about-badge">
                MERN
                <br />
                Full Stack
                <br />
                Developer
              </div>
            </div>

            {/* Keep social links static */}
            <div className="about-socials">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="soc-btn"
                  title={label}
                  aria-label={label}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Content column */}
          <div className="anim-right">
            <div
              className="about-bio-list"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {displayParagraphs.map((paragraph, index) => (
                <p
                  className="about-bio"
                  key={paragraph._id || index}
                  style={{ margin: 0 }}
                >
                  {renderHighlightedText(paragraph.text)}
                </p>
              ))}
            </div>

            {/* Dynamic information cards */}
            <div className="about-meta" style={{ marginTop: "16px" }}>
              {displayMeta.map(({ label, value }, index) => (
                <div key={`${label}-${index}`} className="meta-item">
                  <div className="meta-lbl">{label}</div>
                  <div className="meta-val">{value}</div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                href={resumeURL || undefined}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
                onClick={(event) => {
                  if (!resumeURL) event.preventDefault();
                }}
                aria-disabled={!resumeURL}
              >
                <button className="btn-cyan" disabled={!resumeURL}>
                  <FiDownload size={13} /> Download Resume
                </button>
              </a>

              <a
                href="mailto:nickshan001@gmail.com"
                style={{ textDecoration: "none" }}
              >
                <button className="btn-outline">
                  <FiMail size={13} /> Get In Touch
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive fix — preserve the existing layout */}
      <style>{`
      /* Responsive fix — preserve desktop and tablet layouts */
      @media (max-width: 820px) {
        .about-grid {
          grid-template-columns: 1fr !important;
          gap: 32px !important;
        }

        .about-photo-col {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          min-width: 0;
        }
        .about-grid {
          margin-top: 30px !important;
        }

        /* Reduce the profile image to 60% on mobile */
        .about-photo-wrap {
          width: 80% !important;
          max-width: 320px !important;
          margin: 0 auto !important;
        }

        .about-photo-wrap img {
          display: block;
          width: 100% !important;
          height: auto !important;
        }

        .about-socials {
          justify-content: center !important;
        }

        /* Display Name, Role, Location and Email one per row */
        .about-meta {
          grid-template-columns: 1fr !important;
          gap: 10px !important;
        }

        .about-meta .meta-item {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .meta-val {
          overflow-wrap: anywhere;
        }
      }
      `}</style>
    </div>
  );
}
