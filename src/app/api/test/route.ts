import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert({
      user_id: "test_temp_uid_123",
      full_name: "Test Name",
      email: "test@example.com",
    }, { onConflict: "user_id", ignoreDuplicates: true });

  return NextResponse.json({ data, error });
}
