// Database setup script for IPIMS
// Run this after installing PostgreSQL locally

import pg from 'pg';
const { Pool } = pg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PostgreSQL database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  // Don't specify database initially - we'll create it
};

const targetDbName = process.env.DB_NAME || 'ipims_db';

async function setupDatabase() {
  console.log('🚀 Setting up IPIMS PostgreSQL database...');

  try {
    // Connect to PostgreSQL server (default postgres database)
    console.log(`🔍 Connecting to PostgreSQL as user: ${dbConfig.user}`);
    const pool = new Pool({
      ...dbConfig,
      database: 'postgres' // Connect to default database first
    });

    console.log(`✅ Successfully connected to PostgreSQL server`);

    // Create database if it doesn't exist
    console.log(`📝 Creating database ${targetDbName} if it doesn't exist...`);
    try {
      await pool.query(`CREATE DATABASE ${targetDbName}`);
      console.log(`✅ Database ${targetDbName} created`);
    } catch (err) {
      if (err.code === '42P04') {
        console.log(`ℹ️ Database ${targetDbName} already exists`);
      } else {
        throw err;
      }
    }

    await pool.end();

    // Connect to the specific database
    const dbPool = new Pool({
      ...dbConfig,
      database: targetDbName
    });

    console.log(`✅ Connected to ${targetDbName} database`);

    // Read and execute the PostgreSQL schema
    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Executing database schema...');

    await dbPool.query(schema);

    console.log('✅ Database schema executed successfully!');

    // Insert sample data
    console.log('🌱 Inserting sample data...');

    // Create a sample admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminEmail = 'admin@ipims.zm';

    try {
      await dbPool.query(`
        INSERT INTO admin_users (email, password_hash, first_name, last_name, role, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
      `, [adminEmail, adminPassword, 'System', 'Administrator', 'super_admin', true]);
      console.log('✅ Admin user created');
    } catch (err) {
      console.log('ℹ️ Admin user already exists');
    }

    // Create sample officers
    const officerPassword = await bcrypt.hash('officer123', 12);

    try {
      await dbPool.query(`
        INSERT INTO officers (officer_id, first_name, last_name, rank, department, station, email, password_hash, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (email) DO NOTHING
      `, ['OFF001', 'John', 'Mwansa', 'inspector', 'Criminal Investigation', 'Lusaka Central', 'officer@ipims.zm', officerPassword, true]);
      console.log('✅ Sample police officer created');
    } catch (err) {
      console.log('ℹ️ Sample police officer already exists');
    }

    // Create sample immigration officer
    const immigrationPassword = await bcrypt.hash('immigration123', 12);

    try {
      await dbPool.query(`
        INSERT INTO immigration_officers (officer_id, first_name, last_name, office_location, email, password_hash, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (email) DO NOTHING
      `, ['IMM001', 'Sarah', 'Banda', 'Kenneth Kaunda International Airport', 'immigration@ipims.zm', immigrationPassword, true]);
      console.log('✅ Sample immigration officer created');
    } catch (err) {
      console.log('ℹ️ Sample immigration officer already exists');
    }

    console.log('✅ Sample data inserted');
    console.log('🎉 IPIMS PostgreSQL database setup complete!');
    console.log('');
    console.log('📝 Sample login credentials:');
    console.log('┌─────────────────────────────────────┐');
    console.log('│ Admin Login:                        │');
    console.log('│ Email: admin@ipims.zm               │');
    console.log('│ Password: admin123                  │');
    console.log('├─────────────────────────────────────┤');
    console.log('│ Police Officer Login:               │');
    console.log('│ Email: officer@ipims.zm             │');
    console.log('│ Password: officer123                │');
    console.log('├─────────────────────────────────────┤');
    console.log('│ Immigration Officer Login:          │');
    console.log('│ Email: immigration@ipims.zm         │');
    console.log('│ Password: immigration123            │');
    console.log('└─────────────────────────────────────┘');
    console.log('');
    console.log('💡 Next steps:');
    console.log('  1. Run: npm run dev');
    console.log('  2. Open: http://localhost:5173');
    console.log('');

    await dbPool.end();

  } catch (error) {
    console.error('❌ Error setting up PostgreSQL database:', error.message);
    console.log('💡 Make sure PostgreSQL is installed and running');
    console.log('💡 Windows: Check Services for "postgresql-x64-XX"');
    console.log('💡 Download PostgreSQL from: https://www.postgresql.org/download/');
    console.log('');
    console.log('Full error:', error);
    process.exit(1);
  }
}

// Run the setup function
setupDatabase();

export { setupDatabase };