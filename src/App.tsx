// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// @ts-ignore
import { useAuth } from "./context/AuthContext";

// @ts-ignore
import Auth from "./pages/Auth";
// @ts-ignore
import Library from "./pages/Library";
// @ts-ignore
import MovieDetail from "./pages/MovieDetail";
// @ts-ignore
import Watchlist from "./pages/Watchlist";
// @ts-ignore
import Feed from "./pages/Feed";
// @ts-ignore
import Friends from "./pages/Friends";

import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/library" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />
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
        <Route path="*" element={<Navigate to="/library" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
