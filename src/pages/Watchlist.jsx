// src/pages/Watchlist.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useMovies from "../hooks/useMovies";
import MovieCard from "../components/MovieCard";

const Watchlist = () => {
  const { unwatchedMovies, loading } = useMovies();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = unwatchedMovies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()),
  );

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
        <div style={s.eyebrow}>— To be seen —</div>
        <h1 style={s.pageTitle}>Watchlist</h1>
        <div style={s.count}>
          {unwatchedMovies.length} film{unwatchedMovies.length !== 1 ? "s" : ""}{" "}
          remaining
        </div>
      </div>

      <div style={s.divider} />

      <div style={s.controls}>
        <input
          style={s.searchInput}
          type="text"
          placeholder="Search watchlist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={s.empty}>
          <span style={s.emptyText}>Loading...</span>
        </div>
      ) : unwatchedMovies.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyTitle}>All caught up.</div>
          <div style={s.emptyText}>No unwatched films in your library.</div>
          <button style={s.goBtn} onClick={() => navigate("/library")}>
            Go to library →
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyText}>No results found.</div>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
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
    marginBottom: "8px",
  },
  count: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    color: "#8B7355",
  },
  divider: { borderTop: "2px solid #1A1A1A", margin: "20px 28px" },
  controls: { padding: "0 28px", marginBottom: "24px" },
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
    gap: "0",
    padding: "0 28px",
    border: "2px solid #1A1A1A",
    margin: "0 28px",
  },
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
  goBtn: {
    background: "#1A1A1A",
    color: "#F5F0E8",
    border: "2px solid #1A1A1A",
    boxShadow: "3px 3px 0 #8B7355",
    padding: "10px 24px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    marginTop: "8px",
  },
};

export default Watchlist;
