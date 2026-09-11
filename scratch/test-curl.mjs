import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { initializeApp as initAdminApp, cert, getApps as getAdminApps } from 'firebase-admin/app';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const serviceAccountStr = fs.readFileSync('secrets/firebase-service-account.json', 'utf8');
const serviceAccount = JSON.parse(serviceAccountStr);

if (!getAdminApps().length) {
  initAdminApp({
    credential: cert(serviceAccount)
  });
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

async function run() {
  const customToken = await getAdminAuth().createCustomToken("test-uid-777");
  const userCredential = await signInWithCustomToken(auth, customToken);
  const token = await userCredential.user.getIdToken();
  
  const res = await fetch("http://localhost:3000/api/test-portfolio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  });

  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
  process.exit(0);
}
run().catch(console.error);
