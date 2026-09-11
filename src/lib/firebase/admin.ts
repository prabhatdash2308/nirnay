import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "node:fs";
import path from "node:path";

function getFirebaseAdminApp() {
  const existingApp = getApps()[0];

  if (existingApp) {
    return existingApp;
  }

  const serviceAccountPath = path.join(
    process.cwd(),
    "secrets",
    "firebase-service-account.json",
  );

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      "Firebase Admin service account file was not found.",
    );
  }

  const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8"),
  );

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}