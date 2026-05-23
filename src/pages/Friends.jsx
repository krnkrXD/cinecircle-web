// src/pages/Friends.jsx

import FriendsList from "../components/FriendsList";
import { useNavigate } from "react-router-dom";

const Friends = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f0f0f" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: "1px solid #1a1a1a",
          backgroundColor: "#111",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <button
          onClick={() => navigate("/library")}
          style={{
            background: "transparent",
            border: "none",
            color: "#888",
            fontSize: "14px",
            cursor: "pointer",
            marginRight: "auto",
          }}
        >
          ← Library
        </button>
        <h1
          style={{
            color: "#fff",
            fontSize: "20px",
            fontWeight: "700",
            margin: 0,
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          👥 Friends
        </h1>
      </div>
      <FriendsList />
    </div>
  );
};

export default Friends;
