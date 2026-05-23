// src/firebase/firestore.js

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "./config";
import { auth } from "./config";

// ── Movie CRUD ─────────────────────────────────────────────────

// Add a new movie to the user's library
export const addMovie = async (uid, movieData) => {
  const moviesRef = collection(db, "users", uid, "movies");
  const docRef = await addDoc(moviesRef, {
    ...movieData,
    watched: false,
    rating: 0,
    addedAt: serverTimestamp(),
  });
  return docRef.id;
};

// Get a single movie document
export const getMovie = async (uid, movieId) => {
  const movieRef = doc(db, "users", uid, "movies", movieId);
  const movieSnap = await getDoc(movieRef);
  if (movieSnap.exists()) {
    return { id: movieSnap.id, ...movieSnap.data() };
  }
  return null;
};

// Update any fields on a movie (rating, watched, etc.)
export const updateMovie = async (uid, movieId, updates) => {
  const movieRef = doc(db, "users", uid, "movies", movieId);
  await updateDoc(movieRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

// Delete a movie from the user's library
export const deleteMovie = async (uid, movieId) => {
  const movieRef = doc(db, "users", uid, "movies", movieId);
  await deleteDoc(movieRef);
};

// Real-time listener for all movies (used in useMovies hook)
export const subscribeToMovies = (uid, callback) => {
  const moviesRef = collection(db, "users", uid, "movies");
  const q = query(moviesRef, orderBy("addedAt", "desc"));

  // onSnapshot returns an unsubscribe function
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const movies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(movies);
  });

  return unsubscribe;
};

// ── Notes CRUD ─────────────────────────────────────────────────

// Add a note to a specific movie
export const addNote = async (uid, movieId, content) => {
  const notesRef = collection(db, "users", uid, "movies", movieId, "notes");
  const docRef = await addDoc(notesRef, {
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// Update an existing note
export const updateNote = async (uid, movieId, noteId, content) => {
  const noteRef = doc(db, "users", uid, "movies", movieId, "notes", noteId);
  await updateDoc(noteRef, {
    content,
    updatedAt: serverTimestamp(),
  });
};

// Delete a note
export const deleteNote = async (uid, movieId, noteId) => {
  const noteRef = doc(db, "users", uid, "movies", movieId, "notes", noteId);
  await deleteDoc(noteRef);
};

// Real-time listener for all notes on a movie
export const subscribeToNotes = (uid, movieId, callback) => {
  const notesRef = collection(db, "users", uid, "movies", movieId, "notes");
  const q = query(notesRef, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(notes);
  });

  return unsubscribe;
};

// ── Recommendations CRUD ───────────────────────────────────────

// Send a recommendation to a friend
export const addRec = async (fromUid, toUid, movieId, message) => {
  // Fetch the movie details to store in the rec
  const movieRef = doc(db, "users", fromUid, "movies", movieId);
  const movieSnap = await getDoc(movieRef);
  const movieData = movieSnap.exists() ? movieSnap.data() : {};

  const recsRef = collection(db, "recs");
  await addDoc(recsRef, {
    fromUid,
    fromEmail: auth.currentUser?.email || "",
    toUid,
    movieId,
    movieTitle: movieData.title || "",
    posterURL: movieData.posterURL || "",
    message,
    createdAt: serverTimestamp(),
  });
};

// Real-time listener for incoming recommendations
export const subscribeToRecs = (uid, callback) => {
  const recsRef = collection(db, "recs");
  const q = query(recsRef, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const recs = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((rec) => rec.toUid === uid);
    callback(recs);
  });

  return unsubscribe;
};

// Search users by username
export const searchUsersByUsername = async (username) => {
  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    where("username", ">=", username),
    where("username", "<=", username + "\uf8ff"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
};

// Add a friend (stores full friend info in array)
export const addFriend = async (uid, friend) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const current = userSnap.data().friends || [];

  // Avoid duplicates
  if (current.find((f) => f.uid === friend.uid)) return;

  await updateDoc(userRef, {
    friends: [
      ...current,
      {
        uid: friend.uid,
        displayName: friend.displayName,
        username: friend.username,
        email: friend.email,
      },
    ],
  });
};

// Remove a friend
export const removeFriend = async (uid, friendUid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const current = userSnap.data().friends || [];
  await updateDoc(userRef, {
    friends: current.filter((f) => f.uid !== friendUid),
  });
};

// Get current user's friends list
export const getFriends = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.data()?.friends || [];
};
// // Firestore database functions
// export const addMovie = async (movieData) => {
//   // Add movie to Firestore
// };

// export const getMovies = async () => {
//   // Get movies from Firestore
// };

// export const updateMovie = async (movieId, movieData) => {
//   // Update movie in Firestore
// };

// export const deleteMovie = async (movieId) => {
//   // Delete movie from Firestore
// };
