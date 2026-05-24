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

  useEffect(() => {
    const load = async () => {
      const list = await getFriends(currentUser.uid);
      setFriends(list);
      setLoading(false);
    };
    load();
  }, [currentUser]);

  const handleSend = async () => {
    if (!selected) {
      setError("Select a friend first.");
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

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header bar */}
        <div style={s.headerBar}>
          <div style={s.headerLeft}>
            <div style={s.eyebrow}>— Pass it on —</div>
            <h2 style={s.title}>Recommend</h2>
          </div>
          <button style={s.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Movie strip */}
        <div style={s.movieStrip}>
          {movie.posterURL && movie.posterURL !== "N/A" && (
            <img
              src={movie.posterURL}
              alt={movie.title}
              style={s.stripPoster}
            />
          )}
          <div style={s.stripInfo}>
            <div style={s.stripTitle}>{movie.title}</div>
            {movie.year && <div style={s.stripYear}>{movie.year}</div>}
          </div>
          <div style={s.stripLabel}>Selected film</div>
        </div>

        {success ? (
          /* ── Success state ── */
          <div style={s.successState}>
            <div style={s.successStamp}>
              <div style={s.successWord}>SENT</div>
              <div style={s.successSub}>Recommendation dispatched</div>
            </div>
            <p style={s.successMsg}>
              Your recommendation has been delivered to{" "}
              <strong style={{ fontWeight: 500 }}>
                {selected?.displayName}
              </strong>
              .
            </p>
            <button style={s.doneBtn} onClick={onClose}>
              Done →
            </button>
          </div>
        ) : (
          <>
            {/* ── Friend selector ── */}
            <div style={s.section}>
              <div style={s.sectionLabel}>01 · Choose recipient</div>

              {loading ? (
                <div style={s.loadingRow}>
                  <span style={s.loadingText}>Loading your list...</span>
                </div>
              ) : friends.length === 0 ? (
                <div style={s.emptyFriends}>
                  <div style={s.emptyFriendsText}>No friends added yet.</div>
                  <div style={s.emptyFriendsSub}>
                    Go to the Friends page to build your list first.
                  </div>
                </div>
              ) : (
                <div style={s.friendGrid}>
                  {friends.map((friend) => {
                    const isSelected = selected?.uid === friend.uid;
                    return (
                      <button
                        key={friend.uid}
                        style={{
                          ...s.friendChip,
                          background: isSelected ? "#1A1A1A" : "#F5F0E8",
                          color: isSelected ? "#F5F0E8" : "#1A1A1A",
                          boxShadow: isSelected
                            ? "3px 3px 0 #C41E1E"
                            : "3px 3px 0 #C4B99A",
                        }}
                        onClick={() => setSelected(friend)}
                      >
                        <span
                          style={{
                            ...s.chipAvatar,
                            background: isSelected ? "#C41E1E" : "#E8E0D0",
                            color: isSelected ? "#F5F0E8" : "#8B7355",
                            border: `1.5px solid ${isSelected ? "#C41E1E" : "#C4B99A"}`,
                          }}
                        >
                          {friend.displayName?.[0]?.toUpperCase() || "?"}
                        </span>
                        <div style={s.chipInfo}>
                          <div style={s.chipName}>{friend.displayName}</div>
                          <div
                            style={{
                              ...s.chipHandle,
                              color: isSelected ? "#C4B99A" : "#8B7355",
                            }}
                          >
                            @{friend.username}
                          </div>
                        </div>
                        {isSelected && <span style={s.chipCheck}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Message ── */}
            <div style={s.section}>
              <div style={s.sectionLabel}>
                02 · Add a note <span style={s.optional}>(optional)</span>
              </div>
              <textarea
                style={s.textarea}
                placeholder="Why should they watch this?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            {/* ── Error ── */}
            {error && <div style={s.error}>{error}</div>}

            {/* ── Send ── */}
            <button
              style={{
                ...s.sendBtn,
                opacity: sending || friends.length === 0 ? 0.6 : 1,
              }}
              onClick={handleSend}
              disabled={sending || friends.length === 0}
            >
              {sending ? "Dispatching..." : "Send recommendation →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const s = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(26,26,26,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    background: "#F5F0E8",
    border: "2px solid #1A1A1A",
    boxShadow: "8px 8px 0 #1A1A1A",
    width: "100%",
    maxWidth: "480px",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  headerBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "24px 24px 16px",
    borderBottom: "2px solid #1A1A1A",
    background: "#E8E0D0",
  },
  headerLeft: {},
  eyebrow: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.14em",
    color: "#8B7355",
    marginBottom: "4px",
  },
  title: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "28px",
    fontWeight: 900,
    color: "#1A1A1A",
  },
  closeBtn: {
    background: "#1A1A1A",
    color: "#F5F0E8",
    border: "2px solid #1A1A1A",
    width: "32px",
    height: "32px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "13px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  movieStrip: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 24px",
    borderBottom: "2px solid #1A1A1A",
    background: "#1A1A1A",
  },
  stripPoster: {
    width: "36px",
    height: "52px",
    objectFit: "cover",
    border: "1px solid #444",
    flexShrink: 0,
  },
  stripInfo: { flex: 1 },
  stripTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "16px",
    fontWeight: 700,
    color: "#F5F0E8",
    marginBottom: "2px",
  },
  stripYear: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    color: "#8B7355",
  },
  stripLabel: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "9px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#8B7355",
    textAlign: "right",
    flexShrink: 0,
  },
  section: {
    padding: "20px 24px 0",
  },
  sectionLabel: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#8B7355",
    marginBottom: "12px",
    borderBottom: "1px solid #D4C9B4",
    paddingBottom: "6px",
  },
  optional: {
    color: "#C4B99A",
    textTransform: "none",
    letterSpacing: 0,
    fontSize: "10px",
  },
  loadingRow: {
    padding: "16px 0",
  },
  loadingText: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    color: "#8B7355",
  },
  emptyFriends: {
    border: "2px solid #D4C9B4",
    background: "#E8E0D0",
    padding: "16px",
    textAlign: "center",
  },
  emptyFriendsText: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "16px",
    fontWeight: 700,
    color: "#1A1A1A",
    marginBottom: "4px",
  },
  emptyFriendsSub: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    color: "#8B7355",
    lineHeight: 1.5,
  },
  friendGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    maxHeight: "200px",
    overflowY: "auto",
  },
  friendChip: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "2px solid #1A1A1A",
    padding: "10px 12px",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    transition: "box-shadow 0.1s",
  },
  chipAvatar: {
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Playfair Display',serif",
    fontSize: "14px",
    fontWeight: 900,
    flexShrink: 0,
  },
  chipInfo: { flex: 1 },
  chipName: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: "1px",
  },
  chipHandle: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
  },
  chipCheck: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "14px",
    color: "#C41E1E",
    flexShrink: 0,
  },
  textarea: {
    width: "100%",
    background: "#F5F0E8",
    border: "2px solid #1A1A1A",
    padding: "10px 12px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "13px",
    color: "#1A1A1A",
    outline: "none",
    resize: "vertical",
    lineHeight: 1.6,
    boxSizing: "border-box",
  },
  error: {
    margin: "16px 24px 0",
    border: "2px solid #C41E1E",
    color: "#C41E1E",
    padding: "8px 12px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
  },
  sendBtn: {
    display: "block",
    width: "calc(100% - 48px)",
    margin: "20px 24px 24px",
    background: "#1A1A1A",
    color: "#F5F0E8",
    border: "2px solid #1A1A1A",
    boxShadow: "4px 4px 0 #C41E1E",
    padding: "14px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "13px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  successState: {
    padding: "40px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    textAlign: "center",
  },
  successStamp: {
    width: "140px",
    height: "140px",
    border: "4px solid #1A1A1A",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transform: "rotate(-6deg)",
    boxShadow: "4px 4px 0 #C41E1E",
  },
  successWord: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "32px",
    fontWeight: 900,
    color: "#1A1A1A",
    letterSpacing: "0.1em",
  },
  successSub: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "8px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#8B7355",
    marginTop: "4px",
  },
  successMsg: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "13px",
    color: "#8B7355",
    lineHeight: 1.6,
    maxWidth: "300px",
  },
  doneBtn: {
    background: "#1A1A1A",
    color: "#F5F0E8",
    border: "2px solid #1A1A1A",
    boxShadow: "4px 4px 0 #8B7355",
    padding: "12px 32px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
};

export default RecModal;
