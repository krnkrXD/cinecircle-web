// src/pages/Feed.jsx
import { useNavigate } from "react-router-dom";
import useRecs from "../hooks/useRecs";

const Feed = () => {
  const navigate = useNavigate();
  const { recs, loading } = useRecs();

  const formatDate = (ts) => {
    if (!ts) return "";
    return ts
      .toDate()
      .toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
  };

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <button style={s.backBtn} onClick={() => navigate("/library")}>
          ← Library
        </button>
        <div style={s.logo}>CINELOG</div>
        <div style={{ width: "100px" }} />
      </nav>

      <div style={s.pageHeader}>
        <div style={s.eyebrow}>— From friends —</div>
        <h1 style={s.pageTitle}>Feed</h1>
      </div>

      <div style={s.divider} />

      <div style={s.content}>
        {loading ? (
          <div style={s.empty}>
            <span style={s.emptyText}>Loading...</span>
          </div>
        ) : recs.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyTitle}>Nothing yet.</div>
            <div style={s.emptyText}>
              When friends recommend films they will appear here.
            </div>
          </div>
        ) : (
          <div style={s.list}>
            {recs.map((rec, i) => (
              <div
                key={rec.id}
                style={{
                  ...s.recCard,
                  borderTop: i === 0 ? "2px solid #1A1A1A" : "none",
                }}
              >
                <div style={s.recNum}>{String(i + 1).padStart(2, "0")}</div>
                {rec.posterURL && rec.posterURL !== "N/A" && (
                  <img
                    src={rec.posterURL}
                    alt={rec.movieTitle}
                    style={s.poster}
                  />
                )}
                <div style={s.recInfo}>
                  <div style={s.recTitle}>{rec.movieTitle || "A film"}</div>
                  {rec.message && (
                    <div style={s.recMessage}>"{rec.message}"</div>
                  )}
                  <div style={s.recMeta}>
                    From{" "}
                    <span style={s.recFrom}>{rec.fromEmail || "a friend"}</span>
                    {" · "}
                    {formatDate(rec.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "#F5F0E8", paddingBottom: "60px" },
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
  },
  logo: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "20px",
    fontWeight: 900,
    color: "#F5F0E8",
    letterSpacing: "0.06em",
  },
  pageHeader: { padding: "28px 28px 0" },
  eyebrow: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.14em",
    color: "#8B7355",
    marginBottom: "4px",
  },
  pageTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "42px",
    fontWeight: 900,
    color: "#1A1A1A",
    lineHeight: 1,
  },
  divider: { borderTop: "2px solid #1A1A1A", margin: "20px 28px" },
  content: { maxWidth: "680px", margin: "0 auto", padding: "0 28px" },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "360px",
    gap: "10px",
    textAlign: "center",
  },
  emptyTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "28px",
    fontWeight: 900,
    color: "#1A1A1A",
  },
  emptyText: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    color: "#8B7355",
  },
  list: { border: "2px solid #1A1A1A" },
  recCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    padding: "20px",
    borderBottom: "2px solid #1A1A1A",
    background: "#F5F0E8",
  },
  recNum: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "28px",
    fontWeight: 900,
    color: "#E8E0D0",
    lineHeight: 1,
    flexShrink: 0,
    minWidth: "40px",
  },
  poster: {
    width: "52px",
    height: "74px",
    objectFit: "cover",
    border: "2px solid #1A1A1A",
    flexShrink: 0,
  },
  recInfo: { flex: 1 },
  recTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "18px",
    fontWeight: 700,
    color: "#1A1A1A",
    marginBottom: "6px",
  },
  recMessage: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    color: "#1A1A1A",
    fontStyle: "italic",
    lineHeight: 1.6,
    marginBottom: "8px",
  },
  recMeta: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    color: "#8B7355",
    letterSpacing: "0.04em",
  },
  recFrom: { color: "#C41E1E" },
};

export default Feed;
