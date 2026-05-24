// src/components/StarRating.jsx
const StarRating = ({ rating, onRate, readOnly = false }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => !readOnly && onRate(star)}
        style={{
          fontSize: "18px",
          color: star <= rating ? "#C4882E" : "#C4B99A",
          cursor: readOnly ? "default" : "pointer",
          lineHeight: 1,
        }}
      >
        ★
      </span>
    ))}
  </div>
);

export default StarRating;
