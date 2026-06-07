// migrations/runner.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/supermarket_accounting_system';
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Get migrations directory
    const migrationsDir = path.join(__dirname);
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.startsWith('migration_') && f.endsWith('.js'))
      .sort();

    // Get migrations collection to track applied migrations
    const db = mongoose.connection.db;
    const migrationsCollection = db.collection('_migrations');

    // Ensure migrations collection exists
    await migrationsCollection.createIndex({ name: 1 }, { unique: true });

    console.log(`\nFound ${migrationFiles.length} migration(s)\n`);

    // Run each migration
    for (const file of migrationFiles) {
      const migrationName = file.replace('.js', '');
      
      // Check if migration already applied
      const existing = await migrationsCollection.findOne({ name: migrationName });
      
      if (existing) {
        console.log(`⊘ ${migrationName} (already applied)`);
        continue;
      }

      try {
        // Load and run migration
        const migration = require(path.join(__dirname, file));
        await migration.up(db);

        // Record migration
        await migrationsCollection.insertOne({
          name: migrationName,
          applied_at: new Date()
        });

        console.log(`✓ ${migrationName} (applied)`);
      } catch (error) {
        console.error(`✗ ${migrationName} (failed)`, error.message);
        throw error;
      }
    }

    console.log('\n✓ All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
