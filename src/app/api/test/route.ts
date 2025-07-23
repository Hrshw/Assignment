import { NextResponse } from 'next/server';
import { PrismaClient } from '@generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connection successful',
      env: {
        databaseUrl: process.env.DATABASE_URL
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        env: {
          databaseUrl: process.env.DATABASE_URL
        }
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
