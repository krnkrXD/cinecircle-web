// src/components/GenreTag.jsx

const GenreTag = ({ genre }) => {
  return <span style={styles.tag}>{genre}</span>;
};

const styles = {
  tag: {
    backgroundColor: "#2a2a2a",
    color: "#aaa",
    fontSize: "11px",
    padding: "3px 8px",
    borderRadius: "20px",
    border: "1px solid #333",
    whiteSpace: "nowrap",
  },
};

export default GenreTag;
