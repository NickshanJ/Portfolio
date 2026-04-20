import React, { useState, useEffect } from "react";

function DynamicText({ texts, typingSpeed = 65, pauseDuration = 1800 }) {
  const [display, setDisplay]   = useState("");
  const [idx, setIdx]           = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!deleting) {
        if (display.length < texts[idx].length) {
          setDisplay(texts[idx].slice(0, display.length + 1));
        } else {
          setTimeout(() => setDeleting(true), pauseDuration);
        }
      } else {
        if (display.length > 0) {
          setDisplay(display.slice(0, -1));
        } else {
          setDeleting(false);
          setIdx((idx + 1) % texts.length);
        }
      }
    }, typingSpeed);
    return () => clearTimeout(t);
  }, [display, deleting, idx, texts, typingSpeed, pauseDuration]);

  return <span className="typed">{display}</span>;
}

export default DynamicText;