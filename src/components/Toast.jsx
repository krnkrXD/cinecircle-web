// src/components/Toast.jsx

import { useEffect } from "react";

const Toast = ({ message, type = "success", onClose }) => {
  // Auto dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "#1a3a1a",
    error: "#2a1a1a",
    info: "#1a1a2e",
  }[type];

  const textColor = {
    success: "#4caf50",
    error: "#ff6b6b",
    info: "#7986cb",
  }[type];

  const borderColor = {
    success: "#2d5a2d",
    error: "#3a2020",
    info: "#2a2a4a",
  }[type];

  const icon = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  }[type];

  return (
    <div
      style={{
        ...styles.toast,
        backgroundColor: bgColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      <span style={styles.icon}>{icon}</span>
      <span>{message}</span>
      <button
        style={{ ...styles.closeBtn, color: textColor }}
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  );
};

const styles = {
  toast: {
    position: "fixed",
    bottom: "32px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 20px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    zIndex: 9999,
    minWidth: "260px",
    maxWidth: "400px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    animation: "slideUp 0.2s ease",
  },
  icon: {
    fontSize: "16px",
    flexShrink: 0,
  },
  closeBtn: {
    marginLeft: "auto",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    padding: 0,
    flexShrink: 0,
  },
};

export default Toast;
