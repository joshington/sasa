


"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "256706626855";
const WHATSAPP_MESSAGE = "Hi Pesasa! I'd like to learn more about your platform.";

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <>
      <style>{`
        .wa-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #25d366;
          border-radius: 999px;
          padding: 13px 20px 13px 16px;
          box-shadow: 0 4px 20px rgba(37,211,102,0.45);
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .wa-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(37,211,102,0.55);
        }
        .wa-icon {
          width: 26px;
          height: 26px;
          flex-shrink: 0;
        }
        .wa-label {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          max-width: 0;
          opacity: 0;
          transition: max-width 0.3s ease, opacity 0.3s ease;
        }
        .wa-label.visible {
          max-width: 160px;
          opacity: 1;
        }
        .wa-pulse {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 12px;
          height: 12px;
          background: #ff4444;
          border-radius: 50%;
          border: 2px solid #ffffff;
          animation: waPulse 2s infinite;
        }
        @keyframes waPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
      `}</style>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-btn"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Chat with us on WhatsApp"
      >
        <svg className="wa-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#25d366"/>
          <path d="M22.5 9.5A9.1 9.1 0 0 0 7.3 20.6L6 26l5.6-1.3a9.1 9.1 0 0 0 4.4 1.1 9.1 9.1 0 0 0 6.5-15.3z" fill="#ffffff"/>
          <path d="M20.5 18.9c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.1-.3.2-.5 0-.2 0-.4-.1-.5-.1-.1-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.1 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z" fill="#25d366"/>
        </svg>

        <span className={`wa-label${hovered ? " visible" : ""}`}>
          Chat with us
        </span>

        <span className="wa-pulse" />
      </a>
    </>
  );
}