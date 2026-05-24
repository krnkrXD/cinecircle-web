// src/pages/Library.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useMovies from "../hooks/useMovies";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import Skeleton from "../components/Skeleton";
import { logOut } from "../firebase/auth";

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

  const filtered = movies.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchGenre =
      activeGenre === "All" || (m.genre && m.genre.includes(activeGenre));
    const matchFilter =
      filter === "all" ||
      (filter === "watched" && m.watched) ||
      (filter === "unwatched" && !m.watched);
    return matchSearch && matchGenre && matchFilter;
  });

  const handleLogout = async () => {
    await logOut();
    navigate("/auth");
  };

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <div style={s.logoEyebrow}>— Film ledger —</div>
          <div style={s.logo}>CINELOG</div>
        </div>
        <div style={s.navRight}>
          {["Watchlist", "Friends", "Feed"].map((label) => (
            <button
              key={label}
              style={s.navLink}
              onClick={() => navigate(`/${label.toLowerCase()}`)}
            >
              {label}
            </button>
          ))}
          <button style={s.navLink} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Page header */}
      <div style={s.pageHeader}>
        <div>
          <div style={s.eyebrow}>— Your collection —</div>
          <h1 style={s.pageTitle}>Library</h1>
        </div>
        <div style={s.statsRow}>
          <div style={s.statBox}>
            <div style={s.statNum}>{movies.length}</div>
            <div style={s.statLabel}>Total</div>
          </div>
          <div style={s.statBox}>
            <div style={s.statNum}>
              {movies.filter((m) => m.watched).length}
            </div>
            <div style={s.statLabel}>Watched</div>
          </div>
          <div style={s.statBox}>
            <div style={s.statNum}>
              {movies.filter((m) => !m.watched).length}
            </div>
            <div style={s.statLabel}>Queued</div>
          </div>
        </div>
      </div>

      <div style={s.divider} />

      {/* Controls */}
      <div style={s.controls}>
        <input
          style={s.searchInput}
          type="text"
          placeholder="Search your library..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={s.filterRow}>
          {["all", "watched", "unwatched"].map((f) => (
            <button
              key={f}
              style={{
                ...s.filterBtn,
                ...(filter === f ? s.filterBtnActive : {}),
              }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={s.genreRow}>
          {GENRES.map((g) => (
            <button
              key={g}
              style={{
                ...s.genreBtn,
                ...(activeGenre === g ? s.genreBtnActive : {}),
              }}
              onClick={() => setActiveGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={s.grid}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <Skeleton height="240px" />
              <Skeleton height="14px" width="80%" />
              <Skeleton height="10px" width="50%" />
            </div>
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyTitle}>No films yet.</div>
          <div style={s.emptySub}>
            Click the button below to add your first entry.
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyTitle}>No results.</div>
          <div style={s.emptySub}>Try adjusting your filters.</div>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {/* FAB */}
      <button style={s.fab} onClick={() => setShowModal(true)}>
        + Add film
      </button>

      {showModal && <MovieModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "#F5F0E8", paddingBottom: "100px" },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 28px",
    background: "#1A1A1A",
    borderBottom: "2px solid #1A1A1A",
    height: "60px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLeft: {},
  logoEyebrow: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "8px",
    letterSpacing: "0.16em",
    color: "#8B7355",
    lineHeight: 1,
  },
  logo: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "20px",
    fontWeight: 900,
    color: "#F5F0E8",
    letterSpacing: "0.06em",
    lineHeight: 1,
  },
  navRight: { display: "flex", gap: "4px", alignItems: "center" },
  navLink: {
    background: "transparent",
    border: "none",
    color: "#C4B99A",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    padding: "6px 12px",
  },
  pageHeader: {
    padding: "28px 28px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: "16px",
  },
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
  statsRow: { display: "flex", gap: "2px" },
  statBox: {
    background: "#E8E0D0",
    border: "2px solid #1A1A1A",
    padding: "10px 18px",
    textAlign: "center",
    minWidth: "70px",
  },
  statNum: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "22px",
    fontWeight: 900,
    color: "#1A1A1A",
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "9px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#8B7355",
    marginTop: "2px",
  },
  divider: { borderTop: "2px solid #1A1A1A", margin: "20px 28px" },
  controls: {
    padding: "0 28px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "24px",
  },
  searchInput: {
    background: "#F5F0E8",
    border: "2px solid #1A1A1A",
    padding: "10px 14px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "13px",
    color: "#1A1A1A",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  filterRow: { display: "flex", gap: "0" },
  filterBtn: {
    background: "#F5F0E8",
    border: "2px solid #1A1A1A",
    borderRight: "none",
    padding: "7px 16px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#8B7355",
    cursor: "pointer",
  },
  filterBtnActive: { background: "#1A1A1A", color: "#F5F0E8" },
  genreRow: { display: "flex", flexWrap: "wrap", gap: "6px" },
  genreBtn: {
    background: "#F5F0E8",
    border: "1.5px solid #1A1A1A",
    padding: "4px 12px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#8B7355",
    cursor: "pointer",
  },
  genreBtnActive: { background: "#1A1A1A", color: "#F5F0E8" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
    gap: "0",
    padding: "0 28px",
    border: "2px solid #1A1A1A",
    margin: "0 28px",
    outline: "2px solid #F5F0E8",
    outlineOffset: "-2px",
  },
  empty: { textAlign: "center", padding: "80px 28px" },
  emptyTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "28px",
    fontWeight: 900,
    color: "#1A1A1A",
    marginBottom: "8px",
  },
  emptySub: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    color: "#8B7355",
  },
  fab: {
    position: "fixed",
    bottom: "32px",
    right: "32px",
    background: "#C41E1E",
    color: "#F5F0E8",
    border: "2px solid #1A1A1A",
    boxShadow: "4px 4px 0 #1A1A1A",
    padding: "14px 24px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "13px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    zIndex: 200,
  },
};

export default Library;
