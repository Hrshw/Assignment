const { PrismaClient } = require('@prisma/client');
const { randomUUID } = require('crypto');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');
  
  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.incident.deleteMany({});
  await prisma.camera.deleteMany({});

  // Create cameras
  console.log('Creating cameras...');
  const cameras = await Promise.all([
    prisma.camera.create({
      data: {
        name: 'Camera 01',
        location: 'Shop Floor A',
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera 02',
        location: 'Vault',
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera 03',
        location: 'Entrance',
      },
    }),
  ]);

  console.log(`Created ${cameras.length} cameras`);

  // Get current date for reference
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  // Create incidents spread over 24 hours
  const incidentTypes = ['Unauthorised Access', 'Gun Threat', 'Face Recognised'];
  const thumbnails = [
    '/images/thumbnail1.jpg',
    '/images/thumbnail2.jpg',
    '/images/thumbnail3.jpg',
    '/images/thumbnail4.jpg',
  ];

  // Helper to create a random timestamp within the last 24 hours
  const randomTimestamp = () => {
    const timestamp = new Date(yesterday);
    timestamp.setHours(timestamp.getHours() + Math.random() * 24);
    return timestamp;
  };

  // Helper to create an incident duration (1-5 minutes)
  const createIncidentDuration = (startTime) => {
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + Math.floor(Math.random() * 5) + 1);
    return endTime;
  };

  // Create 15 incidents
  const incidents = [];
  console.log('Creating incidents...');
  
  for (let i = 0; i < 15; i++) {
    const cameraIndex = i % cameras.length;
    const typeIndex = i % incidentTypes.length;
    const thumbnailIndex = i % thumbnails.length;
    
    const tsStart = randomTimestamp();
    const tsEnd = createIncidentDuration(tsStart);
    
    incidents.push(
      prisma.incident.create({
        data: {
          type: incidentTypes[typeIndex],
          tsStart,
          tsEnd,
          thumbnailUrl: thumbnails[thumbnailIndex],
          resolved: Math.random() > 0.7, // 30% are resolved
          cameraId: cameras[cameraIndex].id,
        },
      })
    );
  }

  await Promise.all(incidents);
  console.log(`Created ${incidents.length} incidents`);
  console.log('Database has been seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
