import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// No access token provided, just anon key
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const [policiesRes, investmentsRes, goalsRes] = await Promise.all([
    supabase.from("insurance_policies").select("*").order("created_at", { ascending: false }),
    supabase.from("investments").select("*").order("created_at", { ascending: false }),
    supabase.from("financial_goals").select("*").order("created_at", { ascending: false }),
  ]);
  console.log("Policies Error:", policiesRes.error);
  console.log("Investments Error:", investmentsRes.error);
  console.log("Goals Error:", goalsRes.error);
}
run();
