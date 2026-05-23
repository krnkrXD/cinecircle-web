// src/hooks/useMovies.js

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  subscribeToMovies,
  addMovie as addMovieToDb,
  updateMovie as updateMovieInDb,
  deleteMovie as deleteMovieFromDb,
} from "../firebase/firestore";

const useMovies = () => {
  const { currentUser } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Real-time listener ───────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);

    // Subscribe and get back the unsubscribe function
    const unsubscribe = subscribeToMovies(currentUser.uid, (movies) => {
      setMovies(movies);
      setLoading(false);
    });

    // Cleanup — unsubscribe when component unmounts
    return () => unsubscribe();
  }, [currentUser]);

  // ── Add movie ────────────────────────────────────────────────
  const addMovie = async (movieData) => {
    setError(null);
    try {
      const id = await addMovieToDb(currentUser.uid, movieData);
      return id;
    } catch (err) {
      setError("Failed to add movie. Please try again.");
      throw err;
    }
  };

  // ── Update movie (rating, watched, etc.) ────────────────────
  const updateMovie = async (movieId, updates) => {
    setError(null);
    try {
      await updateMovieInDb(currentUser.uid, movieId, updates);
    } catch (err) {
      setError("Failed to update movie. Please try again.");
      throw err;
    }
  };

  // ── Toggle watched status ────────────────────────────────────
  const toggleWatched = async (movieId, currentStatus) => {
    await updateMovie(movieId, { watched: !currentStatus });
  };

  // ── Update rating ────────────────────────────────────────────
  const updateRating = async (movieId, rating) => {
    await updateMovie(movieId, { rating });
  };

  // ── Delete movie ─────────────────────────────────────────────
  const deleteMovie = async (movieId) => {
    setError(null);
    try {
      await deleteMovieFromDb(currentUser.uid, movieId);
    } catch (err) {
      setError("Failed to delete movie. Please try again.");
      throw err;
    }
  };

  // ── Derived data ─────────────────────────────────────────────
  const watchedMovies = movies.filter((m) => m.watched);
  const unwatchedMovies = movies.filter((m) => !m.watched);

  return {
    // Data
    movies,
    watchedMovies,
    unwatchedMovies,
    loading,
    error,

    // Actions
    addMovie,
    updateMovie,
    toggleWatched,
    updateRating,
    deleteMovie,
  };
};

export default useMovies;
// import { useContext } from 'react';
// import { MovieContext } from '../context/MovieContext';

// export const useMovies = () => {
//   const context = useContext(MovieContext);
//   if (!context) {
//     throw new Error('useMovies must be used within MovieProvider');
//   }
//   return context;
// };
