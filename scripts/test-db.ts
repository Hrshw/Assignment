import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    
    console.log('\nDatabase connection successful!');
    
    // Test querying cameras
    console.log('\nFetching cameras...');
    const cameras = await prisma.camera.findMany();
    console.log(`Found ${cameras.length} cameras`);
    
    // Test querying incidents
    console.log('\nFetching incidents...');
    const incidents = await prisma.incident.findMany({
      include: { camera: true },
      take: 3
    });
    
    console.log(`Found ${incidents.length} incidents`);
    console.log('\nSample incidents:');
    console.log(JSON.stringify(incidents, null, 2));
    
  } catch (error) {
    console.error('\nDatabase test failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
