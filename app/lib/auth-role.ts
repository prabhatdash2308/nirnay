"use client";

import { getIdTokenResult } from "firebase/auth";

import { firebaseAuth } from "./firebase-client";

export async function getCurrentAuthRole() {
  const user = firebaseAuth.currentUser;

  if (!user) {
    return null;
  }

  const tokenResult = await getIdTokenResult(user);

  return {
    uid: user.uid,
    role: tokenResult.claims.role ?? null,
  };
}