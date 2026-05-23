// src/components/RecModal.jsx

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getFriends } from "../firebase/firestore";
import useRecs from "../hooks/useRecs";

const RecModal = ({ movie, onClose }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const { sendRec } = useRecs();

  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Load friends ─────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const list = await getFriends(currentUser.uid);
      setFriends(list);
      setLoading(false);
    };
    load();
  }, [currentUser]);

  // ── Send rec ─────────────────────────────────────────────────
  const handleSend = async () => {
    if (!selected) {
      setError("Please select a friend.");
      return;
    }
    setSending(true);
    setError("");
    try {
      await sendRec(selected.uid, movie.id, message.trim());
      setSuccess(true);
      showToast("Recommendation sent!");
    } catch {
      setError("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Recommend movie</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Movie preview */}
        <div style={styles.moviePreview}>
          {movie.posterURL && movie.posterURL !== "N/A" && (
            <img
              src={movie.posterURL}
              alt={movie.title}
              style={styles.poster}
            />
          )}
          <div>
            <p style={styles.movieTitle}>{movie.title}</p>
            {movie.year && <p style={styles.movieYear}>{movie.year}</p>}
          </div>
        </div>

        {success ? (
          <div style={styles.successBox}>
            <p style={styles.successIcon}>🎉</p>
            <p style={styles.successText}>Recommendation sent!</p>
            <button style={styles.doneBtn} onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            {error && <p style={styles.error}>{error}</p>}

            {/* Friends list */}
            <p style={styles.label}>Send to</p>
            {loading ? (
              <p style={styles.empty}>Loading friends...</p>
            ) : friends.length === 0 ? (
              <p style={styles.empty}>
                You have no friends added yet. Go to the Friends page to add
                some!
              </p>
            ) : (
              <div style={styles.friendsList}>
                {friends.map((friend) => (
                  <div
                    key={friend.uid}
                    style={{
                      ...styles.friendRow,
                      border: `1px solid ${
                        selected?.uid === friend.uid ? "#e50914" : "#2a2a2a"
                      }`,
                      backgroundColor:
                        selected?.uid === friend.uid ? "#2a1a1a" : "#222",
                    }}
                    onClick={() => setSelected(friend)}
                  >
                    <div style={styles.avatar}>
                      {friend.displayName?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p style={styles.friendName}>{friend.displayName}</p>
                      <p style={styles.friendHandle}>@{friend.username}</p>
                    </div>
                    {selected?.uid === friend.uid && (
                      <span style={styles.checkmark}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Message */}
            <p style={{ ...styles.label, marginTop: "16px" }}>
              Message <span style={styles.optional}>(optional)</span>
            </p>
            <textarea
              style={styles.textarea}
              placeholder="Why do you recommend this?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />

            <button
              style={{
                ...styles.sendBtn,
                opacity: sending || friends.length === 0 ? 0.6 : 1,
              }}
              onClick={handleSend}
              disabled={sending || friends.length === 0}
            >
              {sending ? "Sending..." : "Send recommendation"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    backgroundColor: "#1a1a1a",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "440px",
    maxHeight: "85vh",
    overflowY: "auto",
    border: "1px solid #2a2a2a",
    padding: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    color: "#fff",
    fontSize: "20px",
    fontWeight: "600",
    margin: 0,
  },
  closeBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "#888",
    fontSize: "18px",
    cursor: "pointer",
  },
  moviePreview: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "20px",
    border: "1px solid #2a2a2a",
  },
  poster: {
    width: "44px",
    height: "62px",
    objectFit: "cover",
    borderRadius: "6px",
    flexShrink: 0,
  },
  movieTitle: {
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    margin: "0 0 4px",
  },
  movieYear: {
    color: "#666",
    fontSize: "13px",
    margin: 0,
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
  label: {
    color: "#888",
    fontSize: "13px",
    margin: "0 0 8px",
  },
  optional: {
    color: "#555",
    fontSize: "12px",
  },
  empty: {
    color: "#555",
    fontSize: "13px",
    textAlign: "center",
    padding: "16px 0",
    margin: 0,
  },
  friendsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    maxHeight: "200px",
    overflowY: "auto",
  },
  friendRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderRadius: "8px",
    padding: "10px 12px",
    cursor: "pointer",
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    backgroundColor: "#e50914",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
    flexShrink: 0,
  },
  friendName: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    margin: "0 0 2px",
  },
  friendHandle: {
    color: "#555",
    fontSize: "12px",
    margin: 0,
  },
  checkmark: {
    marginLeft: "auto",
    color: "#e50914",
    fontSize: "16px",
    fontWeight: "700",
  },
  textarea: {
    width: "100%",
    backgroundColor: "#252525",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: "1.5",
    boxSizing: "border-box",
  },
  sendBtn: {
    width: "100%",
    backgroundColor: "#e50914",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "16px",
  },
  successBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "24px 0",
  },
  successIcon: {
    fontSize: "48px",
    margin: 0,
  },
  successText: {
    color: "#4caf50",
    fontSize: "16px",
    fontWeight: "500",
    margin: 0,
  },
  doneBtn: {
    backgroundColor: "#1a3a1a",
    color: "#4caf50",
    border: "1px solid #2d5a2d",
    borderRadius: "8px",
    padding: "10px 32px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },
};

export default RecModal;
