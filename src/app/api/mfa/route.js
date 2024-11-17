import { supabase } from '@/utils/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {

  try {
    const { data, error } = await supabase.rpc('check_users_mfa_status');

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching PITR status:', error.message);
    return NextResponse.json({ error: error.message });
  }
}
