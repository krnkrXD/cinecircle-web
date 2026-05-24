// src/pages/Friends.jsx
import { useNavigate } from "react-router-dom";
import FriendsList from "../components/FriendsList";

const Friends = () => {
  const navigate = useNavigate();

  return (
    <div style={s.page}>
      {/* Top accent */}
      <div style={s.topAccent} />

      {/* Navbar */}
      <nav style={s.nav}>
        <button style={s.backBtn} onClick={() => navigate("/library")}>
          ← Library
        </button>
        <div style={s.logo}>CINELOG</div>
        <div style={{ width: "100px" }} />
      </nav>

      {/* Page header */}
      <div style={s.pageHeader}>
        <div style={s.headerLeft}>
          <div style={s.eyebrow}>— Social —</div>
          <h1 style={s.pageTitle}>Friends</h1>
          <p style={s.pageDesc}>
            Build your roster. Share films. Compare tastes.
          </p>
        </div>
        <div style={s.headerRight}>
          <div style={s.decorBox}>
            <div style={s.decorNum}>I.</div>
            <div style={s.decorText}>
              Find by
              <br />
              username
            </div>
          </div>
          <div style={s.decorBox}>
            <div style={s.decorNum}>II.</div>
            <div style={s.decorText}>
              Add to
              <br />
              your list
            </div>
          </div>
          <div style={s.decorBox}>
            <div style={s.decorNum}>III.</div>
            <div style={s.decorText}>
              Share
              <br />
              films
            </div>
          </div>
        </div>
      </div>

      <div style={s.divider} />

      {/* Main content */}
      <FriendsList />
    </div>
  );
};

const s = {
  page: {
    minHeight: "100vh",
    background: "#F5F0E8",
    paddingBottom: "60px",
  },
  topAccent: {
    height: "4px",
    background: "#C41E1E",
    borderBottom: "2px solid #1A1A1A",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 28px",
    background: "#1A1A1A",
    height: "60px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  backBtn: {
    background: "transparent",
    border: "none",
    color: "#C4B99A",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    width: "100px",
    textAlign: "left",
    padding: 0,
  },
  logo: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "20px",
    fontWeight: 900,
    color: "#F5F0E8",
    letterSpacing: "0.06em",
  },
  pageHeader: {
    padding: "36px 28px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: "24px",
  },
  headerLeft: {},
  eyebrow: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.14em",
    color: "#8B7355",
    marginBottom: "6px",
  },
  pageTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "52px",
    fontWeight: 900,
    color: "#1A1A1A",
    lineHeight: 1,
    marginBottom: "10px",
  },
  pageDesc: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    color: "#8B7355",
    lineHeight: 1.6,
  },
  headerRight: {
    display: "flex",
    gap: "0",
  },
  decorBox: {
    border: "2px solid #1A1A1A",
    borderRight: "none",
    padding: "14px 18px",
    background: "#E8E0D0",
    minWidth: "80px",
  },
  decorNum: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "13px",
    fontWeight: 700,
    color: "#C41E1E",
    marginBottom: "4px",
  },
  decorText: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "9px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#8B7355",
    lineHeight: 1.5,
  },
  divider: {
    borderTop: "2px solid #1A1A1A",
    margin: "28px 28px 0",
  },
};

export default Friends;
