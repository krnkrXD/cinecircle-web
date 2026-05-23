// src/pages/Library.jsx

import { useState } from "react";
import useMovies from "../hooks/useMovies";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import { logOut } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import Skeleton from "../components/Skeleton";

const GENRES = [
  "All",
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Animation",
  "Documentary",
];

const Library = () => {
  const { movies, loading } = useMovies();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [filter, setFilter] = useState("all");

  // ── Filtering logic ──────────────────────────────────────────
  const filtered = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesGenre =
      activeGenre === "All" ||
      (movie.genre && movie.genre.includes(activeGenre));

    const matchesFilter =
      filter === "all" ||
      (filter === "watched" && movie.watched) ||
      (filter === "unwatched" && !movie.watched);

    return matchesSearch && matchesGenre && matchesFilter;
  });

  // ── Logout ───────────────────────────────────────────────────
  const handleLogout = async () => {
    await logOut();
    navigate("/auth");
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo}>🎬 CineLog</h1>
        <div style={styles.navLinks}>
          <span style={styles.navLink} onClick={() => navigate("/watchlist")}>
            Watchlist
          </span>
          <span style={styles.navLink} onClick={() => navigate("/feed")}>
            Feed
          </span>
          <span style={styles.navLink} onClick={handleLogout}>
            Logout
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        {/* Search */}
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search your library..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Watched filter */}
        <div style={styles.filterRow}>
          {["all", "watched", "unwatched"].map((f) => (
            <button
              key={f}
              style={{
                ...styles.filterBtn,
                backgroundColor: filter === f ? "#e50914" : "#1a1a1a",
                color: filter === f ? "#fff" : "#888",
                border: `1px solid ${filter === f ? "#e50914" : "#333"}`,
              }}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Genre filter */}
        <div style={styles.genreRow}>
          {GENRES.map((g) => (
            <button
              key={g}
              style={{
                ...styles.genreBtn,
                backgroundColor: activeGenre === g ? "#e50914" : "#1a1a1a",
                color: activeGenre === g ? "#fff" : "#888",
                border: `1px solid ${activeGenre === g ? "#e50914" : "#333"}`,
              }}
              onClick={() => setActiveGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={styles.stats}>
        <span style={styles.stat}>📽 {movies.length} total</span>
        <span style={styles.stat}>
          ✓ {movies.filter((m) => m.watched).length} watched
        </span>
        <span style={styles.stat}>
          🕐 {movies.filter((m) => !m.watched).length} unwatched
        </span>
        <span style={styles.navLink} onClick={() => navigate("/friends")}>
          Friends
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div style={styles.grid}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <Skeleton height="240px" borderRadius="12px" />
              <Skeleton height="16px" width="80%" />
              <Skeleton height="12px" width="50%" />
            </div>
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div style={styles.centered}>
          <p style={styles.message}>Your library is empty.</p>
          <p style={styles.submessage}>
            Click the + button to add your first movie!
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.centered}>
          <p style={styles.message}>No movies match your filters.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {/* Floating add button */}
      <button style={styles.fab} onClick={() => setShowModal(true)}>
        +
      </button>

      {/* Add movie modal */}
      {showModal && <MovieModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0f0f0f",
    color: "#fff",
    paddingBottom: "80px",
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
  logo: {
    fontSize: "22px",
    fontWeight: "700",
    margin: 0,
    color: "#fff",
  },
  navLinks: {
    display: "flex",
    gap: "24px",
  },
  navLink: {
    color: "#888",
    fontSize: "14px",
    cursor: "pointer",
  },
  controls: {
    padding: "20px 24px 0",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
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
  filterRow: {
    display: "flex",
    gap: "8px",
  },
  filterBtn: {
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "500",
  },
  genreRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  genreBtn: {
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    cursor: "pointer",
  },
  stats: {
    display: "flex",
    gap: "20px",
    padding: "16px 24px",
  },
  stat: {
    color: "#666",
    fontSize: "13px",
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
    minHeight: "300px",
  },
  message: {
    color: "#666",
    fontSize: "16px",
    margin: "0 0 8px",
  },
  submessage: {
    color: "#444",
    fontSize: "14px",
    margin: 0,
  },
  fab: {
    position: "fixed",
    bottom: "32px",
    right: "32px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#e50914",
    color: "#fff",
    fontSize: "32px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(229,9,20,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
};

export default Library;
