import { supabase } from '@/utils/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {

  try {
    const { data, error } = await supabase.rpc('check_rls_status');

    if (error) {
      throw error;
    }

    const responseObject = data.reduce((acc, table) => {
      acc[table.table_name] = {
        rlsEnabled: table.rls_enabled,
      };
      return acc;
    }, {});

    return NextResponse.json(responseObject);
  } catch (error) {
    console.error('Error fetching RLS status:', error.message);
    return NextResponse.json({ error: error.message });
  }
}
