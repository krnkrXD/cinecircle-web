// src/components/ErrorBoundary.jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={s.page}>
        {/* Top rule */}
        <div style={s.topRule} />

        <div style={s.inner}>
          {/* Stamp */}
          <div style={s.stamp}>
            <div style={s.stampInner}>
              <div style={s.stampWord}>ERROR</div>
              <div style={s.stampSub}>Something broke</div>
            </div>
          </div>

          {/* Copy */}
          <div style={s.copy}>
            <div style={s.eyebrow}>— System fault —</div>
            <h1 style={s.heading}>
              The projector
              <br />
              has jammed.
            </h1>
            <p style={s.body}>
              An unexpected error occurred. The film cannot continue. Please
              refresh the page to try again.
            </p>

            {/* Error detail */}
            {this.state.error && (
              <div style={s.errorBox}>
                <div style={s.errorLabel}>Error detail</div>
                <div style={s.errorMsg}>
                  {this.state.error.message || "Unknown error"}
                </div>
              </div>
            )}

            <div style={s.actions}>
              <button
                style={s.primaryBtn}
                onClick={() => window.location.reload()}
              >
                Reload page →
              </button>
              <button
                style={s.secondaryBtn}
                onClick={() => (window.location.href = "/")}
              >
                Go to library
              </button>
            </div>
          </div>
        </div>

        {/* Bottom rule */}
        <div style={s.bottomRule}>
          <span style={s.bottomText}>
            CINELOG · EST. 2024 · ALL FILMS PRESERVED
          </span>
        </div>
      </div>
    );
  }
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#F5F0E8",
    display: "flex",
    flexDirection: "column",
  },
  topRule: {
    height: "6px",
    background: "#C41E1E",
    borderBottom: "2px solid #1A1A1A",
  },
  inner: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "60px",
    padding: "60px 40px",
    flexWrap: "wrap",
    maxWidth: "860px",
    margin: "0 auto",
    width: "100%",
  },
  stamp: {
    width: "180px",
    height: "180px",
    border: "4px solid #C41E1E",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "rotate(-8deg)",
    flexShrink: 0,
    boxShadow: "6px 6px 0 #1A1A1A",
    background: "#F5F0E8",
  },
  stampInner: {
    border: "2px solid #C41E1E",
    padding: "12px 16px",
    textAlign: "center",
  },
  stampWord: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "36px",
    fontWeight: 900,
    color: "#C41E1E",
    letterSpacing: "0.1em",
    lineHeight: 1,
  },
  stampSub: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "9px",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#C41E1E",
    marginTop: "6px",
  },
  copy: { flex: 1, minWidth: "280px" },
  eyebrow: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.14em",
    color: "#8B7355",
    marginBottom: "8px",
  },
  heading: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "42px",
    fontWeight: 900,
    color: "#1A1A1A",
    lineHeight: 1.1,
    marginBottom: "16px",
  },
  body: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "13px",
    color: "#8B7355",
    lineHeight: 1.7,
    marginBottom: "20px",
  },
  errorBox: {
    border: "2px solid #1A1A1A",
    background: "#E8E0D0",
    padding: "12px 14px",
    marginBottom: "24px",
  },
  errorLabel: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "9px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#8B7355",
    marginBottom: "6px",
  },
  errorMsg: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    color: "#C41E1E",
    wordBreak: "break-word",
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    background: "#1A1A1A",
    color: "#F5F0E8",
    border: "2px solid #1A1A1A",
    boxShadow: "4px 4px 0 #8B7355",
    padding: "12px 24px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "#F5F0E8",
    color: "#1A1A1A",
    border: "2px solid #1A1A1A",
    boxShadow: "4px 4px 0 #1A1A1A",
    padding: "12px 24px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  bottomRule: {
    borderTop: "2px solid #1A1A1A",
    padding: "14px 28px",
    display: "flex",
    justifyContent: "center",
  },
  bottomText: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "9px",
    letterSpacing: "0.2em",
    color: "#C4B99A",
  },
};

export default ErrorBoundary;
