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
const tableName = 'LIST_FOR_SUE';

// Create table query
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    ID VARCHAR(255),
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Title VARCHAR(255),
    Municipality VARCHAR(255),
    County VARCHAR(255),
    Address VARCHAR(255),
    CityStateZip VARCHAR(255),
    Labels VARCHAR(255)
  )
`;

// Insert query
const insertQuery = `
  INSERT INTO ${tableName} 
  (ID, FirstName, LastName, Title, Municipality, County, Address, CityStateZip, Labels) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      fs.createReadStream('./all_tables/LIST_FOR_SUE.txt')
        .pipe(csv({
          headers: ['ID', 'FirstName', 'LastName', 'Title', 'Municipality', 'County', 'Address', 'CityStateZip', 'Labels'],
          skipLines: 0
        }))
        .on('data', async (row) => {
          console.log('Row data:', row); // Log each row for debugging
          try {
            const values = [
              row.ID,
              row.FirstName,
              row.LastName,
              row.Title,
              row.Municipality,
              row.County,
              row.Address,
              row.CityStateZip,
              row.Labels
            ];
            console.log('Inserting values:', values); // Log the values being inserted
            await connection.query(insertQuery, values);
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