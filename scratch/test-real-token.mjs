import { getApp, getApps as getAppsClient, initializeApp as initializeAppClient } from "firebase/app";
import { getAuth as getAuthClient, signInWithCustomToken } from "firebase/auth";
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const serviceAccountStr = fs.readFileSync('secrets/firebase-service-account.json', 'utf8');
const serviceAccount = JSON.parse(serviceAccountStr);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getAppsClient().length > 0 ? getApp() : initializeAppClient(firebaseConfig);
const auth = getAuthClient(app);

async function run() {
  const uid = 'test-uid-777';
  const customToken = await getAuth().createCustomToken(uid);
  const userCredential = await signInWithCustomToken(auth, customToken);
  const idToken = await userCredential.user.getIdToken();
  
  console.log("Got id token");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey, {
    accessToken: async () => idToken,
  });

  const [policiesRes, investmentsRes, goalsRes] = await Promise.all([
    supabase.from("insurance_policies").select("*").order("created_at", { ascending: false }),
    supabase.from("investments").select("*").order("created_at", { ascending: false }),
    supabase.from("financial_goals").select("*").order("created_at", { ascending: false }),
  ]);

  console.log("Policies Data length:", policiesRes.data?.length);
  console.log("Policies Error:", policiesRes.error);

  console.log("Investments Data length:", investmentsRes.data?.length);
  console.log("Investments Error:", investmentsRes.error);

  console.log("Goals Data length:", goalsRes.data?.length);
  console.log("Goals Error:", goalsRes.error);

  process.exit(0);
}

run().catch(console.error);
