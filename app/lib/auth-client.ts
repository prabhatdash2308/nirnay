"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";

import { firebaseAuth } from "./firebase-client";

async function establishAuthenticatedRole(user: User) {
  const idToken = await user.getIdToken();

  const response = await fetch("/api/auth/ensure-role", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to establish authentication role.");
  }

  // Firebase custom claims propagate to a newly issued token.
  // Force a refresh so Supabase receives the updated role claim.
  await user.getIdToken(true);

  return user;
}

export async function signUpWithEmail(
  email: string,
  password: string,
) {
  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );

  return establishAuthenticatedRole(credential.user);
}

export async function signInWithEmail(
  email: string,
  password: string,
) {
  const credential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );

  return establishAuthenticatedRole(credential.user);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  const credential = await signInWithPopup(firebaseAuth, provider);

  return establishAuthenticatedRole(credential.user);
}

export async function logout() {
  await signOut(firebaseAuth);
}