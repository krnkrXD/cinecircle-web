// src/components/Skeleton.jsx

const Skeleton = ({
  width = "100%",
  height = "16px",
  borderRadius = "6px",
}) => (
  <div
    style={{
      width,
      height,
      borderRadius,
      backgroundColor: "#1a1a1a",
      backgroundImage:
        "linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }}
  />
);

export default Skeleton;
