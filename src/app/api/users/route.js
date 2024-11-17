import { supabase } from "@/utils/supabaseClient";
import { NextResponse } from 'next/server';

export async function GET() {
  try {

    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*");

    return NextResponse.json(users);
  } catch (error) {
    console.error("Unexpected error:", error.message);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}