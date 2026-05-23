// src/pages/Watchlist.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useMovies from "../hooks/useMovies";
import MovieCard from "../components/MovieCard";

const Watchlist = () => {
  const { unwatchedMovies, loading } = useMovies();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // ── Filter by search ─────────────────────────────────────────
  const filtered = unwatchedMovies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Render ───────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <button style={styles.backBtn} onClick={() => navigate("/library")}>
          ← Library
        </button>
        <h1 style={styles.logo}>🕐 Watchlist</h1>
        <div style={{ width: "80px" }} />
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search watchlist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Stats */}
        <p style={styles.stat}>
          {unwatchedMovies.length} movie
          {unwatchedMovies.length !== 1 ? "s" : ""} to watch
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div style={styles.centered}>
          <p style={styles.message}>Loading watchlist...</p>
        </div>
      ) : unwatchedMovies.length === 0 ? (
        <div style={styles.centered}>
          <p style={styles.emptyIcon}>🎉</p>
          <p style={styles.message}>You're all caught up!</p>
          <p style={styles.submessage}>No unwatched movies in your library.</p>
          <button style={styles.addBtn} onClick={() => navigate("/library")}>
            Go to library
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.centered}>
          <p style={styles.message}>No movies match your search.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0f0f0f",
    color: "#fff",
    paddingBottom: "40px",
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
  controls: {
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  searchInput: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  stat: {
    color: "#555",
    fontSize: "13px",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "16px",
    padding: "0 24px",
  },
  centered: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
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
  },
  addBtn: {
    marginTop: "16px",
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

export default Watchlist;
