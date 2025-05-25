const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');

async function checkSetup() {
  try {
    console.log('Attempting to connect to MySQL...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Port: ${process.env.DB_PORT}`);
    console.log(`User: ${process.env.DB_USER}`);

    // Test database connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log('✓ MySQL connection successful');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`✓ Database ${process.env.DB_NAME} exists or was created`);

    // Switch to the database
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Create tables from db_setup.sql
    const setupSQL = fs.readFileSync('./db_setup.sql', 'utf8');
    const statements = setupSQL
      .split(';')
      .filter(statement => statement.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log('✓ Database tables created/verified');

    // Verify tables exist
    const tables = ['users', 'recycling_items', 'payment_details', 'transactions'];
    for (const table of tables) {
      const [rows] = await connection.query(
        'SHOW TABLES LIKE ?',
        [table]
      );
      if (rows.length > 0) {
        console.log(`✓ Table '${table}' exists`);
      } else {
        throw new Error(`Table '${table}' is missing`);
      }
    }

    console.log('\n✅ Setup validation completed successfully!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('\nSetup validation failed:');
    console.error('Error details:', error.message);
    console.error('\nTroubleshooting steps:');
    console.error('1. Make sure MySQL server is running');
    console.error('2. Verify your MySQL password in .env is correct');
    console.error('3. Check if MySQL is running on the correct port (3306)');
    console.error('4. Try connecting to MySQL manually to verify credentials');
    process.exit(1);
  }
}

checkSetup();