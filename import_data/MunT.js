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

// Function to create the MunT table if it doesn't exist
async function createTable(connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS MunT (
      MunID VARCHAR(255) PRIMARY KEY,
      Municipality VARCHAR(255),
      County VARCHAR(255),
      POBox VARCHAR(255),
      MunAddr1 VARCHAR(255),
      MunAddr2 VARCHAR(255),
      MunCity VARCHAR(255),
      MunState VARCHAR(2),
      MunZip VARCHAR(10)
    )
  `);
}

// Function to insert data into the MunT table
async function insertData(connection, data) {
  const query = `
    INSERT INTO MunT 
    (MunID, Municipality, County, POBox, MunAddr1, MunAddr2, MunCity, MunState, MunZip) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    Municipality = VALUES(Municipality),
    County = VALUES(County),
    POBox = VALUES(POBox),
    MunAddr1 = VALUES(MunAddr1),
    MunAddr2 = VALUES(MunAddr2),
    MunCity = VALUES(MunCity),
    MunState = VALUES(MunState),
    MunZip = VALUES(MunZip)
  `;

  for (const row of data) {
    await connection.execute(query, row);
  }
}

// Main function
async function main() {
  let connection;
  try {
    // Read and parse CSV data
    const fileContent = fs.readFileSync('./all_tables/MunT.txt', 'utf-8');
    const records = csv.parse(fileContent, { 
      columns: false, 
      skip_empty_lines: true,
      delimiter: ',',
      quote: '"',
      relax_column_count: true
    });

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