// src/components/MovieModal.jsx

import { useState } from "react";
import useMovies from "../hooks/useMovies";
import StarRating from "./StarRating";
import { useToast } from "../context/ToastContext";

const OMDB_KEY = import.meta.env.VITE_OMDB_API_KEY;

const MovieModal = ({ onClose }) => {
  const { addMovie } = useMovies();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rating, setRating] = useState(0);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ── Search OMDB ──────────────────────────────────────────────
  const handleSearch = async () => {
    if (!query.trim()) return;
    setError("");
    setSearching(true);
    setSelected(null);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${encodeURIComponent(query)}&type=movie`,
      );
      const data = await res.json();

      if (data.Response === "True") {
        setResults(data.Search);
      } else {
        setResults([]);
        setError("No movies found. Try a different title.");
      }
    } catch {
      setError("Search failed. Check your connection.");
    } finally {
      setSearching(false);
    }
  };

  // ── Select a movie — fetch full details ──────────────────────
  const handleSelect = async (movie) => {
    setError("");
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${movie.imdbID}&plot=short`,
      );
      const data = await res.json();
      setSelected(data);
      setResults([]);
      setQuery("");
    } catch {
      setError("Failed to load movie details.");
    }
  };

  // ── Save to Firestore ────────────────────────────────────────
  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await addMovie({
        title: selected.Title,
        posterURL: selected.Poster !== "N/A" ? selected.Poster : "",
        description: selected.Plot,
        genre: selected.Genre,
        year: selected.Year,
        imdbRating: selected.imdbRating,
        imdbID: selected.imdbID,
        rating,
      });
      showToast("Movie added to your library!");
      onClose();
    } catch {
      setError("Failed to save movie. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Add a movie</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Search bar */}
        <div style={styles.searchRow}>
          <input
            style={styles.input}
            type="text"
            placeholder="Search by movie title..."
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

        {/* Error */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Search results */}
        {results.length > 0 && (
          <div style={styles.results}>
            {results.map((movie) => (
              <div
                key={movie.imdbID}
                style={styles.resultItem}
                onClick={() => handleSelect(movie)}
              >
                {movie.Poster !== "N/A" ? (
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    style={styles.resultPoster}
                  />
                ) : (
                  <div style={styles.noPoster}>🎬</div>
                )}
                <div>
                  <p style={styles.resultTitle}>{movie.Title}</p>
                  <p style={styles.resultYear}>{movie.Year}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected movie preview */}
        {selected && (
          <div style={styles.selected}>
            <div style={styles.selectedTop}>
              {selected.Poster !== "N/A" && (
                <img
                  src={selected.Poster}
                  alt={selected.Title}
                  style={styles.selectedPoster}
                />
              )}
              <div style={styles.selectedInfo}>
                <h3 style={styles.selectedTitle}>{selected.Title}</h3>
                <p style={styles.selectedYear}>
                  {selected.Year} · {selected.Genre}
                </p>
                <p style={styles.selectedPlot}>{selected.Plot}</p>
                <p style={styles.selectedImdb}>
                  ⭐ IMDB: {selected.imdbRating}
                </p>
              </div>
            </div>

            {/* Personal rating */}
            <div style={styles.ratingRow}>
              <p style={styles.ratingLabel}>Your rating:</p>
              <StarRating rating={rating} onRate={setRating} />
            </div>

            <button
              style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Add to library"}
            </button>
          </div>
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
    maxWidth: "520px",
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
  searchRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
  },
  input: {
    flex: 1,
    backgroundColor: "#252525",
    border: "1px solid #333",
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
  error: {
    color: "#ff6b6b",
    fontSize: "13px",
    marginBottom: "12px",
  },
  results: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px",
    maxHeight: "260px",
    overflowY: "auto",
  },
  resultItem: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#222",
    border: "1px solid #2a2a2a",
  },
  resultPoster: {
    width: "40px",
    height: "56px",
    objectFit: "cover",
    borderRadius: "4px",
    flexShrink: 0,
  },
  noPoster: {
    width: "40px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333",
    borderRadius: "4px",
    fontSize: "20px",
    flexShrink: 0,
  },
  resultTitle: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    margin: "0 0 4px",
  },
  resultYear: {
    color: "#888",
    fontSize: "12px",
    margin: 0,
  },
  selected: {
    backgroundColor: "#222",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid #2a2a2a",
  },
  selectedTop: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
  },
  selectedPoster: {
    width: "80px",
    height: "112px",
    objectFit: "cover",
    borderRadius: "8px",
    flexShrink: 0,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedTitle: {
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 4px",
  },
  selectedYear: {
    color: "#888",
    fontSize: "12px",
    margin: "0 0 8px",
  },
  selectedPlot: {
    color: "#aaa",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "0 0 8px",
  },
  selectedImdb: {
    color: "#f5c518",
    fontSize: "13px",
    margin: 0,
  },
  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  ratingLabel: {
    color: "#aaa",
    fontSize: "14px",
    margin: 0,
  },
  saveBtn: {
    width: "100%",
    backgroundColor: "#e50914",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default MovieModal;
