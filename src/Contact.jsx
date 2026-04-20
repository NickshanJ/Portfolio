import React, { useState, useEffect } from "react";
import { FaLinkedin, FaGithub, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import emailjs from "emailjs-com";
import config from "./config";
import Modal from "./Modal";
import "./App.css";

const CONTACTS = [
  { Icon: FaEnvelope,  label: "Email",    value: "nickshan001@gmail.com",      href: "mailto:nickshan001@gmail.com"           },
  { Icon: FaLinkedin,  label: "LinkedIn", value: "linkedin.com/in/nickshanj",  href: "https://www.linkedin.com/in/nickshanj/" },
  { Icon: FaGithub,    label: "GitHub",   value: "github.com/NickshanJ",       href: "https://github.com/NickshanJ"          },
  { Icon: FaWhatsapp,  label: "WhatsApp", value: "+91 73581 76388",             href: "https://wa.me/7358176388"              },
];

export default function Contact() {
  const [modalMsg, setModalMsg] = useState("");
  const [modalVis, setModalVis] = useState(false);

  useEffect(() => {
    document.body.classList.remove("allow-scroll");
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(config.SERVICE_ID, config.TEMPLATE_ID, e.target, config.USER_ID)
      .then(
        () => { setModalMsg("Your message was sent! I'll get back to you soon."); setModalVis(true); },
        () => { setModalMsg("Something went wrong. Please email me directly."); setModalVis(true); }
      );
    e.target.reset();
  };

  return (
    <>
      <div className="page-wrap" style={{ alignItems: "stretch", flexDirection: "column", justifyContent: "center" }}>
        <div className="page-inner" style={{ paddingTop: "1rem", paddingBottom: "0.5rem" }}>
          <div className="sec-label">Get In Touch</div>
          <h2 className="sec-title" style={{ marginBottom: "1.4rem" }}>
            Let's <span className="cyan">Work Together</span>
          </h2>

          <div className="contact-layout">
            {/* Left */}
            <div className="anim-left">
              <p className="contact-intro">
                I'm always open to discussing <strong>new projects</strong>,
                creative ideas, or opportunities to build something great.
                Drop me a message — I'd love to connect.
              </p>

              {CONTACTS.map(({ Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-row"
                >
                  <div className="cr-icon"><Icon size={14} /></div>
                  <div>
                    <div className="cr-lbl">{label}</div>
                    <div className="cr-val">{value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Right — form */}
            <div className="anim-right">
              <div className="form-box">
                <form onSubmit={sendEmail}>
                  <div className="form-2col">
                    <div className="form-grp" style={{ marginBottom: 0 }}>
                      <label className="f-lbl" htmlFor="from_name">Your Name *</label>
                      <input className="f-inp" type="text" id="from_name" name="from_name" placeholder="John Doe" required />
                    </div>
                    <div className="form-grp" style={{ marginBottom: 0 }}>
                      <label className="f-lbl" htmlFor="reply_to">Your Email *</label>
                      <input className="f-inp" type="email" id="reply_to" name="reply_to" placeholder="john@example.com" required />
                    </div>
                  </div>

                  <div className="form-grp" style={{ marginTop: "13px" }}>
                    <label className="f-lbl" htmlFor="message">Message</label>
                    <textarea
                      className="f-inp"
                      id="message"
                      name="message"
                      placeholder="Tell me about your project..."
                      rows="4"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-cyan"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <FiSend size={14} /> Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-bar">
          <p className="footer-copy">
            © 2025 J. Nickshan · Built with React &amp; Tailwind CSS ·{" "}
            <a href="https://storyset.com/" target="_blank" rel="nofollow noopener noreferrer">
              Storyset
            </a>
          </p>
          <div className="footer-soc">
            {CONTACTS.slice(0, 3).map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="soc-btn"
                title={label}
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <Modal
        visible={modalVis}
        message={modalMsg}
        onClose={() => setModalVis(false)}
      />
    </>
  );
}