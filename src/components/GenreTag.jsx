// src/components/GenreTag.jsx
const GenreTag = ({ genre }) => (
  <span
    style={{
      border: "1.5px solid #1A1A1A",
      padding: "2px 8px",
      fontFamily: "'IBM Plex Mono',monospace",
      fontSize: "9px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "#1A1A1A",
      background: "#F5F0E8",
      whiteSpace: "nowrap",
    }}
  >
    {genre}
  </span>
);

export default GenreTag;
