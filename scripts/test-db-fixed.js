// Import using the explicit path where Prisma client was generated
const { PrismaClient } = require('../src/generated/prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    
    console.log('\n✅ Database connection successful!');
    
    // Test querying cameras
    console.log('\nFetching cameras...');
    const cameras = await prisma.camera.findMany();
    console.log(`Found ${cameras.length} cameras`);
    
    if (cameras.length > 0) {
      console.log('Sample camera:');
      console.log(JSON.stringify(cameras[0], null, 2));
    }
    
    // Test querying incidents
    console.log('\nFetching incidents...');
    const incidents = await prisma.incident.findMany({
      include: { camera: true },
      take: 3
    });
    
    console.log(`Found ${incidents.length} incidents`);
    if (incidents.length > 0) {
      console.log('\nSample incident:');
      console.log(JSON.stringify(incidents[0], null, 2));
    }
    
  } catch (error) {
    console.error('\n❌ Database test failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
