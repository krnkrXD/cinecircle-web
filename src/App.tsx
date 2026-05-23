// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages
import Auth from "./pages/Auth";
import Library from "./pages/Library";
import MovieDetail from "./pages/MovieDetail";
import Watchlist from "./pages/Watchlist";
import Feed from "./pages/Feed";
import { useEffect } from "react";
import Friends from "./pages/Friends";

// ── Protected Route ───────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/auth" replace />;
};

// ── Public Route (redirect to library if already logged in) ───
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/library" replace />;
};

// ── App ───────────────────────────────────────────────────────
const App = () => {
  // src/App.jsx
  useEffect(() => {
    fetch(
      `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&s=inception`,
    )
      .then((r) => r.json())
      .then((d) => console.log(d));
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />

        {/* Protected */}
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <MovieDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          }
        />

        {/* Fallback — redirect root to library */}
        <Route path="*" element={<Navigate to="/library" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

// import { useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import "./App.css";
// import { app } from "./firebase/config";

// console.log("Firebase app name:", app.name);

// function App() {
//   // const [count, setCount] = useState(0)

//   return <>// Should print: Firebase app name: [DEFAULT]</>;
// }

// export default App;
