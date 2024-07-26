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

// Function to create the RegT table if it doesn't exist
async function createTable(connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS RegT (
      INV INT,
      RegI INT,
      FirstN VARCHAR(255),
      LastN VARCHAR(255),
      Title VARCHAR(255),
      Email VARCHAR(255),
      BarID VARCHAR(255),
      Mini TINYINT(1),
      Cancelled TINYINT(1),
      Cancellation TEXT,
      MGT TINYINT(1),
      PRIMARY KEY (INV, RegI)
    )
  `);
}

// Function to insert data into the RegT table
async function insertData(connection, data) {
  const query = `
    INSERT INTO RegT 
    (INV, RegI, FirstN, LastN, Title, Email, BarID, Mini, Cancelled, Cancellation, MGT) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    FirstN = VALUES(FirstN),
    LastN = VALUES(LastN),
    Title = VALUES(Title),
    Email = VALUES(Email),
    BarID = VALUES(BarID),
    Mini = VALUES(Mini),
    Cancelled = VALUES(Cancelled),
    Cancellation = VALUES(Cancellation),
    MGT = VALUES(MGT)
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
    const fileContent = fs.readFileSync('./all_tables/RegT.txt', 'utf-8');
    const records = csv.parse(fileContent, { 
      columns: false, 
      skip_empty_lines: true,
      delimiter: ',',
      cast: (value, context) => {
        if (context.column === 0 || context.column === 1) return parseInt(value);
        if (context.column === 7 || context.column === 8 || context.column === 10) return value === '1' ? 1 : 0;
        return value;
      }
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