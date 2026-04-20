import React from "react";
import "./App.css";

export default function Modal({ visible, message, onClose }) {
  if (!visible) return null;
  return (
    <div className="modal-bg">
      <div className="modal-box">
        <div style={{ width: 60, height: 60, margin: "0 auto" }}>
          <svg
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className="checkmark"
            style={{ width: 60, height: 60 }}
          >
            <circle className="checkmark-circle" cx="32" cy="32" r="30" />
            <path className="checkmark-check" fill="none" d="M20 33l8 8 16-16" />
          </svg>
        </div>
        <p className="modal-tag">Sent Successfully</p>
        <p className="modal-msg">{message}</p>
        <button className="btn-cyan" onClick={onClose} style={{ margin: "0 auto" }}>
          Done
        </button>
      </div>
    </div>
  );
}