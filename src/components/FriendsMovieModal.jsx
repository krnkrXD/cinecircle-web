// src/components/FriendMoviesModal.jsx

import { useState, useEffect } from "react";
import { getFriendMovies } from "../firebase/firestore";

const FriendMoviesModal = ({ friend, onClose }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getFriendMovies(friend.uid);
        setMovies(list);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [friend.uid]);

  const filtered = movies.filter((m) => {
    const matchSearch = m.title?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "watched" && m.watched) ||
      (filter === "unwatched" && !m.watched);
    return matchSearch && matchFilter;
  });

  const watched = movies.filter((m) => m.watched).length;
  const unwatched = movies.filter((m) => !m.watched).length;

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.eyebrow}>— Film collection —</div>
            <h2 style={s.title}>{friend.displayName}</h2>
            <div style={s.handle}>@{friend.username}</div>
          </div>
          <button style={s.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Stats strip */}
        <div style={s.statsStrip}>
          <div style={s.stat}>
            <div style={s.statNum}>{movies.length}</div>
            <div style={s.statLabel}>Total</div>
          </div>
          <div style={s.statDivider} />
          <div style={s.stat}>
            <div style={s.statNum}>{watched}</div>
            <div style={s.statLabel}>Watched</div>
          </div>
          <div style={s.statDivider} />
          <div style={s.stat}>
            <div style={s.statNum}>{unwatched}</div>
            <div style={s.statLabel}>Queued</div>
          </div>
        </div>

        {/* Controls */}
        <div style={s.controls}>
          <input
            style={s.searchInput}
            type="text"
            placeholder="Search their library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={s.filterRow}>
            {["all", "watched", "unwatched"].map((f) => (
              <button
                key={f}
                style={{
                  ...s.filterBtn,
                  background: filter === f ? "#1A1A1A" : "#F5F0E8",
                  color: filter === f ? "#F5F0E8" : "#8B7355",
                }}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Movie list */}
        <div style={s.list}>
          {loading ? (
            <div style={s.empty}>
              <span style={s.emptyText}>Loading collection...</span>
            </div>
          ) : movies.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyTitle}>No films yet.</div>
              <div style={s.emptyText}>
                {friend.displayName} hasn't added any movies.
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyText}>No results found.</div>
            </div>
          ) : (
            filtered.map((movie, i) => (
              <MovieRow
                key={movie.id}
                movie={movie}
                index={i}
                total={filtered.length}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ── Individual movie row ────────────────────────────────────────
const MovieRow = ({ movie, index, total }) => {
  const [expanded, setExpanded] = useState(false);

  const genres = movie.genre
    ? movie.genre
        .split(",")
        .map((g) => g.trim())
        .slice(0, 3)
    : [];

  return (
    <div
      style={{
        ...s.movieRow,
        borderBottom: index === total - 1 ? "none" : "2px solid #1A1A1A",
      }}
    >
      {/* Row number */}
      <div style={s.rowNum}>{String(index + 1).padStart(2, "0")}</div>

      {/* Poster */}
      {movie.posterURL && movie.posterURL !== "N/A" ? (
        <img src={movie.posterURL} alt={movie.title} style={s.poster} />
      ) : (
        <div style={s.noPoster}>?</div>
      )}

      {/* Main info */}
      <div style={s.movieInfo}>
        <div style={s.movieTitle}>{movie.title}</div>

        <div style={s.movieMeta}>
          {movie.year && <span style={s.metaItem}>{movie.year}</span>}
          {movie.imdbRating && (
            <span style={s.metaItem}>IMDB {movie.imdbRating}</span>
          )}
          <span
            style={{
              ...s.watchedTag,
              background: movie.watched ? "#1A1A1A" : "#F5F0E8",
              color: movie.watched ? "#F5F0E8" : "#8B7355",
              border: movie.watched
                ? "1.5px solid #1A1A1A"
                : "1.5px solid #C4B99A",
            }}
          >
            {movie.watched ? "✓ Watched" : "Unwatched"}
          </span>
        </div>

        {/* Star rating */}
        {movie.rating > 0 && (
          <div style={s.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  color: star <= movie.rating ? "#C4882E" : "#C4B99A",
                  fontSize: "14px",
                }}
              >
                ★
              </span>
            ))}
          </div>
        )}

        {/* Genres */}
        {genres.length > 0 && (
          <div style={s.genres}>
            {genres.map((g) => (
              <span key={g} style={s.genreTag}>
                {g}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expand toggle */}
      <button style={s.expandBtn} onClick={() => setExpanded((p) => !p)}>
        {expanded ? "▲" : "▼"}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div style={s.expanded}>
          {movie.description && (
            <div style={s.expandSection}>
              <div style={s.expandLabel}>Synopsis</div>
              <div style={s.expandText}>{movie.description}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Styles ──────────────────────────────────────────────────────
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
    maxWidth: "600px",
    maxHeight: "88vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "24px 24px 16px",
    borderBottom: "2px solid #1A1A1A",
    background: "#E8E0D0",
    flexShrink: 0,
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
    fontSize: "26px",
    fontWeight: 900,
    color: "#1A1A1A",
    margin: "0 0 4px",
  },
  handle: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    color: "#8B7355",
    letterSpacing: "0.04em",
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
  statsStrip: {
    display: "flex",
    alignItems: "center",
    background: "#1A1A1A",
    padding: "12px 24px",
    gap: "0",
    flexShrink: 0,
  },
  stat: {
    flex: 1,
    textAlign: "center",
  },
  statNum: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "22px",
    fontWeight: 900,
    color: "#F5F0E8",
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "9px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#8B7355",
    marginTop: "3px",
  },
  statDivider: {
    width: "1px",
    height: "32px",
    background: "#2a2a2a",
  },
  controls: {
    padding: "14px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    borderBottom: "2px solid #1A1A1A",
    flexShrink: 0,
  },
  searchInput: {
    background: "#F5F0E8",
    border: "2px solid #1A1A1A",
    padding: "8px 12px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    color: "#1A1A1A",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  filterRow: {
    display: "flex",
  },
  filterBtn: {
    flex: 1,
    border: "2px solid #1A1A1A",
    borderRight: "none",
    padding: "6px 10px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    lastChild: { borderRight: "2px solid #1A1A1A" },
  },
  list: {
    overflowY: "auto",
    flex: 1,
    border: "2px solid #1A1A1A",
    margin: "0 24px 24px",
    marginTop: "0",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    gap: "8px",
    textAlign: "center",
  },
  emptyTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "20px",
    fontWeight: 900,
    color: "#1A1A1A",
  },
  emptyText: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    color: "#8B7355",
  },
  movieRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "14px 16px",
    flexWrap: "wrap",
    background: "#F5F0E8",
    position: "relative",
  },
  rowNum: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "20px",
    fontWeight: 900,
    color: "#D4C9B4",
    minWidth: "28px",
    lineHeight: 1,
    paddingTop: "2px",
    flexShrink: 0,
  },
  poster: {
    width: "48px",
    height: "68px",
    objectFit: "cover",
    border: "2px solid #1A1A1A",
    flexShrink: 0,
  },
  noPoster: {
    width: "48px",
    height: "68px",
    background: "#E8E0D0",
    border: "2px solid #1A1A1A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "18px",
    color: "#8B7355",
    flexShrink: 0,
  },
  movieInfo: {
    flex: 1,
    minWidth: "160px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  movieTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "15px",
    fontWeight: 700,
    color: "#1A1A1A",
    lineHeight: 1.2,
  },
  movieMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    alignItems: "center",
  },
  metaItem: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    color: "#8B7355",
    letterSpacing: "0.04em",
  },
  watchedTag: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "9px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "2px 7px",
  },
  stars: {
    display: "flex",
    gap: "1px",
  },
  genres: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
  },
  genreTag: {
    border: "1.5px solid #1A1A1A",
    padding: "2px 7px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "9px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#1A1A1A",
    background: "#F5F0E8",
  },
  expandBtn: {
    background: "transparent",
    border: "none",
    color: "#8B7355",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    cursor: "pointer",
    padding: "4px",
    alignSelf: "flex-start",
    marginLeft: "auto",
    flexShrink: 0,
  },
  expanded: {
    width: "100%",
    borderTop: "1px solid #D4C9B4",
    marginTop: "8px",
    paddingTop: "12px",
  },
  expandSection: {
    marginBottom: "10px",
  },
  expandLabel: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "9px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#8B7355",
    marginBottom: "4px",
  },
  expandText: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    color: "#1A1A1A",
    lineHeight: 1.6,
  },
};

export default FriendMoviesModal;
