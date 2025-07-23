import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resolved = searchParams.get('resolved');
    
    const whereClause = resolved !== null ? { resolved: resolved === 'true' } : {};
    
    const incidents = await prisma.incident.findMany({
      where: whereClause,
      include: {
        camera: true,
      },
      orderBy: {
        tsStart: 'desc', // newest first
      },
    });

    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}
