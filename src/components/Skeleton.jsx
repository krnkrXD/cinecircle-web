// src/components/Skeleton.jsx
const Skeleton = ({ width = "100%", height = "16px" }) => (
  <div
    style={{
      width,
      height,
      background: "#E8E0D0",
      backgroundImage:
        "linear-gradient(90deg, #E8E0D0 25%, #D4C9B4 50%, #E8E0D0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
      border: "2px solid #D4C9B4",
    }}
  />
);

export default Skeleton;
