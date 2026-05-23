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

const FriendsList = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [friends, setFriends] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── Load friends ─────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const list = await getFriends(currentUser.uid);
      setFriends(list);
      setLoading(false);
    };
    load();
  }, [currentUser]);

  // ── Search users ─────────────────────────────────────────────
  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const found = await searchUsersByUsername(query.trim().toLowerCase());
      // Exclude yourself
      setResults(found.filter((u) => u.uid !== currentUser.uid));
    } finally {
      setSearching(false);
    }
  };

  // ── Add friend ───────────────────────────────────────────────
  const handleAdd = async (user) => {
    try {
      await addFriend(currentUser.uid, user);
      setFriends((prev) => [...prev, user]);
      setResults((prev) => prev.filter((u) => u.uid !== user.uid));
      showToast(`${user.displayName} added to friends!`);
    } catch {
      showToast("Failed to add friend.", "error");
    }
  };

  // ── Remove friend ────────────────────────────────────────────
  const handleRemove = async (friendUid, name) => {
    if (!window.confirm(`Remove ${name} from friends?`)) return;
    try {
      await removeFriend(currentUser.uid, friendUid);
      setFriends((prev) => prev.filter((f) => f.uid !== friendUid));
      showToast("Friend removed.", "info");
    } catch {
      showToast("Failed to remove friend.", "error");
    }
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>👥 Friends</h3>

      {/* Search */}
      <div style={styles.searchRow}>
        <input
          style={styles.input}
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          style={styles.searchBtn}
          onClick={handleSearch}
          disabled={searching}
        >
          {searching ? "..." : "Search"}
        </button>
      </div>

      {/* Search results */}
      {results.length > 0 && (
        <div style={styles.results}>
          {results.map((user) => (
            <div key={user.uid} style={styles.userRow}>
              <div>
                <p style={styles.userName}>{user.displayName}</p>
                <p style={styles.userHandle}>@{user.username}</p>
              </div>
              <button style={styles.addBtn} onClick={() => handleAdd(user)}>
                + Add
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Friends list */}
      {loading ? (
        <p style={styles.empty}>Loading friends...</p>
      ) : friends.length === 0 ? (
        <p style={styles.empty}>
          No friends yet. Search by username to add them!
        </p>
      ) : (
        <div style={styles.friendsList}>
          {friends.map((friend) => (
            <div key={friend.uid} style={styles.friendRow}>
              <div style={styles.avatar}>
                {friend.displayName?.[0]?.toUpperCase() || "?"}
              </div>
              <div style={styles.friendInfo}>
                <p style={styles.friendName}>{friend.displayName}</p>
                <p style={styles.friendHandle}>@{friend.username}</p>
              </div>
              <button
                style={styles.removeBtn}
                onClick={() => handleRemove(friend.uid, friend.displayName)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "560px",
    margin: "0 auto",
    padding: "24px",
    color: "#fff",
  },
  heading: {
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 20px",
    color: "#fff",
  },
  searchRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
  },
  input: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  },
  searchBtn: {
    backgroundColor: "#e50914",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 18px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  results: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    marginBottom: "20px",
    overflow: "hidden",
  },
  userRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #2a2a2a",
  },
  userName: {
    color: "#fff",
    fontSize: "14px",
    margin: "0 0 2px",
    fontWeight: "500",
  },
  userHandle: {
    color: "#555",
    fontSize: "12px",
    margin: 0,
  },
  addBtn: {
    backgroundColor: "#1a3a1a",
    color: "#4caf50",
    border: "1px solid #2d5a2d",
    borderRadius: "6px",
    padding: "6px 14px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  friendsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  friendRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    padding: "12px 16px",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#e50914",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "700",
    flexShrink: 0,
  },
  friendInfo: {
    flex: 1,
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
  removeBtn: {
    backgroundColor: "transparent",
    border: "1px solid #3a2020",
    color: "#ff6b6b",
    borderRadius: "6px",
    padding: "5px 12px",
    fontSize: "12px",
    cursor: "pointer",
  },
};

export default FriendsList;
