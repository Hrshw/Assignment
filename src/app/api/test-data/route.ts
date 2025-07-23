import { NextResponse } from 'next/server';
import { PrismaClient } from '@generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Get counts
    const cameraCount = await prisma.camera.count();
    const incidentCount = await prisma.incident.count();
    
    // Get sample data
    const cameras = await prisma.camera.findMany();
    const incidents = await prisma.incident.findMany({
      include: { camera: true },
      take: 3
    });
    
    return NextResponse.json({ 
      status: 'success',
      counts: {
        cameras: cameraCount,
        incidents: incidentCount
      },
      sample: {
        cameras,
        incidents
      }
    });
  } catch (error) {
    console.error('Test data error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to fetch test data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
