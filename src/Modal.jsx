import React from 'react';
import "./App.css";

function Modal({ isVisible, message, onClose }) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-gradient-to-r from-[#141E30] to-[#243B55] text-white p-6 rounded-lg shadow-2xl max-w-xs w-full text-center animate-fade-in">
        {/* Checkmark animation */}
        <div className="checkmark-container mx-auto mb-4" style={{ width: '60px', height: '60px' }}>
          <svg
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className="checkmark"
            style={{ width: '60px', height: '60px' }}
          >
            <circle
              className="checkmark-circle"
              cx="32"
              cy="32"
              r="30"
              fill="none"
            />
            <path
              className="checkmark-check"
              fill="none"
              d="M20 33l8 8 16-16"
            />
          </svg>
        </div>
        {/* Message */}
        <p className="text-base mb-4">{message}</p>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="bg-[#FEE715FF] text-black px-4 py-1 rounded-full font-bold hover:scale-105 transition-transform hover:shadow-md hover:bg-[#FEDD5C]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;