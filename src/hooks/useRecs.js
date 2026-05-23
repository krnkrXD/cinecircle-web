// src/hooks/useRecs.js

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeToRecs, addRec as addRecToDb } from "../firebase/firestore";

const useRecs = () => {
  const { currentUser } = useAuth();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Real-time listener ───────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);

    const unsubscribe = subscribeToRecs(currentUser.uid, (recs) => {
      setRecs(recs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // ── Send a recommendation ────────────────────────────────────
  const sendRec = async (toUid, movieId, message) => {
    setError(null);
    try {
      await addRecToDb(currentUser.uid, toUid, movieId, message);
    } catch (err) {
      setError("Failed to send recommendation.");
      throw err;
    }
  };

  return {
    recs,
    loading,
    error,
    sendRec,
  };
};

export default useRecs;
