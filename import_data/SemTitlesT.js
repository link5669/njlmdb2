const mysql = require('mysql2/promise');
const fs = require('fs');
const csv = require('csv-parse/sync');

// MySQL connection configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'njlm'
};

// Function to create the table if it doesn't exist
async function createTable(connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS SemTitlesT (
      TitleID VARCHAR(255) PRIMARY KEY,
      SeminarTitle TEXT
    )
  `);
}

// Function to insert data into the table
async function insertData(connection, data) {
  const query = 'INSERT INTO SemTitlesT (TitleID, SeminarTitle) VALUES (?, ?) ON DUPLICATE KEY UPDATE SeminarTitle = VALUES(SeminarTitle)';
  for (const row of data) {
    await connection.execute(query, row);
  }
}

// Main function
async function main() {
  let connection;
  try {
    // Read and parse CSV data
    const fileContent = fs.readFileSync('./all_tables/SemTitlesT.txt', 'utf-8');
    const records = csv.parse(fileContent, { columns: false, skip_empty_lines: true });

    // Create MySQL connection
    connection = await mysql.createConnection(dbConfig);

    // Create table
    await createTable(connection);

    // Insert data
    await insertData(connection, records);

    console.log('Data imported successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();