// src/pages/Auth.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
} from "../firebase/auth";

const Auth = () => {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────
  const [isLogin, setIsLogin] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // ── Helpers ────────────────────────────────────────────────
  const clearForm = () => {
    setDisplayName("");
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleToggle = () => {
    setIsLogin((prev) => !prev);
    clearForm();
  };

  // ── Google sign-in ─────────────────────────────────────────
  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/library");
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Email submit ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!isLogin && !username) {
      setError("Please enter a username.");
      return;
    }
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!isLogin && !displayName) {
      setError("Please enter your name.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName, username);
      }
      navigate("/library");
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Firebase error codes → readable messages ───────────────
  const getErrorMessage = (code) => {
    switch (code) {
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Title */}
        <h1 style={styles.title}>🎬 CineLog</h1>
        <p style={styles.subtitle}>
          {isLogin ? "Welcome back" : "Create your account"}
        </p>

        {/* Error message */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Email/password form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Name field — sign up only */}
          {!isLogin && (
            <input
              style={styles.input}
              type="text"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          )}
          {!isLogin && (
            <input
              style={styles.input}
              type="text"
              placeholder="Username (e.g. john_doe)"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().replace(/\s/g, "_"))
              }
            />
          )}

          <input
            style={styles.input}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div style={styles.passwordWrapper}>
            <input
              style={{ ...styles.input, paddingRight: "44px" }}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              style={styles.eyeBtn}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <span style={styles.dividerLine} />
        </div>

        {/* Google button */}
        <button
          style={{ ...styles.googleButton, opacity: loading ? 0.7 : 1 }}
          onClick={handleGoogle}
          disabled={loading}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            style={{ width: 20, height: 20 }}
          />
          Continue with Google
        </button>

        {/* Toggle login / sign up */}
        <p style={styles.toggleText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span style={styles.toggleLink} onClick={handleToggle}>
            {isLogin ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
};

// ── Styles ─────────────────────────────────────────────────────
const styles = {
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f0f0f",
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: "40px 36px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid #2a2a2a",
  },
  title: {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "700",
    textAlign: "center",
    margin: "0 0 6px",
  },
  subtitle: {
    color: "#888",
    fontSize: "14px",
    textAlign: "center",
    margin: "0 0 24px",
  },
  error: {
    backgroundColor: "#2a1a1a",
    color: "#ff6b6b",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "16px",
    border: "1px solid #3a2020",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    backgroundColor: "#252525",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "12px 14px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    backgroundColor: "#e50914",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "4px",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "20px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#2a2a2a",
  },
  dividerText: {
    color: "#555",
    fontSize: "13px",
  },
  googleButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "#252525",
    color: "#ffffff",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "11px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  toggleText: {
    color: "#666",
    fontSize: "13px",
    textAlign: "center",
    marginTop: "20px",
  },
  toggleLink: {
    color: "#e50914",
    cursor: "pointer",
    fontWeight: "500",
  },
};

export default Auth;
