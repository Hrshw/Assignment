const fs = require('fs');
const path = require('path');

console.log('Checking database file...');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
console.log('Database path:', dbPath);

// Check if file exists
if (!fs.existsSync(dbPath)) {
  console.error('Error: Database file does not exist');
  console.log('Current working directory:', process.cwd());
  console.log('Directory contents:', fs.readdirSync(path.join(__dirname, '..', 'prisma')));
  process.exit(1);
}

// Check file stats
const stats = fs.statSync(dbPath);
console.log('\nDatabase file stats:');
console.log('Size:', stats.size, 'bytes');
console.log('Created:', stats.birthtime);
console.log('Modified:', stats.mtime);

// Check file content (first 100 bytes)
console.log('\nFirst 100 bytes (hex):');
const fd = fs.openSync(dbPath, 'r');
const buffer = Buffer.alloc(100);
fs.readSync(fd, buffer, 0, 100, 0);
console.log(buffer.toString('hex'));
fs.closeSync(fd);

console.log('\nVerification complete.');
