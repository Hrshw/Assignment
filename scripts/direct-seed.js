const { PrismaClient } = require('@prisma/client');
const { randomUUID } = require('crypto');

console.log('Starting direct database seeding...');

async function seedDatabase() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    await prisma.$connect();
    console.log('Connected to database');

    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.incident.deleteMany({});
    await prisma.camera.deleteMany({});

    // Create cameras
    console.log('Creating cameras...');
    const camera1 = await prisma.camera.create({
      data: {
        id: randomUUID(),
        name: 'Front Entrance',
        location: 'Main Building - Front',
      },
    });

    const camera2 = await prisma.camera.create({
      data: {
        id: randomUUID(),
        name: 'Parking Lot',
        location: 'North Parking Area',
      },
    });

    const camera3 = await prisma.camera.create({
      data: {
        id: randomUUID(),
        name: 'Server Room',
        location: 'Basement - IT Department',
      },
    });

    console.log('Created 3 cameras');

    // Create incidents
    console.log('Creating incidents...');
    const incidentTypes = ['Unauthorised Access', 'Gun Threat', 'Face Recognised'];
    const now = new Date();
    const incidents = [];

    for (let i = 0; i < 15; i++) {
      const camera = [camera1, camera2, camera3][i % 3];
      const type = incidentTypes[i % 3];
      const timestamp = new Date(now);
      timestamp.setHours(timestamp.getHours() - (24 - i));
      
      const incident = await prisma.incident.create({
        data: {
          id: randomUUID(),
          type,
          tsStart: timestamp,
          tsEnd: new Date(timestamp.getTime() + 5 * 60 * 1000), // 5 minutes later
          thumbnailUrl: `/images/thumbnail${(i % 4) + 1}.jpg`,
          resolved: i % 3 === 0, // Every 3rd incident is resolved
          cameraId: camera.id,
        },
      });
      
      incidents.push(incident);
    }

    console.log(`Created ${incidents.length} incidents`);
    console.log('\nSample incident:');
    console.log(JSON.stringify(incidents[0], null, 2));
    
    console.log('\nDatabase seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
