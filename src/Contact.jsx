import React, { useState, useEffect } from "react";
import { FaLinkedin, FaGithub, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import Modal from "./Modal";
import SEO from "./seo/SEO";
import seoData from "./seo/seoData";
import "./App.css";

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const CONTACTS = [
  { Icon: FaEnvelope,  label: "Email",    value: "nickshan001@gmail.com",     href: "mailto:nickshan001@gmail.com"           },
  { Icon: FaLinkedin,  label: "LinkedIn", value: "linkedin.com/in/nickshanj", href: "https://www.linkedin.com/in/nickshanj/" },
  { Icon: FaGithub,    label: "GitHub",   value: "github.com/NickshanJ",      href: "https://github.com/NickshanJ"          },
  { Icon: FaWhatsapp,  label: "WhatsApp", value: "+91 73581 76388",            href: "https://wa.me/7358176388"              },
];

export default function Contact() {
  const [modalMsg, setModalMsg] = useState("");
  const [modalVis, setModalVis] = useState(false);
  const [sending,  setSending]  = useState(false);

  useEffect(() => {
    document.body.classList.remove("allow-scroll");
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();
    setSending(true);

    const formData = new FormData(e.target);

    // Web3Forms requires these fields
    formData.append("access_key", WEB3FORMS_KEY);
    formData.append("subject",   formData.get("from_name")  + "- Portfolio ");
    formData.append("from_name",  formData.get("from_name"));

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body:   formData,
      });

      const data = await response.json();

      if (data.success) {
        setModalMsg("Your message was sent! I'll get back to you soon.");
        setModalVis(true);
        e.target.reset();
      } else {
        console.error("Web3Forms error:", data);
        setModalMsg("Something went wrong. Please email me directly at nickshan001@gmail.com");
        setModalVis(true);
      }
    } catch (err) {
      console.error("Network error:", err);
      setModalMsg("Network error. Please email me directly at nickshan001@gmail.com");
      setModalVis(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <SEO {...seoData.contact} />
      <div className="page-wrap" style={{ alignItems: "stretch", flexDirection: "column", justifyContent: "center" }}>
        <div className="page-inner" style={{ paddingTop: "1rem", paddingBottom: "0.5rem" }}>

          <div className="sec-label">Get In Touch</div>
          <h2 className="sec-title" style={{ marginBottom: "1.4rem" }}>
            Let's <span className="cyan">Work Together</span>
          </h2>

          <div className="contact-layout">

            {/* ── Left — contact info ── */}
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

            {/* ── Right — contact form ── */}
            <div className="anim-right">
              <div className="form-box">
                <form onSubmit={sendEmail}>

                  {/* Honeypot field — catches spam bots, must stay hidden */}
                  <input type="checkbox" name="botcheck" style={{ display: "none" }} />

                  {/* Name + Email row */}
                  <div className="form-2col">
                    <div className="form-grp" style={{ marginBottom: 0 }}>
                      <label className="f-lbl" htmlFor="from_name">Your Name *</label>
                      <input
                        className="f-inp"
                        type="text"
                        id="from_name"
                        name="from_name"
                        placeholder="Nickshan"
                        required
                      />
                    </div>
                    <div className="form-grp" style={{ marginBottom: 0 }}>
                      <label className="f-lbl" htmlFor="email">Your Email *</label>
                      <input
                        className="f-inp"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Nick@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Message */}
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

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn-cyan"
                    disabled={sending}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      opacity: sending ? 0.7 : 1,
                      cursor: sending ? "not-allowed" : "pointer",
                    }}
                  >
                    <FiSend size={14} />
                    {sending ? "Sending..." : "Send Message"}
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