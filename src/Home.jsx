import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import DynamicText from "./DynamicText";
import resumePDF from "./assets/Resume - Nickshan J.pdf";
import { FiDownload, FiArrowRight } from "react-icons/fi";
import "./App.css";

export default function Home() {
  useEffect(() => {
    document.body.classList.remove("allow-scroll");
  }, []);

  return (
    <div className="page-wrap">
      <div className="page-inner">
        <div className="home-grid">

          {/* ── LEFT — Text content ── */}
          <div className="anim-left">
            {/* Status badge */}
            <div className="home-status">
              <span className="home-status-dot" />
              <span className="home-status-txt">Open to Opportunities</span>
            </div>

            <p className="home-greeting">Hello, I'm</p>

            <h1 className="home-name">
              J. Nickshan
              <span className="home-name-cyan">.</span>
            </h1>

            <p className="home-role">
              &gt;_{" "}
              <DynamicText
                texts={[
                  "Front-End Developer",
                  "MERN Full Stack Developer",
                  "React Specialist",
                ]}
              />
              <span className="cursor-blink"> |</span>
            </p>

            <p className="home-blurb">
              Passionate about building performant, pixel-perfect web apps. From
              clean UIs to robust back-end systems — I bring ideas to life with
              modern technologies.
            </p>

            <div className="home-ctas">
              <a
                href={resumePDF}
                target="_blank"
                rel="nofollow noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button className="btn-cyan">
                  <FiDownload size={14} /> Resume
                </button>
              </a>
              <Link to="/projects" style={{ textDecoration: "none" }}>
                <button className="btn-outline">
                  View Projects <FiArrowRight size={14} />
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="home-stats">
              <div>
                <div className="stat-n">4+</div>
                <div className="stat-l">Projects Built</div>
              </div>
              <div>
                <div className="stat-n">10+</div>
                <div className="stat-l">Technologies</div>
              </div>
              <div>
                <div className="stat-n">2+</div>
                <div className="stat-l">Years Learning</div>
              </div>
            </div>
          </div>

          {/* ── RIGHT — Terminal card ── */}
          <div
            className="anim-right home-terminal-col"
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <div className="term-card">
              {/* Title bar */}
              <div className="term-header">
                <div className="term-dots">
                  <div className="term-dot td-r" />
                  <div className="term-dot td-y" />
                  <div className="term-dot td-g" />
                </div>
                <span className="term-title">nickshan@portfolio — bash</span>
              </div>

              {/* Terminal body */}
              <div className="term-body">
                <div className="tl">
                  <span className="tp">~$</span>
                  <span className="tc"> whoami</span>
                </div>
                <div className="to c">J. Nickshan — Full Stack Developer</div>

                <div className="tl" style={{ marginTop: "6px" }}>
                  <span className="tp">~$</span>
                  <span className="tc"> cat skills.json</span>
                </div>
                <div className="to" style={{ color: "#5a5f72" }}>{`{`}</div>
                <div className="to">
                  <span style={{ color: "#00D4FF" }}>"frontend"</span>
                  <span style={{ color: "#5a5f72" }}>: </span>
                  <span style={{ color: "#4ade80" }}>"React, Tailwind, JS"</span>
                  <span style={{ color: "#5a5f72" }}>,</span>
                </div>
                <div className="to">
                  <span style={{ color: "#00D4FF" }}>"backend"</span>
                  <span style={{ color: "#5a5f72" }}>:  </span>
                  <span style={{ color: "#4ade80" }}>"Node, Express, MongoDB"</span>
                  <span style={{ color: "#5a5f72" }}>,</span>
                </div>
                <div className="to">
                  <span style={{ color: "#00D4FF" }}>"tools"</span>
                  <span style={{ color: "#5a5f72" }}>:   </span>
                  <span style={{ color: "#4ade80" }}>"Git, Postman, VSCode"</span>
                </div>
                <div className="to" style={{ color: "#5a5f72" }}>{`}`}</div>

                <div className="tl" style={{ marginTop: "6px" }}>
                  <span className="tp">~$</span>
                  <span className="tc"> git log --oneline</span>
                </div>
                <div className="to y">a3f2c1d Vehicle Rental Platform</div>
                <div className="to y">b8e9f2a Movies Search App</div>
                <div className="to y">c7d4a3b Student Teacher Portal</div>
                <div className="to y">d1f8b2e Event Management System</div>

                <div className="tl" style={{ marginTop: "6px" }}>
                  <span className="tp">~$</span>
                  <span className="tc"> node server.js</span>
                </div>
                <div className="to g">✓ Server running on port 5000</div>
                <div className="to g">✓ MongoDB connected</div>

                <div className="tl">
                  <span className="tp">~$</span>
                  <span className="tcursor" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive: stack terminal below text on tablet & mobile */}
      <style>{`
        @media (max-width: 900px) {
          /* Remove the old display:none on term-card from App.css */
          .home-terminal-col {
            display: flex !important;
            justify-content: center !important;
            width: 100% !important;
          }
          .term-card {
            display: block !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          /* Stack grid vertically */
          .home-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </div>
  );
}