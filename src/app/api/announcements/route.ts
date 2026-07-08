import { NextResponse } from 'next/server';
import { getActiveAnnouncements } from '@/lib/announcements';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const messages = await getActiveAnnouncements();
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Announcements GET:', error);
    return NextResponse.json({ error: 'No se pudieron cargar los anuncios' }, { status: 500 });
  }
}
