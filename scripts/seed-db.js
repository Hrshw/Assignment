const { PrismaClient } = require('../src/generated/prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.incident.deleteMany({});
    await prisma.camera.deleteMany({});
    
    // Create cameras
    console.log('Creating cameras...');
    const locations = ['Main Entrance', 'Parking Lot', 'Lobby', 'Back Door', 'Server Room'];
    const cameras = [];
    
    for (let i = 0; i < 5; i++) {
      const camera = await prisma.camera.create({
        data: {
          name: `Camera ${i + 1}`,
          location: locations[i % locations.length],
        },
      });
      cameras.push(camera);
      console.log(`Created camera: ${camera.name} (${camera.location})`);
    }
    
    // Create incidents
    console.log('\nCreating incidents...');
    const incidentTypes = ['motion', 'intrusion', 'fire', 'unauthorized_access'];
    const now = new Date();
    
    for (let i = 0; i < 15; i++) {
      const startDate = faker.date.recent({ days: 7 });
      const endDate = new Date(startDate.getTime() + faker.number.int({ min: 10000, max: 60000 }));
      
      const incident = await prisma.incident.create({
        data: {
          type: faker.helpers.arrayElement(incidentTypes),
          tsStart: startDate,
          tsEnd: endDate,
          thumbnailUrl: `https://picsum.photos/seed/${faker.string.uuid()}/320/240`,
          resolved: faker.datatype.boolean(),
          camera: {
            connect: { id: faker.helpers.arrayElement(cameras).id }
          }
        },
        include: { camera: true }
      });
      
      console.log(`Created ${incident.type} incident at ${incident.camera.location} (${startDate.toLocaleString()})`);
    }
    
    console.log('\n✅ Database seeded successfully!');
    
  } catch (error) {
    console.error('\n❌ Error seeding database:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
