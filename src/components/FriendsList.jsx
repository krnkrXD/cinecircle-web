// src/components/FriendsList.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  searchUsersByUsername,
  addFriend,
  removeFriend,
  getFriends,
} from "../firebase/firestore";
import FriendMoviesModal from "../components/FriendsMovieModal";

const FriendsList = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [friends, setFriends] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewingFriend, setViewingFriend] = useState(null);
  // inside the component, just to check
  console.log("Friends list:", friends);
  useEffect(() => {
    const load = async () => {
      const list = await getFriends(currentUser.uid);
      setFriends(list);
      setLoading(false);
    };
    load();
  }, [currentUser]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const found = await searchUsersByUsername(query.trim().toLowerCase());
      setResults(found.filter((u) => u.uid !== currentUser.uid));
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async (user) => {
    try {
      await addFriend(currentUser.uid, user);
      setFriends((prev) => [...prev, user]);
      setResults((prev) => prev.filter((u) => u.uid !== user.uid));
      showToast(`${user.displayName} added!`);
    } catch {
      showToast("Failed to add friend.", "error");
    }
  };

  const handleRemove = async (friendUid, name) => {
    if (!window.confirm(`Remove ${name} from your list?`)) return;
    try {
      await removeFriend(currentUser.uid, friendUid);
      setFriends((prev) => prev.filter((f) => f.uid !== friendUid));
      showToast("Friend removed.", "info");
    } catch {
      showToast("Failed to remove.", "error");
    }
  };

  return (
    <div style={s.container}>
      {/* Search section */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <div style={s.accentBar} />
          <h2 style={s.sectionTitle}>Find people</h2>
        </div>
        <div style={s.hint}>Search by @username to find and add friends.</div>

        <div style={s.searchRow}>
          <div style={s.atSign}>@</div>
          <input
            style={s.input}
            type="text"
            placeholder="username"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            style={{ ...s.searchBtn, opacity: searching ? 0.7 : 1 }}
            onClick={handleSearch}
            disabled={searching}
          >
            {searching ? "..." : "Search"}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div style={s.resultsList}>
            {results.map((user, i) => (
              <div
                key={user.uid}
                style={{
                  ...s.userRow,
                  borderTop: i === 0 ? "2px solid #1A1A1A" : "none",
                }}
              >
                <div style={s.avatar}>
                  {user.displayName?.[0]?.toUpperCase() || "?"}
                </div>
                <div style={s.userInfo}>
                  <div style={s.userName}>{user.displayName}</div>
                  <div style={s.userHandle}>@{user.username}</div>
                </div>
                <button style={s.addBtn} onClick={() => handleAdd(user)}>
                  + Add
                </button>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && query && !searching && (
          <div style={s.noResults}>No users found for "@{query}"</div>
        )}
      </div>

      {/* Divider */}
      <div style={s.divider} />

      {/* Friends list section */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <div style={s.accentBar} />
          <h2 style={s.sectionTitle}>
            Your list
            <span style={s.friendCount}>{friends.length}</span>
          </h2>
        </div>

        {loading ? (
          <div style={s.emptyState}>
            <span style={s.emptyText}>Loading roster...</span>
          </div>
        ) : friends.length === 0 ? (
          <div style={s.emptyState}>
            <div style={s.emptyBox}>
              <div style={s.emptyBoxTitle}>No friends yet.</div>
              <div style={s.emptyBoxSub}>
                Search by username above to build your list.
              </div>
            </div>
          </div>
        ) : (
          <div style={s.friendsList}>
            {friends.map((friend, i) => (
              <div
                key={friend.uid}
                style={{
                  ...s.friendRow,
                  borderTop: i === 0 ? "2px solid #1A1A1A" : "none",
                }}
              >
                {/* Index number */}
                <div style={s.friendIndex}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Avatar */}
                <div style={s.friendAvatar}>
                  {friend.displayName?.[0]?.toUpperCase() || "?"}
                </div>

                {/* Info */}
                <div style={s.friendInfo}>
                  <div style={s.friendName}>{friend.displayName}</div>
                  <div style={s.friendHandle}>@{friend.username}</div>
                </div>

                {/* Remove */}
                <button
                  style={s.removeBtn}
                  onClick={() => handleRemove(friend.uid, friend.displayName)}
                >
                  Remove
                </button>

                <button
                  style={s.viewBtn}
                  onClick={() => setViewingFriend(friend)}
                >
                  View films
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {viewingFriend && (
        <FriendMoviesModal
          friend={viewingFriend}
          onClose={() => setViewingFriend(null)}
        />
      )}
    </div>
  );
};

const s = {
  container: {
    maxWidth: "640px",
    margin: "0 auto",
    padding: "36px 28px",
  },
  section: { marginBottom: "8px" },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "6px",
  },
  accentBar: { width: "4px", height: "28px", background: "#C41E1E" },
  sectionTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "24px",
    fontWeight: 900,
    color: "#1A1A1A",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  friendCount: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "13px",
    fontWeight: 400,
    color: "#8B7355",
    border: "1.5px solid #C4B99A",
    padding: "2px 8px",
  },
  hint: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    color: "#8B7355",
    marginBottom: "14px",
    letterSpacing: "0.04em",
  },
  searchRow: {
    display: "flex",
    border: "2px solid #1A1A1A",
    boxShadow: "4px 4px 0 #1A1A1A",
    marginBottom: "4px",
  },
  atSign: {
    background: "#1A1A1A",
    color: "#F5F0E8",
    padding: "0 14px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    userSelect: "none",
  },
  input: {
    flex: 1,
    background: "#F5F0E8",
    border: "none",
    borderLeft: "2px solid #1A1A1A",
    borderRight: "2px solid #1A1A1A",
    padding: "12px 14px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "14px",
    color: "#1A1A1A",
    outline: "none",
  },
  searchBtn: {
    background: "#C41E1E",
    color: "#F5F0E8",
    border: "none",
    padding: "12px 20px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    flexShrink: 0,
  },
  resultsList: {
    border: "2px solid #1A1A1A",
    borderTop: "none",
    boxShadow: "4px 4px 0 #1A1A1A",
    marginBottom: "8px",
    background: "#E8E0D0",
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderBottom: "2px solid #1A1A1A",
    background: "#F5F0E8",
  },
  avatar: {
    width: "36px",
    height: "36px",
    background: "#C41E1E",
    color: "#F5F0E8",
    border: "2px solid #1A1A1A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Playfair Display',serif",
    fontSize: "16px",
    fontWeight: 900,
    flexShrink: 0,
  },
  userInfo: { flex: 1 },
  userName: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "15px",
    fontWeight: 700,
    color: "#1A1A1A",
    marginBottom: "1px",
  },
  userHandle: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    color: "#8B7355",
  },
  addBtn: {
    background: "#F5F0E8",
    color: "#1A1A1A",
    border: "2px solid #1A1A1A",
    boxShadow: "2px 2px 0 #1A1A1A",
    padding: "6px 14px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    flexShrink: 0,
  },
  noResults: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    color: "#8B7355",
    padding: "12px 0",
    letterSpacing: "0.04em",
  },
  divider: {
    borderTop: "2px solid #1A1A1A",
    margin: "28px 0",
  },
  emptyState: {
    padding: "32px 0",
    display: "flex",
    justifyContent: "center",
  },
  emptyBox: {
    border: "2px solid #D4C9B4",
    boxShadow: "4px 4px 0 #D4C9B4",
    padding: "24px 32px",
    textAlign: "center",
    background: "#E8E0D0",
  },
  emptyBoxTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "20px",
    fontWeight: 900,
    color: "#1A1A1A",
    marginBottom: "6px",
  },
  emptyBoxSub: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    color: "#8B7355",
    lineHeight: 1.6,
  },
  emptyText: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    color: "#8B7355",
  },
  friendsList: {
    border: "2px solid #1A1A1A",
    boxShadow: "4px 4px 0 #1A1A1A",
  },
  friendRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 16px",
    borderBottom: "2px solid #1A1A1A",
    background: "#F5F0E8",
  },
  friendIndex: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "22px",
    fontWeight: 900,
    color: "#D4C9B4",
    flexShrink: 0,
    minWidth: "32px",
    lineHeight: 1,
  },
  friendAvatar: {
    width: "40px",
    height: "40px",
    background: "#1A1A1A",
    color: "#F5F0E8",
    border: "2px solid #1A1A1A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Playfair Display',serif",
    fontSize: "18px",
    fontWeight: 900,
    flexShrink: 0,
  },
  friendInfo: { flex: 1 },
  friendName: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "16px",
    fontWeight: 700,
    color: "#1A1A1A",
    marginBottom: "2px",
  },
  friendHandle: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    color: "#8B7355",
  },
  removeBtn: {
    background: "transparent",
    color: "#C41E1E",
    border: "1.5px solid #C41E1E",
    padding: "5px 12px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    flexShrink: 0,
  },
  viewBtn: {
    background: "#F5F0E8",
    color: "#1A1A1A",
    border: "2px solid #1A1A1A",
    boxShadow: "2px 2px 0 #1A1A1A",
    padding: "5px 12px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    flexShrink: 0,
  },
};

export default FriendsList;
