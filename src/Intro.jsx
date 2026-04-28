import React, { useState, useEffect } from "react";

export default function Intro({ onDone }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out at 2.0s, call onDone at 2.4s (after transition finishes)
    const fadeTimer = setTimeout(() => setFadeOut(true), 2000);
    const doneTimer = setTimeout(() => onDone(), 2400);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "#020207",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "32px",
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 0.4s ease",
          pointerEvents: fadeOut ? "none" : "all",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
              fontWeight: 700,
              color: "#00D4FF",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              animation: "introLogoIn 0.6s cubic-bezier(.16,1,.3,1) both",
            }}
          >
            NJ<span style={{ color: "#ffffff" }}>.</span>dev
          </div>

          {/* Blinking tagline */}
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "clamp(0.6rem, 2vw, 0.75rem)",
              color: "#5a5f72",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              marginTop: "12px",
              animation: "introFadeUp 0.7s 0.3s cubic-bezier(.16,1,.3,1) both",
            }}
          >
            Full Stack Developer
          </p>
        </div>

        {/* Loading bar */}
        <div
          style={{
            width: "clamp(160px, 30vw, 240px)",
            height: "2px",
            background: "rgba(0,212,255,0.12)",
            borderRadius: "2px",
            overflow: "hidden",
            animation: "introFadeUp 0.7s 0.5s cubic-bezier(.16,1,.3,1) both",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "#00D4FF",
              borderRadius: "2px",
              animation: "introBarFill 1.8s 0.3s cubic-bezier(.4,0,.2,1) forwards",
              width: "0%",
              boxShadow: "0 0 10px rgba(0,212,255,0.6)",
            }}
          />
        </div>

        {/* Blinking dot */}
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#00D4FF",
            animation: "introFadeUp 0.5s 0.4s both, introDotBlink 0.9s 0.8s step-end infinite",
            boxShadow: "0 0 12px rgba(0,212,255,0.7)",
          }}
        />
      </div>

      {/* Scoped keyframes */}
      <style>{`
        @keyframes introLogoIn {
          from { opacity: 0; transform: scale(0.88) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes introFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes introBarFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes introDotBlink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0; }
        }
      `}</style>
    </>
  );
}