const mysql = require('mysql2/promise');
const fs = require('fs');
const csv = require('csv-parser');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'njlm'
};

// Table name
const tableName = 'courses';

// Create table query
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Course VARCHAR(255) NOT NULL
  )
`;

// Insert query
const insertQuery = `
  INSERT INTO ${tableName} (Course) VALUES (?)
`;

async function importCSV() {
  let connection;

  try {
    // Create database connection
    connection = await mysql.createConnection(dbConfig);

    // Create table if it doesn't exist
    await connection.query(createTableQuery);

    // Read and process CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream('./all_tables/MiniCourseT.txt')
        .pipe(csv({ headers: ['Course'] }))
        .on('data', async (row) => {
          try {
            await connection.query(insertQuery, [row.Course]);
          } catch (error) {
            console.error('Error inserting row:', error);
          }
        })
        .on('end', () => {
          console.log('CSV file successfully processed');
          resolve();
        })
        .on('error', reject);
    });

    console.log('Data import completed successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

importCSV();