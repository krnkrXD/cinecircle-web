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
  const [isLogin, setIsLogin] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearForm = () => {
    setDisplayName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleToggle = () => {
    setIsLogin((p) => !p);
    clearForm();
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/library");
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Please fill in all fields.");
    if (!isLogin && !displayName) return setError("Please enter your name.");
    if (!isLogin && !username) return setError("Please enter a username.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      if (isLogin) await signInWithEmail(email, password);
      else await signUpWithEmail(email, password, displayName, username);
      navigate("/library");
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

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
        return "Too many attempts. Try again later.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoWrap}>
          <div style={s.logoEyebrow}>— est. 2024 —</div>
          <h1 style={s.logo}>CINELOG</h1>
          <div style={s.logoSub}>Your personal film ledger</div>
        </div>

        {/* Tab toggle */}
        <div style={s.tabs}>
          <button
            style={{ ...s.tab, ...(isLogin ? s.tabActive : {}) }}
            onClick={() => {
              setIsLogin(true);
              clearForm();
            }}
          >
            Sign in
          </button>
          <button
            style={{ ...s.tab, ...(!isLogin ? s.tabActive : {}) }}
            onClick={() => {
              setIsLogin(false);
              clearForm();
            }}
          >
            Register
          </button>
        </div>

        {/* Error */}
        {error && <div style={s.error}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={s.form}>
          {!isLogin && (
            <>
              <div style={s.fieldWrap}>
                <label style={s.label}>Full name</label>
                <input
                  style={s.input}
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div style={s.fieldWrap}>
                <label style={s.label}>Username</label>
                <input
                  style={s.input}
                  type="text"
                  placeholder="e.g. cinephile_42"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value.toLowerCase().replace(/\s/g, "_"),
                    )
                  }
                />
              </div>
            </>
          )}

          <div style={s.fieldWrap}>
            <label style={s.label}>Email</label>
            <input
              style={s.input}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={s.fieldWrap}>
            <label style={s.label}>Password</label>
            <div style={s.passwordWrap}>
              <input
                style={{ ...s.input, paddingRight: "44px" }}
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                style={s.eyeBtn}
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? "○" : "●"}
              </button>
            </div>
          </div>

          <button
            style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Sign in →"
                : "Create account →"}
          </button>
        </form>

        {/* Divider */}
        <div style={s.divider}>
          <span style={s.dividerLine} />
          <span style={s.dividerText}>or continue with</span>
          <span style={s.dividerLine} />
        </div>

        {/* Google */}
        <button
          style={{ ...s.googleBtn, opacity: loading ? 0.7 : 1 }}
          onClick={handleGoogle}
          disabled={loading}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            style={{ width: 18, height: 18 }}
          />
          Google
        </button>

        <p style={s.toggleText}>
          {isLogin ? "No account?" : "Have an account?"}{" "}
          <span style={s.toggleLink} onClick={handleToggle}>
            {isLogin ? "Register" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
};

const s = {
  page: {
    minHeight: "100vh",
    background: "#F5F0E8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  card: {
    background: "#F5F0E8",
    border: "2px solid #1A1A1A",
    boxShadow: "6px 6px 0 #1A1A1A",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "400px",
  },
  logoWrap: { textAlign: "center", marginBottom: "28px" },
  logoEyebrow: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.2em",
    color: "#8B7355",
    marginBottom: "6px",
  },
  logo: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "40px",
    fontWeight: 900,
    color: "#1A1A1A",
    letterSpacing: "0.06em",
    lineHeight: 1,
    marginBottom: "6px",
  },
  logoSub: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    color: "#8B7355",
    letterSpacing: "0.08em",
  },
  tabs: {
    display: "flex",
    border: "2px solid #1A1A1A",
    marginBottom: "24px",
  },
  tab: {
    flex: 1,
    padding: "10px",
    background: "transparent",
    border: "none",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#8B7355",
    cursor: "pointer",
  },
  tabActive: {
    background: "#1A1A1A",
    color: "#F5F0E8",
  },
  error: {
    border: "2px solid #C41E1E",
    background: "#FDF0F0",
    color: "#C41E1E",
    padding: "10px 14px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    marginBottom: "16px",
  },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  fieldWrap: { display: "flex", flexDirection: "column", gap: "6px" },
  label: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#8B7355",
  },
  input: {
    background: "#F5F0E8",
    border: "2px solid #1A1A1A",
    padding: "10px 12px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "13px",
    color: "#1A1A1A",
    outline: "none",
    width: "100%",
  },
  passwordWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    color: "#8B7355",
    fontSize: "14px",
    cursor: "pointer",
    padding: 0,
    fontFamily: "'IBM Plex Mono',monospace",
  },
  submitBtn: {
    background: "#1A1A1A",
    color: "#F5F0E8",
    border: "2px solid #1A1A1A",
    boxShadow: "3px 3px 0 #8B7355",
    padding: "12px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "13px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginTop: "4px",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "20px 0",
  },
  dividerLine: { flex: 1, height: "2px", background: "#D4C9B4" },
  dividerText: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    color: "#8B7355",
    letterSpacing: "0.08em",
    whiteSpace: "nowrap",
  },
  googleBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    background: "#F5F0E8",
    border: "2px solid #1A1A1A",
    boxShadow: "3px 3px 0 #1A1A1A",
    padding: "10px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#1A1A1A",
  },
  toggleText: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    color: "#8B7355",
    textAlign: "center",
    marginTop: "16px",
  },
  toggleLink: {
    color: "#C41E1E",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Auth;
