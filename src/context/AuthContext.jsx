// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

const AuthContext = createContext(null);

// ── Custom hook ───────────────────────────────────────────────
export const useAuth = () => {
  return useContext(AuthContext);
};

// ── Provider ──────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase listener — fires on login, logout, and page refresh
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  const value = { currentUser, loading };

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render anything until Firebase confirms auth state */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
// import React, { createContext } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   return (
//     <AuthContext.Provider value={{}}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
