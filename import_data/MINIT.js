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

// Function to create the MINIT table if it doesn't exist
async function createTable(connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS MINIT (
      MINId INT,
      UnknownColumn INT,
      RegIDM INT,
      Qty INT,
      Sessions VARCHAR(255),
      Course VARCHAR(255),
      DateM DATETIME,
      Agency INT,
      PRIMARY KEY (MINId, RegIDM)
    )
  `);
}

// Function to insert data into the MINIT table
async function insertData(connection, data) {
  const query = `
    INSERT INTO MINIT 
    (MINId, UnknownColumn, RegIDM, Qty, Sessions, Course, DateM, Agency) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    UnknownColumn = VALUES(UnknownColumn),
    Qty = VALUES(Qty),
    Sessions = VALUES(Sessions),
    Course = VALUES(Course),
    DateM = VALUES(DateM),
    Agency = VALUES(Agency)
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
    const fileContent = fs.readFileSync('./all_tables/MINIT.txt', 'utf-8');
    const records = csv.parse(fileContent, { 
      columns: false, 
      skip_empty_lines: true,
      delimiter: ',',
      cast: (value, context) => {
        if ([0, 1, 2, 3, 7].includes(context.column)) return parseInt(value);
        if (context.column === 6) return new Date(value);
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