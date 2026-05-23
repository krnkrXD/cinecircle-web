// src/pages/Feed.jsx

import { useNavigate } from "react-router-dom";
import useRecs from "../hooks/useRecs";
import { useAuth } from "../context/AuthContext";

const Feed = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { recs, loading } = useRecs();

  // ── Format timestamp ─────────────────────────────────────────
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <button style={styles.backBtn} onClick={() => navigate("/library")}>
          ← Library
        </button>
        <h1 style={styles.logo}>📨 Feed</h1>
        <div style={{ width: "80px" }} />
      </div>

      <div style={styles.content}>
        <p style={styles.subtitle}>Movie recommendations from friends</p>

        {/* Content */}
        {loading ? (
          <div style={styles.centered}>
            <p style={styles.message}>Loading recommendations...</p>
          </div>
        ) : recs.length === 0 ? (
          <div style={styles.centered}>
            <p style={styles.emptyIcon}>🎬</p>
            <p style={styles.message}>No recommendations yet.</p>
            <p style={styles.submessage}>
              When a friend recommends you a movie it will appear here.
            </p>
          </div>
        ) : (
          <div style={styles.recsList}>
            {recs.map((rec) => (
              <div key={rec.id} style={styles.recCard}>
                {/* Poster */}
                {rec.posterURL && rec.posterURL !== "N/A" ? (
                  <img
                    src={rec.posterURL}
                    alt={rec.movieTitle}
                    style={styles.poster}
                  />
                ) : (
                  <div style={styles.noPoster}>🎬</div>
                )}

                {/* Info */}
                <div style={styles.recInfo}>
                  <p style={styles.recTitle}>{rec.movieTitle || "A movie"}</p>
                  {rec.message && (
                    <p style={styles.recMessage}>"{rec.message}"</p>
                  )}
                  <p style={styles.recMeta}>
                    From{" "}
                    <span style={styles.recFrom}>
                      {rec.fromEmail || "a friend"}
                    </span>{" "}
                    · {formatDate(rec.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0f0f0f",
    color: "#fff",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #1a1a1a",
    backgroundColor: "#111",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  backBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "#888",
    fontSize: "14px",
    cursor: "pointer",
    width: "80px",
    textAlign: "left",
    padding: 0,
  },
  logo: {
    fontSize: "20px",
    fontWeight: "700",
    margin: 0,
    color: "#fff",
  },
  content: {
    maxWidth: "640px",
    margin: "0 auto",
    padding: "24px",
  },
  subtitle: {
    color: "#555",
    fontSize: "14px",
    marginBottom: "24px",
  },
  centered: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "360px",
    gap: "8px",
  },
  emptyIcon: {
    fontSize: "48px",
    margin: "0 0 8px",
  },
  message: {
    color: "#666",
    fontSize: "16px",
    margin: 0,
  },
  submessage: {
    color: "#444",
    fontSize: "14px",
    margin: 0,
    textAlign: "center",
  },
  recsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  recCard: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  poster: {
    width: "56px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "6px",
    flexShrink: 0,
  },
  noPoster: {
    width: "56px",
    height: "80px",
    backgroundColor: "#252525",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },
  recInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  recTitle: {
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    margin: 0,
  },
  recMessage: {
    color: "#aaa",
    fontSize: "14px",
    fontStyle: "italic",
    margin: 0,
    lineHeight: "1.5",
  },
  recMeta: {
    color: "#555",
    fontSize: "12px",
    margin: 0,
  },
  recFrom: {
    color: "#7986cb",
    fontWeight: "500",
  },
};

export default Feed;
