// src/components/Toast.jsx
import { useEffect } from "react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const accent =
    type === "error" ? "#C41E1E" : type === "info" ? "#8B7355" : "#1A1A1A";

  return (
    <div style={{ ...s.toast, borderLeft: `4px solid ${accent}` }}>
      <span style={{ ...s.dot, background: accent }} />
      <span style={s.msg}>{message}</span>
      <button style={s.close} onClick={onClose}>
        ✕
      </button>
    </div>
  );
};

const s = {
  toast: {
    position: "fixed",
    bottom: "32px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#F5F0E8",
    border: "2px solid #1A1A1A",
    boxShadow: "4px 4px 0 #1A1A1A",
    padding: "12px 18px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    color: "#1A1A1A",
    zIndex: 9999,
    minWidth: "260px",
    maxWidth: "380px",
    animation: "slideUp 0.2s ease",
    letterSpacing: "0.04em",
  },
  dot: { width: "8px", height: "8px", flexShrink: 0 },
  msg: { flex: 1 },
  close: {
    background: "transparent",
    border: "none",
    color: "#8B7355",
    cursor: "pointer",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    padding: 0,
    flexShrink: 0,
  },
};

export default Toast;
