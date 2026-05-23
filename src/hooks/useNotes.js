// src/hooks/useNotes.js

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  subscribeToNotes,
  addNote as addNoteToDb,
  updateNote as updateNoteInDb,
  deleteNote as deleteNoteFromDb,
} from "../firebase/firestore";

const useNotes = (movieId) => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Real-time listener ───────────────────────────────────────
  useEffect(() => {
    if (!currentUser || !movieId) return;

    setLoading(true);

    const unsubscribe = subscribeToNotes(currentUser.uid, movieId, (notes) => {
      setNotes(notes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, movieId]);

  // ── Add note ─────────────────────────────────────────────────
  const addNote = async (content) => {
    setError(null);
    try {
      await addNoteToDb(currentUser.uid, movieId, content);
    } catch (err) {
      setError("Failed to add note. Please try again.");
      throw err;
    }
  };

  // ── Update note ──────────────────────────────────────────────
  const updateNote = async (noteId, content) => {
    setError(null);
    try {
      await updateNoteInDb(currentUser.uid, movieId, noteId, content);
    } catch (err) {
      setError("Failed to update note. Please try again.");
      throw err;
    }
  };

  // ── Delete note ──────────────────────────────────────────────
  const deleteNote = async (noteId) => {
    setError(null);
    try {
      await deleteNoteFromDb(currentUser.uid, movieId, noteId);
    } catch (err) {
      setError("Failed to delete note. Please try again.");
      throw err;
    }
  };

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
  };
};

export default useNotes;
// import { useState } from 'react';

// export const useNotes = () => {
//   const [notes, setNotes] = useState([]);

//   return {
//     notes,
//     setNotes,
//   };
// };
