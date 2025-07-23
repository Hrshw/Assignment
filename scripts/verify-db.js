const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Verifying database setup...\n');

// Check if database file exists
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
console.log(`Checking database file at: ${dbPath}`);
console.log(`File exists: ${fs.existsSync(dbPath)}`);

if (fs.existsSync(dbPath)) {
  console.log(`\nDatabase file size: ${fs.statSync(dbPath).size} bytes`);
  
  // Try to read the database file
  try {
    const dbContent = fs.readFileSync(dbPath);
    console.log('\nFirst 100 bytes of database file (hex):');
    console.log(dbContent.subarray(0, 100).toString('hex'));
  } catch (error) {
    console.error('\nError reading database file:');
    console.error(error);
  }
}

// Try to query the database using sqlite3 if available
try {
  console.log('\nTrying to query database using sqlite3...');
  const output = execSync('sqlite3 prisma/dev.db ".tables"', { stdio: 'pipe' });
  console.log('\nTables in database:');
  console.log(output.toString());
  
  console.log('\nSample data from Camera table:');
  const cameraData = execSync('sqlite3 prisma/dev.db "SELECT * FROM Camera LIMIT 3;"', { stdio: 'pipe' });
  console.log(cameraData.toString());
  
  console.log('\nSample data from Incident table:');
  const incidentData = execSync('sqlite3 prisma/dev.db "SELECT id, type, resolved FROM Incident LIMIT 3;"', { stdio: 'pipe' });
  console.log(incidentData.toString());
  
} catch (error) {
  console.log('\nError querying database with sqlite3:');
  console.log('Make sure sqlite3 is installed and in your PATH');
  console.log('You can install it with: npm install -g sqlite3');
  console.error(error.message);
}
