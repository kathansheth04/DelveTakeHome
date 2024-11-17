import { supabase } from '@/utils/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {

  try {
    const { data, error } = await supabase.rpc('get_pitr_status');

    if (error) {
      throw error;
    }

    const responseObject = data.reduce((acc, table) => {
      acc[table.database_name] = {
        pitrEnabled: table.pitr_enabled,
      };
      return acc;
    }, {});

    return NextResponse.json(responseObject);
  } catch (error) {
    console.error('Error fetching PITR status:', error.message);
    return NextResponse.json({ error: error.message });
  }
}
