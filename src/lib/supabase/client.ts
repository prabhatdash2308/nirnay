"use client";

import { createClient } from "@supabase/supabase-js";

import { firebaseAuth } from "@/lib/firebase/client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
}

if (!supabasePublishableKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    accessToken: async () => {
      const user = firebaseAuth.currentUser;

      if (!user) {
        return null;
      }

      return user.getIdToken();
    },
  },
);