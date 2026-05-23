// Firebase authentication functions
// export const loginUser = async (email, password) => {
//   // Firebase login logic
// };

// export const logoutUser = async () => {
//   // Firebase logout logic
// };

// export const registerUser = async (email, password) => {
//   // Firebase registration logic
// };

// src/firebase/auth.js

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

const googleProvider = new GoogleAuthProvider();

// ── Google Sign-in ───────────────────────────────────────────
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  await createUserDocIfNotExists(result.user, "");
  return result.user;
};

// ── Email Sign-up ────────────────────────────────────────────
export const signUpWithEmail = async (
  email,
  password,
  displayName,
  username,
) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  await createUserDocIfNotExists(result.user, username);
  return result.user;
};

// ── Email Sign-in ────────────────────────────────────────────
export const signInWithEmail = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

// ── Sign-out ─────────────────────────────────────────────────
export const logOut = async () => {
  await signOut(auth);
};

// ── Create Firestore user doc (only on first login) ──────────
const createUserDocIfNotExists = async (user, username = "") => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      displayName: user.displayName || "",
      email: user.email,
      photoURL: user.photoURL || "",
      username: username || user.email.split("@")[0],
      bio: "",
      friends: [],
      createdAt: serverTimestamp(),
    });
  }
};
