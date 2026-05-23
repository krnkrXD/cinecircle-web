// src/components/StarRating.jsx

const StarRating = ({ rating, onRate, readOnly = false }) => {
  return (
    <div style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            ...styles.star,
            color: star <= rating ? "#f5c518" : "#444",
            cursor: readOnly ? "default" : "pointer",
          }}
          onClick={() => !readOnly && onRate(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    gap: "2px",
  },
  star: {
    fontSize: "20px",
    transition: "color 0.15s",
  },
};

export default StarRating;
// import React from 'react';

// const StarRating = () => {
//   return (
//     <div>StarRating</div>
//   );
// };

// export default StarRating;
