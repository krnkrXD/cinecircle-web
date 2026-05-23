// src/components/ErrorBoundary.jsx

import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.page}>
          <p style={styles.icon}>⚠️</p>
          <h2 style={styles.title}>Something went wrong</h2>
          <p style={styles.message}>Please refresh the page and try again.</p>
          <button style={styles.btn} onClick={() => window.location.reload()}>
            Refresh page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0f0f0f",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  icon: {
    fontSize: "48px",
    margin: 0,
  },
  title: {
    color: "#fff",
    fontSize: "22px",
    fontWeight: "600",
    margin: 0,
  },
  message: {
    color: "#666",
    fontSize: "15px",
    margin: 0,
  },
  btn: {
    marginTop: "8px",
    backgroundColor: "#e50914",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 24px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default ErrorBoundary;
